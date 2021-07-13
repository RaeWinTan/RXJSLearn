//this is tsa test on alphabe invawiton
import {moveBird, updateStatus} from "./dom-updater";
import {BufferTubes} from "./bt";
import {Tube, Bird, State} from "./interfaces";

import {merge,interval, fromEvent, combineLatest} from "rxjs";
import { mapTo,tap,scan,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile
} from "rxjs/operators";




const currBirdPos:Bird = {
  yCoor: 9
};

const changeBirdPos=(x:Bird, j:number)=> {
  if(x.yCoor === 0 && j<0){
    return x;
  }
  if(x.yCoor === 9 && j>0) return x;
  if(j>0){
    x.yCoor++;
    return x;
  }else{
    x.yCoor--;
    return x;
  }
}

const bts = new BufferTubes([], 2, 10);


const bird$ = merge(interval(300), fromEvent(document, "keydown") ).pipe(
  scan<any,Bird>((acc:Bird, curr:any)=> curr instanceof KeyboardEvent ? changeBirdPos(acc,-1) : changeBirdPos(acc,1), currBirdPos),
  tap((x:Bird)=> {
    moveBird(x.yCoor);
  })
);
//letes sa
const tubes$ = interval(500).pipe(
  scan<number, Tube[]>((acc:Tube[], curr:number)=> {
    bts.moveTubes();
    if(curr%Math.floor(bts.mapWidth/bts.take)===0) return bts.addTube(curr);
    else return bts.tubes;
  }, [])
);

const game$ = combineLatest(bird$, tubes$).pipe(
  scan<any, State>((acc:State, [bird, tubes])=>{
    if(!tubes[0].clear && tubes[0].xCoor === 0 ){
      bts.clearPipe();
      return BufferTubes.isInGap(bird, tubes[0])?{"lives":acc.lives, "score":++acc.score}:{"lives":--acc.lives, "score":acc.score};

    }else return acc;

  }
, {"lives":3, "score": 0}),
  takeWhile((x:State) => x.lives >= 0)
);

game$.subscribe(
  updateStatus
);
/*(scan)
acc:
  returns {lives, score }
 {
  if(tube[0].xCoor === 0 && tube.isInGap(bird.yCoor)){
      return {lives: acc.lives, score: ++acc.score}
  }else{
    return {lives: --acc.lives, score: acc.score}
  }
}

}
current: gets [Bird,Tube[]] aka the current state of the game
tap((x:State)=> updateState(x))
takeUntil((x:State)=> x.lives <=0)

*/
