//see must base on the shipClasssInterface
import {ShipClassInterface} from "./shipclass";

const enum HitStatus{
  hit="X",
  miss="O"
}
//need an interface that stores arrray of [boolean, number]
interface Shot{
  hit:boolean;
  pos:number;
  shipLen?:number;
}


interface ShotClassConstructor{
  new (oppShips:ShipClassInterface):ShotClassInterface;
}

export interface ShotClassInterface {
  shots:Shot[];
  shoot(x:number):void;
}

export class ShotClass implements ShotClassInterface {
  _shots:Shot[] = [];
  _oppShips:ShipClassInterface;
  constructor(oppShips:ShipClassInterface){
    this._oppShips = oppShips;
  }
  get shots(){
    return this._shots;
  }

  private shotBefore(x:number):boolean{
    for(let i of this._shots){
      if(x === i.pos) return true;
    }
    return false;
  }

  shoot(x:number):void{
    for(let j of this._oppShips.shipman.ships){
      for(let i of j.pos){
        if(!this.shotBefore(x) && x===i){
          this._shots.push({hit:true, pos:i, shipLen:j.length});
          return;
        }
      }
    }
    if(!this.shotBefore(x)) this._shots.push({hit:false, pos:x});
  }
}
