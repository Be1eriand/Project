export class TaskData { //This is the RealTime Task Data
    WelderID: string;
    MachineID: string;
    TaskID: string;
    RunNo: string;
}

export class RealTimeData { // Is this needed?
    Time: string;
    Current: string;
    Voltage: string;
    Temperature: string;
    Length: string;
    WireFeedrate: string;
    GasUsed: string;
    HeatInput: string;
    TravelSpeed: string;
    Timedelta: string;
    Power: string;
}

export class RealTimeView {

    TaskID: string;
    RunNo: string;
    WelderID: string;
    MachineID: string;
    Time: string;
    Current: string;
    Voltage: string;
    Temperature: string;
    Length: string;
    WireFeedrate: string;
    GasUsed: string;
    HeatInput: string;
    TravelSpeed: string;
    Timedelta: string;
    Power: string;
}