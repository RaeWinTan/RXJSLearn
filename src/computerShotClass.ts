import {ShotClass, ShotClassInterface} from "./shotsClass";
import { BehaviorSubject } from "rxjs";
import {ShipClassInterface} from "./shipclass";
import {gridSize, randomNum} from "./constants";

interface NextBest {
  hitVal:number;
  possible: number[];
}

interface NextTry {
	 [shipLen: number]: NextBest[];
}

export class ComputerShotClass  extends ShotClass {
  _nextTry:NextTry;
  _shipProcessing:number[];
  constructor(oppShips:ShipClassInterface){
    super(oppShips);
    this._nextTry = {
      1:[],
      2:[],
      3:[],
      4:[],
       5:[]
    };
    this._shipProcessing = [];
  }
  lastShot():number{
    return super.lastShot();
  }
  shoot(x:number, scoreBoard:BehaviorSubject<any>):boolean{
    let s:number = 0;//aka shipLen

    //check for currently processing ship
    if (this._shipProcessing.length > 0 ) {
      for(let i = 0; i < this._shipProcessing.length; i++){
        if(this._nextTry[this._shipProcessing[0]].length === this._shipProcessing[0]){//prune out finished ships
          this._shipProcessing.shift();//no longer have to process that ship
          i--;
        } else { //process that ship
          let tmpNb:NextBest[] = this._nextTry[this._shipProcessing[0]];
          s = tmpNb[tmpNb.length -1].possible[tmpNb[tmpNb.length -1].possible.length-1];
          break;
        }
      }//after pruning out all the front ships that have aalrady been finished processing
      if(s>0){//that means it is processing from this._shipProcessing
          //just look at the last NextBest for that nextTry
          let nb:NextBest = this._nextTry[s][this._nextTry[s].length - 1]; //last element of the nextTry[s]
          for(let i =0; i< nb.possible.length; i++){
            if (super.shotBefore(nb.possible[i])) {
              nb.possible.shift();
              i--;//so dont process that posible val
            } else {//never shot before and in the nextBest[best case scenerio]
              super.shoot(nb.possible[i], scoreBoard);
              if (this._shots[this._shots.length -1].hit){
                if(this._shots[this._shots.length -1].shipLen === s){
                  this.updateNextTryMultiple(s, nb.possible[i]);
                } else {//missed the nextTry boat but coinsidently hit another boat
                    this.updateNextTry(this._shots[this._shots.length -1].shipLen,nb.possible.shift());

                }
              } else {
                nb.possible.shift();
              }
              break;
            }
          }

      } else {//there is not more ships in queue to be processed so take randomShotAgain
        x = randomNum(gridSize*gridSize);
        while(!super.shoot(x, scoreBoard)) x = randomNum(gridSize*gridSize);
        if (this._shots[this._shots.length -1].hit) {//this is a form of clean up
          this.updateNextTry(this._shots[this._shots.length -1].shipLen ,x);
        }
      }
    } else {
      //random number
      x = randomNum(gridSize*gridSize);
      while(!super.shoot(x, scoreBoard)) x = randomNum(gridSize*gridSize);
      if (this._shots[this._shots.length -1].hit) {//this is a form of clean up
          this.updateNextTry(this._shots[this._shots.length -1].shipLen ,x);
      }
    }
    //computer will not click on the same spot
    return true;
  }
  private addToShipProcessing(shipLen:number):void{
    for (let i of this._shipProcessing){
      if(i === shipLen) return;//dont push cuz already to be processed
    }
    this._shipProcessing.push(shipLen);
  }
  //x is the shot taken,
  /*These function can be in a helper file */
  private horiGaps(nb:NextBest[]):number[]{
      let r:number[] = [];
      let tmp:number[] = nb.map((x:NextBest) => x.hitVal).sort((a, b) => a < b ? -1 : a > b? 1 : 0);
      //get all the nb.possible
      for(let i = 1; i<tmp.length; i++){
        for(let j=1;j<tmp[i] -tmp[i-1]; j++){//that means in between those two are the gap(s)
            r.push(tmp[i-1]+j);
        }
      }
      return r;
  }
  private horiPadding(nb:NextBest[], shipLen:number):number[]{
    let r: number[] = [];
    //get main body current head and tail
    let ht: number[] = nb.map((s:NextBest) => s.hitVal).sort((a, b) => a < b ? -1 : a > b? 1 : 0);
    ht = [ht[0],ht[1]];

    let bodyLen:number = ht[1]-ht[0];
    let right:number = ht[1]+1;
    let left:number = ht[0]-1;
    while(this.inHorizontalLine(ht[1], right)){
      if(this.shotBefore(right)) break;
      if( right - ht[1] > shipLen - bodyLen) break;
      r.push(right);
      right++;
    }
    while(this.inHorizontalLine(ht[0], left)){
      if(this.shotBefore(left)) break;
      if(ht[0] - left > shipLen - bodyLen) break;
      r.push(left);
      left--;
    }

    return r;
  }
  private vertGaps(nb:NextBest[]):number[]{
    let ans:number[] = [];
    let tmp:number[] = nb.map((x:NextBest) => x.hitVal).sort((a, b) => a < b ? -1 : a > b? 1 : 0);
    for(let i=1; i < tmp.length; i++){
      for(let j=gridSize;j<tmp[i] -tmp[i-1]; j=j+gridSize){//that means in between those two are the gap(s)
        ans.push(tmp[i-1]+j);
      }
    }
    return ans;
  }
  private vertPadding(nb:NextBest[], shipLen:number):number[]{
    let ans: number[] = [];
    //get main body current head and tail
    let ht: number[] = nb.map((s:NextBest) => s.hitVal).sort((a, b) => a < b ? -1 : a > b? 1 : 0);
    ht = [ht[0],ht[1]];

    let bodyLen:number = (ht[1]-ht[0])/gridSize;
    let down:number = ht[1]+gridSize;
    let up:number = ht[0]-gridSize;
    while(down<= gridSize*gridSize){
      if(this.shotBefore(down)) break;
      if( down - ht[1] > (shipLen - bodyLen)*gridSize) break;
      ans.push(down);
      down= down+ gridSize;
    }
    while(up > 0){
      if(this.shotBefore(up)) break;
      if(ht[0] - up > (shipLen - bodyLen) * gridSize) break;
      ans.push(up);
      up = up - gridSize;
    }
    return ans;
  }
  private updateNextTryMultiple(shipLen:number, x:number){
    //super.shoot was called before this method, this means that the this._shots was already updated
    //so just need to update the this._nextTry, default possible to : []
    this._nextTry[shipLen].push({hitVal:x, possible:[]});
    if(this._nextTry[shipLen].length === shipLen) return;

    let nb:NextBest = this._nextTry[shipLen][this._nextTry[shipLen].length - 1];
    if(this.inHorizontalLine(this._nextTry[shipLen][0].hitVal, this._nextTry[shipLen][1].hitVal)){
      //now check for gaps
      let horiGaps:number[] = this.horiGaps(this._nextTry[shipLen]);
      if(horiGaps.length > 0) {
        nb.possible = horiGaps;
        return;
      }
      //check for padding
      nb.possible = this.horiPadding(this._nextTry[shipLen],shipLen);
    } else { //if it is not in a horizontalLine means that it is in a verticalLine
      //checck for gaps
      let vg:number[] = this.vertGaps(this._nextTry[shipLen]);
      if(vg.length >0){
        nb.possible = vg;
        return;
      }
      nb.possible = this.vertPadding(this._nextTry[shipLen],shipLen);
    }

  }



  private updateNextTry(shipLen:number, x:number){

    //super.shoot() called befroe this method
    this.addToShipProcessing(shipLen);
    if(this._nextTry[shipLen].length >0)this.updateNextTryMultiple(shipLen, x);
    else{
      this._nextTry[shipLen].push({hitVal: x, possible:this.allDirection(x)});
    }
  }

  private inHorizontalLine(curr:number,n:number):boolean{
    if(curr%gridSize === 0) curr--;
    return Math.floor(curr/gridSize)*gridSize+1<= n &&  Math.floor(curr/gridSize)*gridSize+gridSize>=n;
  }

  private allDirection(x:number):number[]{
    let [l,r,u,d]:number[] = [0,0,0,0];
    //must also take into account genna hit before ones as well
    //left
    if(!super.shotBefore(x-1) && this.inHorizontalLine(x, x-1)) l = x-1;
    //right
    if(!super.shotBefore(x+1) && this.inHorizontalLine(x, x+1)) r = x+1;
    //up
    if(!super.shotBefore(x-gridSize) && x-gridSize > 0) u = x-gridSize;
    //down
    if(!super.shotBefore(x+gridSize) && x+gridSize<=gridSize*gridSize) d = x + gridSize;
    return [l,r,u,d].filter((x:number)=> x > 0);
  }
}
