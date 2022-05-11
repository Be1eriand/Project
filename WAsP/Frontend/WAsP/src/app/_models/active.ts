import { Specification } from "./specification";
import { RealTimeData, TaskData } from "./realtime";

export class Active {
   active: TaskData[];
   data: ActiveMachine[];
}

export class ActiveMachine {
    WPS: Specification;
    RT: RealTimeData[];
}