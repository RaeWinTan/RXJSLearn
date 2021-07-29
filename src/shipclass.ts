export const enum Direction{
  vertical="vertical",
  horizontal="horizontal",
  all="all",
  no="no"
}


interface Ship {
  pos: number[];
  length:number;
  posibleDirection:Direction; //here should have the posible direction it can go
}

export interface ShipMan {
  ships:Ship[];
  allPos:number[];
}

interface ShipClassConstructor {
  new (shipman:ShipMan, gridSize:number):ShipClassInterface;
}

export interface ShipClassInterface{
  shipman:ShipMan;
  add(curr:number):ShipClassInterface;
}



export class ShipClass implements ShipClassInterface {
  _gridSize:number;
  _shipman:ShipMan;
  constructor(shipman:ShipMan, gridSize:number){
    this._shipman = shipman;
    this._gridSize = gridSize;
  }

  add(curr:number):ShipClassInterface {
    if(this._shipman.ships.length === 0){
      let pos:number[] = [];
      pos.push(curr);
      this._shipman.allPos.push(curr);
      this._shipman.ships.push({pos:pos, length:5, posibleDirection:Direction.all});
    } else {
      if(this._shipman.ships[this._shipman.ships.length-1].pos.length < 5 - this._shipman.ships.length+1){
        let len:number = 5 - this._shipman.ships.length + 1;
        let d:Direction = this.checkValidity(curr, len, this._shipman.ships[this._shipman.ships.length-1]);
        if(d!== Direction.no){
          this._shipman.allPos.push(curr);
          this._shipman.ships[this._shipman.ships.length-1].length = len;
          this._shipman.ships[this._shipman.ships.length-1].pos.push(curr);
          this._shipman.ships[this._shipman.ships.length-1].posibleDirection = d;
        }
      } else {
        //first time working on a new ship
        let len = 5-this._shipman.ships.length;
        let d:Direction = this.checkValidity(curr, len);
        if (d !== Direction.no) {
          this._shipman.allPos.push(curr);
          this._shipman.ships.push({pos:[curr], length:len, posibleDirection:d});
        }

      }
    }
    return this;
  }
  protected checkValidity(curr:number, len:number, ship?:Ship):Direction {
    if (this._shipman.allPos.includes(curr)) return Direction.no;
    if (ship === undefined){
      if(this.verticalCan(curr, len) && this.horizontalCan(curr, len)) return Direction.all;
      else if (this.verticalCan(curr, len)) return Direction.vertical;
      else if (this.horizontalCan(curr, len)) return Direction.horizontal;
      else return Direction.no;
    } else {
      for(let i of ship.pos){
        if(Math.abs(curr - i) === this._gridSize && (ship.posibleDirection === Direction.vertical||ship.posibleDirection === Direction.all)) return Direction.vertical;
        else if (Math.abs(curr - i) === 1 && (ship.posibleDirection === Direction.horizontal||ship.posibleDirection === Direction.all)) return Direction.horizontal;
      }
      return Direction.no;
    }
  }

  //check if the the shippart can be placed vertically
  private verticalCan(curr:number,limit:number):boolean {
    limit--; //exclusive of the current so limit - 1;
    let top:number = 0;
    let t:number = curr;
    let b:number = curr;
    t= t-this._gridSize;
    while(t>0){
      if(this.shipman.allPos.includes(t)) break;
      top++;
      if (top >= limit) return true;
      t = t-this._gridSize;
    }
    let bottom:number = 0;
    b = b+this._gridSize
    while (b<=this._gridSize*this._gridSize){
      if(this._shipman.allPos.includes(b)) break;
      bottom++;
      if(bottom>=limit)return true;
      b=b+this._gridSize;
    }
    return top+bottom>=limit;
  }
  protected inHorizontalLine(curr:number,n:number):boolean{
    if(curr%this._gridSize === 0) curr--;
    return Math.floor(curr/this._gridSize)*this._gridSize+1<= n &&  Math.floor(curr/this._gridSize)*this._gridSize+this._gridSize>=n;
  }

  private horizontalCan(curr:number,limit:number):boolean{
    limit--; //exclusive of the current so limit - 1;
    let right:number = 0;
    let r:number = curr;
    let l:number = curr;
    r= r+1;
    while(this.inHorizontalLine(curr, r)){
      if(this._shipman.allPos.includes(r)) break;
      right++;
      if (right >= limit) return true;
      r = r+1;
    }
    let left:number = 0;
    l = l-1;
    while (this.inHorizontalLine(curr, l)){
      if(this.shipman.allPos.includes(l)) break;
      left++;
      if(left>=limit)return true;
      l=l-1;
    }
    return left+right>=limit;
  }

  get shipman():ShipMan{
      return this._shipman;
  }


}
