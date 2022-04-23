export class Contract {
    id: string;
    ContractName: string;
    Details: string;
}

export class TaskView {
    TaskID: string;
    WPS_No: string;
    FullName: string;
    MachineName: string;
}

export class Task {
    TaskID: string;
    WPS_No: string;
    WelderID: string;
    MachineID: string;
}

export class ContractTaskView {
    ContractID: string;
    ContractName: string;
    Details: String;
    TaskID: string;
    WPS_No: string;
    FullName: string;
    Description: string; //Machine Name
}