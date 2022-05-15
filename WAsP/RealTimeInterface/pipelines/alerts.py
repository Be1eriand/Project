#Definition for the Alerts Pipeline
#This is where some of the Magic will happen with the Real Time Alerts
from datetime import datetime
from pprint import pprint
from typing import Dict, List
from django.db import IntegrityError
from sqlalchemy.orm import Session
from sqlalchemy import text
from SensorData import SensorData

from core.utils import Settings, hash_numbers, convert_to_dateTime
from core.exceptions import NoSpecificationFound
from pipelines.pipe import Pipe

from models.models import AlertTypes, SpecTypes, AlertView, AlertsTable
from models.models import WPSView


class AlertsPipe(Pipe):

    def __init__(self, session, alert_list) -> None:
        super().__init__()
        self.alertsTable: Dict = {}
        self.alertTypes: Dict = {}
        self.specTypes: Dict = {}
        self.specifications: Dict = {}
        self.session: Session = session
        self.alert_list: List = alert_list
        
        #Load the types for local use
        _alert_types = self.session.query(AlertTypes).all()
        _spec_types = self.session.query(SpecTypes).all()

        self.alertTypes = {alert.id: alert.Description for alert in _alert_types}
        self.rAlertTypes = {alert.Description: alert.id for alert in _alert_types}

        self.specTypes = {spec.id: spec.Description for spec in _spec_types}
        self.rSpecTypes = {spec.Description: spec.id for spec in _spec_types}

        #initialise the Alerts Table with any alerts that are still open and not closed
        _alerts = self.session.query(AlertView).filter(AlertView.FinishTime.is_(None)).all()
        
        #Hash the TaskID and SpecType to create an individual hash for each alert
        self.alertsTable = {hash_numbers(_alert.TaskID, self.rSpecTypes[_alert.SpecType]): _alert.__dict__  for _alert in _alerts}

    @classmethod
    def _get_sessions_list_from_settings(self, settings: Settings):
        return settings.get('Databases').properties['session']
    
    @classmethod
    def _get_alert_list_from_settings(self, settings: Settings):
        return settings.getlist('ALERT_LIST')

    @classmethod
    def from_settings(cls, settings: Settings):
        sesslist = cls._get_sessions_list_from_settings(settings)
        alertlist = cls._get_alert_list_from_settings(settings)
        
        return cls(sesslist[0], alertlist)

    def process_data(self, dict: Dict) -> Dict:

        print("Processing Alerts")
        
        TaskID = dict['processed']['TaskID']
        RunNo = dict['processed']['RunNo']
        spec = self._get_specification(TaskID,RunNo)

        self._validate_data(dict['processed'], spec)

        return dict

    def _get_specification(self, TaskID, RunNo) -> Dict:

        #Generate a unique identifer based on TaskID and RunNo to make it easier
        hash = hash_numbers(TaskID, RunNo)

        if hash not in self.specifications:
            #Add the specfication into the list
            self.specifications[hash] = self._retrieve_from_database(TaskID, RunNo)

        if self.specifications[hash] == {}:
            print('No Specification was found in the database')
            raise NoSpecificationFound()

        return self.specifications[hash]
    
    def _retrieve_from_database(self, TaskID, RunNo):

        try:
            record = self.session.query(WPSView).filter(text(f'id={TaskID} and Run_No={RunNo}')).one_or_none()
        except Exception as e:
            pprint("Error has occured in retrieving the specification")
            pprint(e)
        
        return record.__dict__ if record is not None else {}
    
    def _validate_data(self, data: SensorData, spec: Dict):

        for spec_variable in self.alert_list:
            
            alert_type = self._check_within_spec(data, spec_variable, spec)

            self._check_alert(data, spec_variable, alert_type)
    
    def _check_within_spec(self, data, spec_variable, spec):

        #Wish Python had switch cases, but oh well

        variable_to_check = data[spec_variable.lower()]

        if variable_to_check is None:
            Alert = 'Missing'
        elif variable_to_check == 0 :
            Alert = 'Zero' if data['timedelta'] != 0.00 else 'None'
        elif variable_to_check < 0 :
            Alert = 'Invalid'
        elif variable_to_check > spec[spec_variable +'_Max']: #Is the Variable exceeding the Maximum
            Alert = 'High'
        elif variable_to_check < spec[spec_variable +'_Min']: #Is the Variable below the Minimum
            Alert = 'Low'
        else:
            Alert = 'None'
        
        return Alert

    def _create_alert(self, data, spec_variable, alert_type):

        if alert_type=='Zero':
            pprint(data)

        try:
            alert = AlertsTable(
                TaskID=data['TaskID'],
                RunNo=data['RunNo'],
                StartTime= data['time'],
                AlertType=self.rAlertTypes[alert_type],
                SpecType=self.rSpecTypes[spec_variable]
            )
            self.session.add(alert)
            self.session.commit()

            hash = hash_numbers(alert.TaskID, alert.SpecType)
            self.alertsTable[hash] = alert.__dict__
            self.alertsTable[hash]['SpecType'] = self.specTypes[alert.SpecType]
            self.alertsTable[hash]['AlertType'] = self.alertTypes[alert.AlertType]

        except IntegrityError:
            pprint("Integrity Error. Unable to create an alert")
            self.session.rollback()

        pprint("Alert has been created")

    def _check_alert(self, data, spec_variable, alert_type):

        TaskID = data['TaskID']
        alert = self._get_alert(TaskID, spec_variable)

        #Is there a better way to write all this to avoid the 'if' statementss
        try:
            if alert_type == 'None': #Variable is not out of Spec
                if alert is not None:
                    self._close_alert(alert)
            else: #Variable is out of spec
                if alert is None: #No Alert Exists
                    self._create_alert(data, spec_variable, alert_type)
                else: #Alert exists for the variable
                    if alert_type != alert['AlertType']: #AlertType is not the same as the current AlertType
                        self._close_alert(alert)
                        self._create_alert(data, spec_variable, alert_type)
        except Exception as e:
            print("The Error is in Check Alert!")
            pprint(data)
            pprint(spec_variable)
            pprint(alert_type)
            pprint(alert)
            pprint(e)

    def _close_alert(self, alert):
        
        try:
            #remove the alert for the AlertsTable
            SpecID = self.rSpecTypes[alert['SpecType']]
            hash = hash_numbers(alert['TaskID'], SpecID)
            del self.alertsTable[hash] #This is the fucking cause

            #Close the Alert and place a End Time for the Alert
            self.session.query(AlertView).filter(AlertView.id==alert["id"]).update({"FinishTime": datetime.now()})
        except Exception:
            print("The error occured in Close Alert")

    def _get_alert(self, TaskID, spec_variable):
        
        SpecID = self.rSpecTypes[spec_variable]
        hash = hash_numbers(TaskID, SpecID)
        
        return self.alertsTable[hash] if hash in self.alertsTable else None