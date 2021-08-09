import {ShipClass, ShipClassInterface, ShipMan, Direction} from "./shipclass";
import { ships } from "./constants";

export class ComputerClass extends ShipClass {
  _posTaken:number[];
  constructor(shipman:ShipMan, gridSize:number){
    super(shipman, gridSize);
    this._posTaken = [];
  }

  add(x:number):ShipClassInterface{
    if(this._posTaken.includes(x)) return this;
    let d:Direction;
    let len:number;
    if (this._shipman.ships.length !== 0) {
      if (this._shipman.ships[this._shipman.ships.length-1].pos.length < ships - this._shipman.ships.length+1){
        len = ships - this._shipman.ships.length + 1;
        d = this.checkValidity(x, len, this._shipman.ships[this._shipman.ships.length-1]);
      } else {
        len = ships-this._shipman.ships.length;
        d = this.checkValidity(x, len);
      }

    } else {
      d = Direction.all;
      len = ships;
    }
    this.addMultiple(x, d, len);
    return this;
  }

  private addMultiple(x:number, d:Direction, len:number):void {
    if(d === Direction.no) return;
    if(d === Direction.all) d = this.randomDirection();
    if(d === Direction.horizontal) this.mulHori(x, len);
    else this.mulVert(x, len);
  }


  private mulVert(x:number, len:number){
    let xUp:number = x-this._gridSize;
    let xDown:number = x+this._gridSize;
    super.add(x);
    len--;
    let u:boolean = false;
    let d:boolean = false;
    while (len>0) {
      if(!u) u = this._shipman.allPos.includes(xUp);
      if(!d) d = this._shipman.allPos.includes(xDown);

      if (xDown <= this._gridSize*this._gridSize && !d){
        len--;
        super.add(xDown);
        xDown = xDown + this._gridSize;
      }
      if (len>0 && xUp>0 && !u){
        len--;
        super.add(xUp);
        xUp = xUp - this._gridSize;
      }
    }
  }

  private mulHori(x:number, len:number){
    let xLeft:number = x-1;
    let xRight:number = x+1;
    super.add(x);
    let l:boolean = false;
    let r:boolean = false;

    len--;
    while (len>0) {
      if(!l) l = this._shipman.allPos.includes(xLeft);
      if(!r) r = this._shipman.allPos.includes(xRight);
      if (super.inHorizontalLine(x, xLeft) && !l){
        len--;
        super.add(xLeft);
        xLeft = xLeft - 1;
      }
      if (super.inHorizontalLine(x, xRight) && len>0 && !r){
        len--;
        super.add(xRight);
        xRight = xRight + 1;
      }
    }
  }
  private randomDirection():Direction{
    return [Direction.vertical, Direction.horizontal][Math.floor(Math.random() * 2)];
  }





}
