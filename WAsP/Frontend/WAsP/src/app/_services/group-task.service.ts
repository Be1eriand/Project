/*import { Injectable } from '@angular/core';
import { RealTimeView } from '@app/_models/realtime';
import { Observable, } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupTaskService {

  constructor() { }

  // Group realtime data by task ID
  groupTask(realtime: RealTimeView[]) {
    var result = realtime.reduce(function (r, a) {
      r[a.TaskID] = r[a.TaskID] || [];
      r[a.TaskID].push(a);
      return r;
    }, {});
    
    return result;
  }

  // Group by Task and Run
  groupTaskRun(realtime: RealTimeView[]) {
    const merged = realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})
    var taskRun = Object.values(merged);

    return this.weldActualRange(taskRun);
  }

  // Calculate Min and Max values
  weldActualRange(taskRun: {}, wps: Specification[][]) {
    var results = [];

    for (var i in taskRun) {

      // WPS Task data
      var wpsTask = thiswps[this.validTaskID.indexOf(this.taskRun[i]['TaskID'])]

      // For correct run number
      for (var j in wpsTask) {
        if (wpsTask[j]["Run_No"] == this.taskRun[i]['RunNo']) {

          var result = []
          this.taskRun[i]['data'].reduce((r, a) => {

            if (!r[a.WelderID]) {
              r[a.WelderID] = r[a.WelderID] || {
                RunNo: this.taskRun[i]['RunNo'],
                TaskID: this.taskRun[i]['TaskID'],
                WelderID: a.WelderID,
                MachineID: a.MachineID,
                Date: a.Time.split('T')[0],
                TravelSpeed: 0,
                Timedelta: 0,

                Current_Min: a.Current,
                Current_Max: 0,
                Current_Overtime: 0,
                Current_Undertime: 0,
                Current_Overpercent: 0,
                Current_Underpercent: 0,


                Voltage_Min: a.Voltage,
                Voltage_Max: 0,
                Voltage_Overtime: 0,
                Voltage_Undertime: 0,
                Voltage_Overpercent: 0,
                Voltage_Underpercent: 0,

                HeatInput_Min: a.HeatInput,
                HeatInput_Max: 0,
                HeatInput_Overtime: 0,
                HeatInput_Undertime: 0,
                HeatInput_Overpercent: 0,
                HeatInput_Underpercent: 0,

                InterpassTemp_Min: a.Temperature,
                InterpassTemp_Max: 0,
                InterpassTemp_Overtime: 0,
                InterpassTemp_Undertime: 0,
                InterpassTemp_Overpercent: 0,
                InterpassTemp_Underpercent: 0,

                TravelSpeed_Min: a.TravelSpeed,
                TravelSpeed_Max: 0,
                TravelSpeed_Overtime: 0,
                TravelSpeed_Undertime: 0,
                TravelSpeed_Overpercent: 0,
                TravelSpeed_Underpercent: 0,

              };
              result.push(r[a.WelderID])
            }
            r[a.WelderID].Timedelta += (a.Timedelta / 60);

            // Current - Min Max
            if (r[a.WelderID].Current_Min > a.Current) {
              r[a.WelderID].Current_Min = a.Current;
            }
            else if (r[a.WelderID].Current_Max < a.Current) {
              r[a.WelderID].Current_Max = a.Current;
            }
            if (a.Current > wpsTask[j]["Current_Max"]) {
              r[a.WelderID].Current_Overtime += ( a.Timedelta / 60);
              var max = Number(wpsTask[j]["Current_Max"]);
              r[a.WelderID].Current_Overpercent = (r[a.WelderID].Current_Max - max) / max * 100;
            }
            else if (a.Current < wpsTask[j]["Current_Min"]) {
              r[a.WelderID].Current_Undertime += ( a.Timedelta / 60);
              var min = Number(wpsTask[j]["Current_Min"]);
              r[a.WelderID].Current_Underpercent = (r[a.WelderID].Current_Min - min) / min * 100;
            }

            // Voltage
            if (r[a.WelderID].Voltage_Min > a.Voltage || (r[a.WelderID].Voltage_Min == 0 && a.Voltage > 0)) {
              r[a.WelderID].Voltage_Min = a.Voltage;
            }
            else if (r[a.WelderID].Voltage_Max < a.Voltage) {
              r[a.WelderID].Voltage_Max = a.Voltage;
            }
            if (a.Voltage > wpsTask[j]["Voltage_Max"]) {
              r[a.WelderID].Voltage_Overtime += ( a.Timedelta / 60);
              var max = Number(wpsTask[j]["Voltage_Max"]);
              r[a.WelderID].Voltage_Overpercent = (r[a.WelderID].Voltage_Max - max) / max * 100;
            }
            else if (a.Voltage < wpsTask[j]["Voltage_Min"] && a.Timedelta > 0) {
              r[a.WelderID].Voltage_Undertime += ( a.Timedelta / 60);
              var min = Number(wpsTask[j]["Voltage_Min"]);
              r[a.WelderID].Voltage_Underpercent = (r[a.WelderID].Voltage_Min - min) / min * 100;
            }

            // Heat Input
            if (r[a.WelderID].HeatInput_Min > a.HeatInput || (r[a.WelderID].HeatInput_Min == 0 && a.HeatInput > 0)) {
              r[a.WelderID].HeatInput_Min = a.HeatInput;
            }
            else if (r[a.WelderID].HeatInput_Max < a.HeatInput) {
              r[a.WelderID].HeatInput_Max = a.HeatInput;
            }
            if (a.HeatInput > wpsTask[j]["HeatInput_Max"]) {
              r[a.WelderID].HeatInput_Overtime += ( a.Timedelta / 60);
              var max = Number(wpsTask[j]["HeatInput_Max"]);
              r[a.WelderID].HeatInput_Overpercent = (r[a.WelderID].HeatInput_Max - max) / max * 100;
            }
            else if (a.HeatInput < wpsTask[j]["HeatInput_Min"] && a.Timedelta > 0) {
              r[a.WelderID].HeatInput_Undertime += ( a.Timedelta / 60);
              var min = Number(wpsTask[j]["HeatInput_Min"]);
              r[a.WelderID].HeatInput_Underpercent = (r[a.WelderID].HeatInput_Min - min) / min * 100;
            }

            // Travel Speed
            if (r[a.WelderID].TravelSpeed_Min > a.TravelSpeed || (r[a.WelderID].TravelSpeed_Min < 0 && a.TravelSpeed > 0)) {
              r[a.WelderID].TravelSpeed_Min = a.TravelSpeed;
            }
            else if (r[a.WelderID].TravelSpeed_Max < a.TravelSpeed) {
              r[a.WelderID].TravelSpeed_Max = a.TravelSpeed;
            }
            if (a.TravelSpeed > wpsTask[j]["TravelSpeed_Max"]) {
              r[a.WelderID].TravelSpeed_Overtime += ( a.Timedelta / 60);
              var max = Number(wpsTask[j]["TravelSpeed_Max"]);
              r[a.WelderID].TravelSpeed_Overpercent = (r[a.WelderID].TravelSpeed_Max - max) / max * 100;
            }
            else if (a.TravelSpeed < wpsTask[j]["TravelSpeed_Min"] && a.Timedelta > 0) {
              r[a.WelderID].TravelSpeed_Undertime += ( a.Timedelta / 60);
              var min = Number(wpsTask[j]["TravelSpeed_Min"]);
              r[a.WelderID].TravelSpeed_Underpercent = (r[a.WelderID].TravelSpeed_Min - min) / min * 100;
            }

            // Interpass Temp
            if (r[a.WelderID].InterpassTemp_Min > a.Temperature || (r[a.WelderID].InterpassTemp_Min == 0 && a.Temperature > 0)) {
              r[a.WelderID].InterpassTemp_Min = a.Temperature;
            }
            else if (r[a.WelderID].InterpassTemp_Max < a.Temperature) {
              r[a.WelderID].InterpassTemp_Max = a.Temperature;
            }
            if (a.InterpassTemp > wpsTask[j]["InterpassTemp_Max"] && wpsTask[j]["InterpassTemp_Max"].length > 0) {
              r[a.WelderID].InterpassTemp_Overtime += ( a.Timedelta / 60);
              var max = Number(wpsTask[j]["InterpassTemp_Max"]);
              r[a.WelderID].InterpassTemp_Overpercent = (r[a.WelderID].InterpassTemp_Max - max) / max * 100;
            }
            else if (a.InterpassTemp < wpsTask[j]["InterpassTemp_Min"] && 
                      wpsTask[j]["InterpassTemp_Min"].length > 0 &&
                      a.Timedelta > 0) {
              r[a.WelderID].InterpassTemp_Undertime += ( a.Timedelta / 60);
              var min = Number(wpsTask[j]["InterpassTemp_Min"]);
              r[a.WelderID].InterpassTemp_Underpercent = (r[a.WelderID].InterpassTemp_Min - min) / min * 100;
            }
            return r;
          }, {});
        }
      }

    }
    results.push(result);
    return this.groupTask2(results);

  }

  // After collecting Min Max value by run, group by Task ID again
  groupTask2(results: {}) {
    var result = results[0].reduce(function (r, a) {
      r[a.TaskID] = r[a.TaskID] || [];
      r[a.TaskID].push(a);
      return r;
    }, {});
    return result; 
  }
}
*/
