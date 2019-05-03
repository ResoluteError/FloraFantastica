import { Action } from './action.model';

// export class Schedule {

//   id: string;
//   plantId: string;
//   active: boolean;
//   rule: string | ScheduleRule;
//   action: string | Action;
//   createdAt: string;
//   updatedAt: string; 

// }

// export class ScheduleRule {

//   settings : {
//     measurementType : string;
//     comparison: ScheduleRuleComparison;
//     value: number;
//   }[]

// }

// export enum ScheduleRuleComparison {

//   lessThan = 0,
//   equal = 1,
//   greaterThan = 2

// }

export class Schedule {

  id: string;
  plantId: string;
  active: boolean;

  minDurationSinceWatering?: number;
  minSoilDryness?: number;
  maxLight?: number;

  valvePin: number;
  duration: number;

  createdAt: string;
  updatedAt: string; 

}