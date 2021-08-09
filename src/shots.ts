import {paintCScore, paintPScore, elem, paintShot, paintCShot} from "./dom-updater";
import { ShotClassInterface} from "./shotsClass";
import { Boards } from "./interfaces";

import {merge, fromEvent,BehaviorSubject} from "rxjs";
import {tap,
  take,
  finalize,
  concatMap,
  map, delay,
  skipWhile,
  takeWhile
} from "rxjs/operators";

const pScore = new BehaviorSubject<any>({1:1, 2:2, 3:3, 4:4, 5:5});
const cScore = new BehaviorSubject<any>({1:1, 2:2, 3:3, 4:4, 5:5});

const computerMove$ = new BehaviorSubject<number>(0);

const pScore$ = pScore.pipe(tap((x:any)=> paintPScore(x)));
const cScore$ = cScore.pipe(tap((x:any)=>paintCScore(x)));

function finishGame(p:BehaviorSubject<any>, c:BehaviorSubject<any>):boolean{
  return !(Object.values(p.value).filter((x:number)=> x !== 0).length === 0 || Object.values(c.value).filter((x:number)=> x !== 0).length === 0);
}

const turn$ = (initial:Boards)=>computerShot$(initial.computerShot).pipe(
  concatMap(_=>playerShot$(initial.playerShot))
);

const computerShot$= (c:ShotClassInterface)=>computerMove$.pipe(
  tap(_=>{
    //when it is computer's turn do the following
    c.shoot(0, cScore);
    paintCShot(c.shots[c.shots.length-1].pos, c.shots[c.shots.length-1].hit);
  })
);

const playerShot$ = (p:ShotClassInterface) => fromEvent(elem("grid-container-player-id"), "click").pipe(
  map((e:MouseEvent)=> parseInt((e.target as Element).id)),
  skipWhile((x:number)=>!p.shoot(x, pScore)),
  tap(_=>paintShot(p.shots[p.shots.length-1].pos, p.shots[p.shots.length-1].hit)),
  take(1),
  finalize(()=> computerMove$.next(0))//the number in the next is meaningless it just forces the comptuer shot t ogo next
);

export const shots$ = (b:Boards)=> merge(turn$(b), pScore$, cScore$).pipe(
  takeWhile(_=> finishGame(cScore, pScore)),
  finalize(()=>alert("GAME OVER"))
);
