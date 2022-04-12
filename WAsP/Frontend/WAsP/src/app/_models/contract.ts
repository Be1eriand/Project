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

export class ContractTaskView {
    ContractID: string;
    ContractName: string;
    TaskID: string;
    WPS_No: string;
    FullName: string;
    Description: string; //Machine Name
}