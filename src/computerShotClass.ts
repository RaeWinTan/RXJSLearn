import { ShotClass } from './shotsClass';
import { BehaviorSubject } from 'rxjs';
import { ShipClassInterface } from './shipclass';
import { gridSize, randomNum, ships } from './constants';

interface NextBest {
  hitVal: number;
  possible: number[];
}

interface NextTry {
  [shipLen: number]: NextBest[];
}

export class ComputerShotClass extends ShotClass {
  _nextTry: NextTry = {};
  _shipProcessing: number[];
  _testRanShots: number[];
  constructor(oppShips: ShipClassInterface) {
    super(oppShips);
    for (let i = 0; i < ships; i++) this._nextTry[i + 1] = [];
    this._shipProcessing = [];
  }
  shoot(x: number, scoreBoard: BehaviorSubject<any>): boolean {
    let s: number = 0; //aka shipLen

    //check for currently processing ship
    if (this._shipProcessing.length > 0) {
      for (let i = 0; i < this._shipProcessing.length; i++) {
        if (
          this._nextTry[this._shipProcessing[0]].length ===
          this._shipProcessing[0]
        ) {
          //prune out finished ships
          this._shipProcessing.shift(); //no longer have to process that ship
          i--;
        } else {
          //process that ship
          s = this._shipProcessing[0];
          break;
        }
      } //after pruning out all the front ships that have aalrady been finished processing
      if (s > 0) {
        //that means it is processing from this._shipProcessing
        //just look at the last NextBest for that nextTry
        let nb: NextBest = this._nextTry[s][this._nextTry[s].length - 1]; //last element of the nextTry[s]
        for (let i = 0; i < nb.possible.length; i++) {
          if (super.shotBefore(nb.possible[i])) {
            nb.possible.shift();
            i--; //so dont process that posible val
          } else {
            //never shot before and in the nextBest[best case scenerio]
            super.shoot(nb.possible[i], scoreBoard);
            if (this._shots[this._shots.length - 1].hit) {
              if (this._shots[this._shots.length - 1].shipLen === s) {
                this.updateNextTryMultiple(s, nb.possible[i]);
              } else {
                //missed the nextTry boat but coinsidently hit another boat
                this.updateNextTry(
                  this._shots[this._shots.length - 1].shipLen,
                  nb.possible.shift()
                );
              }
            } else {
              nb.possible.shift();
            }
            break;
          }
        }
        if (nb.possible.length === 0) {
          this.updateSingle(s, nb.hitVal, nb);
        }
      } else {
        //there is not more ships in queue to be processed so take randomShotAgain
        x = x = randomNum(gridSize * gridSize);
        while (!super.shoot(x, scoreBoard)) x = randomNum(gridSize * gridSize);
        if (this._shots[this._shots.length - 1].hit) {
          //this is a form of clean up
          this.updateNextTry(this._shots[this._shots.length - 1].shipLen, x);
        }
      }
    } else {
      //random number
      //x = 11;
      x = randomNum(gridSize * gridSize);
      while (!super.shoot(x, scoreBoard)) x = randomNum(gridSize * gridSize);
      if (this._shots[this._shots.length - 1].hit) {
        //this is a form of clean up
        this.updateNextTry(this._shots[this._shots.length - 1].shipLen, x);
      }
    }
    console.log(JSON.parse(JSON.stringify(this._nextTry)));
    //computer will not click on the same spot
    return true;
  }
  private addToShipProcessing(shipLen: number): void {
    for (let i of this._shipProcessing) {
      if (i === shipLen) return; //dont push cuz already to be processed
    }
    this._shipProcessing.push(shipLen);
  }
  //x is the shot taken,
  /*These function can be in a helper file */
  private horiGaps(nb: NextBest[]): number[] {
    let r: number[] = [];
    let tmp: number[] = nb
      .map((x: NextBest) => x.hitVal)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    //get all the nb.possible
    for (let i = 1; i < tmp.length; i++) {
      for (let j = 1; j < tmp[i] - tmp[i - 1]; j++) {
        //that means in between those two are the gap(s)
        r.push(tmp[i - 1] + j);
      }
    }
    return r;
  }
  private horiPadding(nb: NextBest[], shipLen: number): number[] {
    //only push one right or one left or both
    let r: number[] = [];
    let ht: number[] = nb
      .map((s: NextBest) => s.hitVal)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    ht = [ht[0], ht[ht.length - 1]];
    let bodyLen: number = ht[1] - ht[0];
    let right: number = ht[1] + 1;
    let left: number = ht[0] - 1;
    if (
      this.inHorizontalLine(ht[0], left) &&
      !this.shotBefore(left) &&
      !(ht[0] - left > shipLen - bodyLen)
    )
      r.push(left);
    if (
      this.inHorizontalLine(ht[1], right) &&
      !this.shotBefore(right) &&
      !(right - ht[1] > shipLen - bodyLen)
    )
      r.push(right);
    return r;
  }
  private vertGaps(nb: NextBest[]): number[] {
    let ans: number[] = [];
    let tmp: number[] = nb
      .map((x: NextBest) => x.hitVal)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    for (let i = 1; i < tmp.length; i++) {
      for (let j = gridSize; j < tmp[i] - tmp[i - 1]; j = j + gridSize) {
        //that means in between those two are the gap(s)
        ans.push(tmp[i - 1] + j);
      }
    }
    return ans;
  }
  private vertPadding(nb: NextBest[], shipLen: number): number[] {
    //recommend one up(-gridSize) or one down(+gridSize) or both
    let ans: number[] = [];
    let ht: number[] = nb
      .map((s: NextBest) => s.hitVal)
      .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
    ht = [ht[0], ht[ht.length - 1]];
    let bodyLen: number = (ht[1] - ht[0]) / gridSize;
    let down: number = ht[1] + gridSize;
    let up: number = ht[0] - gridSize;
    if (
      up > 0 &&
      !super.shotBefore(up) &&
      !(ht[0] - up > (shipLen - bodyLen) * gridSize)
    )
      ans.push(up);
    if (
      down <= gridSize * gridSize &&
      !super.shotBefore(down) &&
      !(down - ht[1] >= (shipLen - bodyLen) * gridSize)
    )
      ans.push(down);
    return ans;
  }
  private updateNextTryMultiple(shipLen: number, x: number) {
    this._nextTry[shipLen].push({ hitVal: x, possible: [] });
    if (this._nextTry[shipLen].length === shipLen) return;

    let nb: NextBest =
      this._nextTry[shipLen][this._nextTry[shipLen].length - 1];
    if (
      this.inHorizontalLine(
        this._nextTry[shipLen][0].hitVal,
        this._nextTry[shipLen][1].hitVal
      )
    ) {
      let horiGaps: number[] = this.horiGaps(this._nextTry[shipLen]);
      if (horiGaps.length > 0) {
        nb.possible = horiGaps;
        return;
      }
      nb.possible = this.horiPadding(this._nextTry[shipLen], shipLen);
    } else {
      let vg: number[] = this.vertGaps(this._nextTry[shipLen]);
      if (vg.length > 0) {
        nb.possible = vg;
        return;
      }
      nb.possible = this.vertPadding(this._nextTry[shipLen], shipLen);
    }
  }
  private updateSingle(shipLen: number, x: number, nb: NextBest) {
    //no need to put new next best just need to update the current nextbest
    let hori: number[] = this.calculateHori(shipLen, x);
    let vert: number[] = this.calculateVert(shipLen, x);
    if (hori.length > 0) nb.possible = hori;
    else nb.possible = vert;
  }
  private updateNextTry(shipLen: number, x: number) {
    this.addToShipProcessing(shipLen);
    if (this._nextTry[shipLen].length > 0)
      this.updateNextTryMultiple(shipLen, x);
    else {
      console.log('---------------------');
      console.log('IN THE UPDATENXT TRY else block');
      console.log(shipLen);
      let hori: number[] = this.calculateHori(shipLen, x);
      let vert: number[] = this.calculateVert(shipLen, x);
      if (hori.length > 0)
        this._nextTry[shipLen].push({ hitVal: x, possible: hori });
      else this._nextTry[shipLen].push({ hitVal: x, possible: vert });
    }
  }
  private calculateVert(shipLen: number, x: number): number[] {
    // check if vertically is posible
    let upAns: number[] = [];
    let downAns: number[] = [];
    let upT: number = x - gridSize;
    let downT: number = x + gridSize;
    while (
      upT >= 1 &&
      !this.shotBefore(upT) &&
      (x - upT) / gridSize + 1 <= shipLen
    ) {
      upAns.push(upT);
      upT = upT - gridSize;
    }

    while (
      downT <= gridSize * gridSize &&
      !this.shotBefore(downT) &&
      (downT - x) / gridSize + 1 <= shipLen
    ) {
      downAns.push(downT);
      downT = downT + gridSize;
    }
    let ans = upAns.concat(downAns);
    console.log('from downUP', ans);
    if (ans.length + 1 < shipLen) return [];
    //not viable
    else {
      if (ans.length < 2) return ans;
      else {
        if (upAns.length > 0 && downAns.length > 0)
          return [upAns[0], downAns[0]];
        else if (upAns.length > 0) return [upAns[0]];
        else return [downAns[0]];
      }
    }
  }

  private calculateHori(shipLen: number, x: number): number[] {
    //check how far it can go up
    // check if vertically is posible
    let leftAns: number[] = [];
    let rightAns: number[] = [];
    let leftT: number = x - 1;
    let rightT: number = x + 1;
    while (
      leftT >= 1 &&
      this.inHorizontalLine(leftT, x) &&
      !this.shotBefore(leftT) &&
      x - leftT + 1 <= shipLen
    ) {
      leftAns.push(leftT);
      leftT = leftT - 1;
    }
    while (
      rightT <= gridSize * gridSize &&
      this.inHorizontalLine(rightT, x) &&
      !this.shotBefore(rightT) &&
      rightT - x + 1 <= shipLen
    ) {
      rightAns.push(rightT);
      rightT = rightT + 1;
    }
    let ans = rightAns.concat(leftAns);
    console.log('from leftRight', ans);
    if (ans.length + 1 < shipLen) return [];
    //not viable
    else {
      if (ans.length < 2) return ans;
      else {
        if (leftAns.length > 0 && rightAns.length > 0)
          return [leftAns[0], rightAns[0]];
        else if (leftAns.length > 0) return [leftAns[0]];
        else return [rightAns[0]];
      }
    }
  }

  private inHorizontalLine(curr: number, n: number): boolean {
    if (curr % gridSize === 0) curr--;
    return (
      Math.floor(curr / gridSize) * gridSize + 1 <= n &&
      Math.floor(curr / gridSize) * gridSize + gridSize >= n
    );
  }
}
