#Definition for the Alerts Pipeline
#This is where some of the Magic will happen with the Real Time Alerts
from typing import Dict
from pipelines.pipe import Pipe


class AlertsPipe(Pipe):

    def __init__(self) -> None:
        super().__init__()
        self.alertsTable: Dict = {}
        self.specifications: Dict = {}

        #print(settings)

    def process_data(self, dict) -> Dict:

        return dict