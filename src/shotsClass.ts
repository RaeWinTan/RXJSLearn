//see must base on the shipClasssInterface
import {ShipClassInterface} from "./shipclass";
import { BehaviorSubject } from "rxjs";

//need an interface that stores arrray of [boolean, number]
export interface Shot{
  hit:boolean;
  pos:number;
  shipLen?:number;
}


interface ShotClassConstructor{
  new (oppShips:ShipClassInterface):ShotClassInterface;
}

export interface ShotClassInterface {
  shots:Shot[];
  shoot(x:number, s:BehaviorSubject<any>):boolean;

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


  protected shotBefore(x:number):boolean{
    for(let i of this._shots){
      if(x === i.pos) return true;
    }
    return false;
  }

  shoot(x:number, s:BehaviorSubject<any>):boolean{
    for(let j of this._oppShips.shipman.ships){
      for(let i of j.pos){
        if(!this.shotBefore(x) && x===i){
          let tmp:any = {...s.value};
          tmp[j.length] = tmp[j.length] - 1;
          s.next(tmp);//to update the score
          this._shots.push({hit:true, pos:i, shipLen:j.length});
          return true;
        }
      }
    }
    if(!this.shotBefore(x)){
      this._shots.push({hit:false, pos:x});
      return true;
    } else{
      return false;
    }

  }
}
