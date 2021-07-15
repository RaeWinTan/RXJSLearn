export interface Letter {
    val:string;
    xCoor:number;
}



export interface State {
  score: number;
  level:number;
  invl: number;
  clear:boolean;
  ltrs:Letter[];
}
