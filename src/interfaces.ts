export interface Tube {
  id:number;
  xCoor:number;
  gap: number;
  clear:boolean;
}

export interface Bird {
  yCoor:number;
}

export interface State {
  lives: number;
  score: number;
}
