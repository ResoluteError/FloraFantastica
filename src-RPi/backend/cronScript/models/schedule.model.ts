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