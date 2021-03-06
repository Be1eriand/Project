import { Injectable } from '@angular/core';
import { Specification } from '@app/_models';

@Injectable({
  providedIn: 'root'
})
export class GroupTaskService {

  wps: Specification[];
  taskRun: {};

  constructor() { }

   // Group by Task and Run
   groupTaskRunforCharts(realtime, wps) {
    this.wps = wps;
    var wpsRealtime = []
    const merged = realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})
    this.taskRun = Object.values(merged);


    // Creating data to parse to charts/inner components
    // taskWPS[0] = all realtime, taskWPS[1] = wps, taskWPS[2] = summarised realtime
    for (var i in this.taskRun) {
      var taskWPS = []
      for (var j in wps) {
        if (wps[j]["Run_No"] == this.taskRun[i]['RunNo']) {
          taskWPS.push(this.taskRun[i]);
          taskWPS.push(wps[j]);
          taskWPS.push(this.weldActualRangeKnownIndex(i, j));
        }
      }

      wpsRealtime.push(taskWPS);
    }
    return wpsRealtime;
  };

  // Group realtime data by Task ID and Run No
  groupTaskRun(realtime) {
    const merged = realtime.reduce((r, { TaskID, RunNo, ...rest }) => {
      const key = `${TaskID}-${RunNo}`;
      r[key] = r[key] || { TaskID, RunNo, data: [] };
      r[key]["data"].push(rest)
      return r;
    }, {})
    let taskRun = Object.values(merged);
    return taskRun;
  };

  // Calculate weld range with known indexs. Min and max values, total duration, and variances for out of range. 
  weldActualRangeKnownIndex(i, j) {
    var result = []
    this.taskRun[i]['data'].reduce((r, a) => {

      if (!r[a.WelderID]) {
        r[a.WelderID] = r[a.WelderID] || {
          TaskID: this.taskRun[i]['TaskID'],
          RunNo: this.taskRun[i]['RunNo'],
          WelderID: a.WelderID,
          MachineID: a.MachineID,
          Date: a.Time.split('T')[0],
          TravelSpeed: 0,
          Timedelta: 0,
          Records: 0,

          Current_Min: a.Current,
          Current_Max: 0,
          Current_Over: 0,
          Current_Under: 0,
          Current_Overpercent: 0,
          Current_Underpercent: 0,
          Current_Sum: 0,


          Voltage_Min: a.Voltage,
          Voltage_Max: 0,
          Voltage_Over: 0,
          Voltage_Under: 0,
          Voltage_Overpercent: 0,
          Voltage_Underpercent: 0,
          Voltage_Sum: 0,

          HeatInput_Min: a.HeatInput,
          HeatInput_Max: 0,
          HeatInput_Over: 0,
          HeatInput_Under: 0,
          HeatInput_Overpercent: 0,
          HeatInput_Underpercent: 0,
          HeatInput_Sum: 0,

          TravelSpeed_Min: a.TravelSpeed,
          TravelSpeed_Max: 0,
          TravelSpeed_Over: 0,
          TravelSpeed_Under: 0,
          TravelSpeed_Overpercent: 0,
          TravelSpeed_Underpercent: 0,
          TravelSpeed_Sum: 0

        };
        result.push(r[a.WelderID])
      }
      r[a.WelderID].Timedelta += (a.Timedelta / 60);

      r[a.WelderID].Records += 1;

      // Current - Min Max
      r[a.WelderID].Current_Sum += a.Current;
      if (r[a.WelderID].Current_Min > a.Current) {
        r[a.WelderID].Current_Min = a.Current;
      }
      else if (r[a.WelderID].Current_Max < a.Current) {
        r[a.WelderID].Current_Max = a.Current;
      }
      if (a.Current > this.wps[j]["Current_Max"]) {
        r[a.WelderID].Current_Over += 1;
        var max = Number(this.wps[j]["Current_Max"]);
        r[a.WelderID].Current_Overpercent = (r[a.WelderID].Current_Max - max) / max * 100;
      }
      else if (a.Current < this.wps[j]["Current_Min"]) {
        r[a.WelderID].Current_Under += 1;
        var min = Number(this.wps[j]["Current_Min"]);
        r[a.WelderID].Current_Underpercent = (r[a.WelderID].Current_Min - min) / min * 100;
      }

      // Voltage
      r[a.WelderID].Voltage_Sum += a.Voltage;
      if (r[a.WelderID].Voltage_Min > a.Voltage || (r[a.WelderID].Voltage_Min == 0 && a.Voltage > 0)) {
        r[a.WelderID].Voltage_Min = a.Voltage;
      }
      else if (r[a.WelderID].Voltage_Max < a.Voltage) {
        r[a.WelderID].Voltage_Max = a.Voltage;
      }
      if (a.Voltage > this.wps[j]["Voltage_Max"]) {
        r[a.WelderID].Voltage_Over += 1;
        var max = Number(this.wps[j]["Voltage_Max"]);
        r[a.WelderID].Voltage_Overpercent = (r[a.WelderID].Voltage_Max - max) / max * 100;
      }
      else if (a.Voltage < this.wps[j]["Voltage_Min"] && a.Timedelta > 0) {
        r[a.WelderID].Voltage_Under += 1;
        var min = Number(this.wps[j]["Voltage_Min"]);
        r[a.WelderID].Voltage_Underpercent = (r[a.WelderID].Voltage_Min - min) / min * 100;
      }

      // Heat Input
      r[a.WelderID].HeatInput_Sum += a.HeatInput;
      if (r[a.WelderID].HeatInput_Min > a.HeatInput || (r[a.WelderID].HeatInput_Min == 0 && a.HeatInput > 0)) {
        r[a.WelderID].HeatInput_Min = a.HeatInput;
      }
      else if (r[a.WelderID].HeatInput_Max < a.HeatInput) {
        r[a.WelderID].HeatInput_Max = a.HeatInput;
      }
      if (a.HeatInput > this.wps[j]["HeatInput_Max"]) {
        r[a.WelderID].HeatInput_Over += 1;
        var max = Number(this.wps[j]["HeatInput_Max"]);
        r[a.WelderID].HeatInput_Overpercent = (r[a.WelderID].HeatInput_Max - max) / max * 100;
      }
      else if (a.HeatInput < this.wps[j]["HeatInput_Min"] && a.Timedelta > 0) {
        r[a.WelderID].HeatInput_Under += 1;
        var min = Number(this.wps[j]["HeatInput_Min"]);
        r[a.WelderID].HeatInput_Underpercent = (r[a.WelderID].HeatInput_Min - min) / min * 100;
      }

      // Travel Speed
      r[a.WelderID].TravelSpeed_Sum += a.TravelSpeed;
      if (r[a.WelderID].TravelSpeed_Min > a.TravelSpeed || (r[a.WelderID].TravelSpeed_Min == 0 && a.TravelSpeed > 0)) {
        r[a.WelderID].TravelSpeed_Min = a.TravelSpeed;
      }
      else if (r[a.WelderID].TravelSpeed_Max < a.TravelSpeed) {
        r[a.WelderID].TravelSpeed_Max = a.TravelSpeed;
      }
      if (a.TravelSpeed > this.wps[j]["TravelSpeed_Max"]) {
        r[a.WelderID].TravelSpeed_Over += 1;
        var max = Number(this.wps[j]["TravelSpeed_Max"]);
        r[a.WelderID].TravelSpeed_Overpercent = (r[a.WelderID].TravelSpeed_Max - max) / max * 100;
      }
      else if (a.TravelSpeed < this.wps[j]["TravelSpeed_Min"] && a.Timedelta > 0) {
        r[a.WelderID].TravelSpeed_Under += 1;
        var min = Number(this.wps[j]["TravelSpeed_Min"]);
        r[a.WelderID].TravelSpeed_Underpercent = (r[a.WelderID].TravelSpeed_Min - min) / min * 100;
      }
      return r;
    }, {});
    return result[0];

  };

  // Calculate min and max values, total duration, and variances for out of range. 
  weldActualRange(taskRun, wps) {
    var results = [];

    for (var i in taskRun) {
      var found = false;
      // For correct run number
      for (var j in wps) {

        if (wps[j]["Run_No"] == taskRun[i]['RunNo']) {

          var result = []
          taskRun[i]['data'].reduce((r, a) => {

            if (!r[a.WelderID]) {
              r[a.WelderID] = r[a.WelderID] || {
                RunNo: taskRun[i]['RunNo'],
                TaskID: taskRun[i]['TaskID'],
                WelderID: a.WelderID,
                MachineID: a.MachineID,
                Date: a.Time.split('T')[0],
                TravelSpeed: 0,
                Timedelta: 0,
                Records: 0,

                Current_Min: a.Current,
                Current_Max: 0,
                Current_Over: 0,
                Current_Under: 0,
                Current_Overpercent: 0,
                Current_Underpercent: 0,
                Current_Sum: 0,


                Voltage_Min: a.Voltage,
                Voltage_Max: 0,
                Voltage_Over: 0,
                Voltage_Under: 0,
                Voltage_Overpercent: 0,
                Voltage_Underpercent: 0,
                Voltage_Sum: 0,

                HeatInput_Min: a.HeatInput,
                HeatInput_Max: 0,
                HeatInput_Over: 0,
                HeatInput_Under: 0,
                HeatInput_Overpercent: 0,
                HeatInput_Underpercent: 0,
                HeatInput_Sum: 0,

                TravelSpeed_Min: a.TravelSpeed,
                TravelSpeed_Max: 0,
                TravelSpeed_Over: 0,
                TravelSpeed_Under: 0,
                TravelSpeed_Overpercent: 0,
                TravelSpeed_Underpercent: 0,
                TravelSpeed_Sum: 0

              };
              result.push(r[a.WelderID])
            }
            r[a.WelderID].Timedelta += (a.Timedelta / 60);

            r[a.WelderID].Records += 1;

            // Current - Min Max
            r[a.WelderID].Current_Sum += a.Current;
            if (r[a.WelderID].Current_Min > a.Current) {
              r[a.WelderID].Current_Min = a.Current;
            }
            else if (r[a.WelderID].Current_Max < a.Current) {
              r[a.WelderID].Current_Max = a.Current;
            }
            if (a.Current > wps[j]["Current_Max"]) {
              r[a.WelderID].Current_Over += 1;
              var max = Number(wps[j]["Current_Max"]);
              r[a.WelderID].Current_Overpercent = (r[a.WelderID].Current_Max - max) / max * 100;
            }
            else if (a.Current < wps[j]["Current_Min"]) {
              r[a.WelderID].Current_Under += 1;
              var min = Number(wps[j]["Current_Min"]);
              r[a.WelderID].Current_Underpercent = (r[a.WelderID].Current_Min - min) / min * 100;
            }

            // Voltage
            r[a.WelderID].Voltage_Sum += a.Voltage;
            if (r[a.WelderID].Voltage_Min > a.Voltage || (r[a.WelderID].Voltage_Min == 0 && a.Voltage > 0)) {
              r[a.WelderID].Voltage_Min = a.Voltage;
            }
            else if (r[a.WelderID].Voltage_Max < a.Voltage) {
              r[a.WelderID].Voltage_Max = a.Voltage;
            }
            if (a.Voltage > wps[j]["Voltage_Max"]) {
              r[a.WelderID].Voltage_Over += 1;
              var max = Number(wps[j]["Voltage_Max"]);
              r[a.WelderID].Voltage_Overpercent = (r[a.WelderID].Voltage_Max - max) / max * 100;
            }
            else if (a.Voltage < wps[j]["Voltage_Min"] && a.Timedelta > 0) {
              r[a.WelderID].Voltage_Under += 1;
              var min = Number(wps[j]["Voltage_Min"]);
              r[a.WelderID].Voltage_Underpercent = (r[a.WelderID].Voltage_Min - min) / min * 100;
            }

            // Heat Input
            r[a.WelderID].HeatInput_Sum += a.HeatInput;
            if (r[a.WelderID].HeatInput_Min > a.HeatInput || (r[a.WelderID].HeatInput_Min == 0 && a.HeatInput > 0)) {
              r[a.WelderID].HeatInput_Min = a.HeatInput;
            }
            else if (r[a.WelderID].HeatInput_Max < a.HeatInput) {
              r[a.WelderID].HeatInput_Max = a.HeatInput;
            }
            if (a.HeatInput > wps[j]["HeatInput_Max"]) {
              r[a.WelderID].HeatInput_Over += 1;
              var max = Number(wps[j]["HeatInput_Max"]);
              r[a.WelderID].HeatInput_Overpercent = (r[a.WelderID].HeatInput_Max - max) / max * 100;
            }
            else if (a.HeatInput < wps[j]["HeatInput_Min"] && a.Timedelta > 0) {
              r[a.WelderID].HeatInput_Under += 1;
              var min = Number(wps[j]["HeatInput_Min"]);
              r[a.WelderID].HeatInput_Underpercent = (r[a.WelderID].HeatInput_Min - min) / min * 100;
            }

            // Travel Speed
            r[a.WelderID].TravelSpeed_Sum += a.TravelSpeed;
            if (r[a.WelderID].TravelSpeed_Min > a.TravelSpeed || (r[a.WelderID].TravelSpeed_Min == 0 && a.TravelSpeed > 0)) {
              r[a.WelderID].TravelSpeed_Min = a.TravelSpeed;
            }
            else if (r[a.WelderID].TravelSpeed_Max < a.TravelSpeed) {
              r[a.WelderID].TravelSpeed_Max = a.TravelSpeed;
            }
            if (a.TravelSpeed > wps[j]["TravelSpeed_Max"]) {
              r[a.WelderID].TravelSpeed_Over += 1;
              var max = Number(wps[j]["TravelSpeed_Max"]);
              r[a.WelderID].TravelSpeed_Overpercent = (r[a.WelderID].TravelSpeed_Max - max) / max * 100;
            }
            else if (a.TravelSpeed < wps[j]["TravelSpeed_Min"] && a.Timedelta > 0) {
              r[a.WelderID].TravelSpeed_Under += 1;
              var min = Number(wps[j]["TravelSpeed_Min"]);
              r[a.WelderID].TravelSpeed_Underpercent = (r[a.WelderID].TravelSpeed_Min - min) / min * 100;
            }


            return r;
          }, {});
          results.push(result);
        };
      }
    }
    return results;
  };

}

