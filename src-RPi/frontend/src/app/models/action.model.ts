export class Action {

  id: string;

  actionType: number;

  actionPin: number;

  activationType: number;

  duration?: number;

  state: number; // 0 = queued, 1 = completed, -1 = error

  plantId : string;

  createdAt : string;

}

export enum ActionState {

  error = -1,
  queued = 0,
  completed = 1

}