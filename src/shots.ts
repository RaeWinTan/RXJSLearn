import {paintCScore, paintPScore, elem, paintShot, paintCShot} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {ShotClass, ShotClassInterface, Shot} from "./shotsClass";
import { Boards } from "./interfaces";
import {ComputerClass} from "./ComputerClass";
import {merge, fromEvent,BehaviorSubject} from "rxjs";
import { mapTo,tap,scan,
  take,
  finalize,
  concatMap,
  map, delay,
  skipWhile
} from "rxjs/operators";

import {gridSize} from "./constants";


function randomNum(x:number){
  return Math.floor(Math.random() * x)+1;
}


const pScore = new BehaviorSubject<any>({1:1, 2:2, 3:3, 4:4, 5:5});
const cScore = new BehaviorSubject<any>({1:1, 2:2, 3:3, 4:4, 5:5});

const computerMove$ = new BehaviorSubject<number>(0);

const pScore$ = pScore.pipe(tap((x:any)=> paintPScore(x)));
const cScore$ = cScore.pipe(tap((x:any)=>paintCScore(x)));

const turn$ = (initial:Boards)=>computerShot$(initial.computerShot).pipe(
  concatMap(_=>playerShot$(initial.playerShot))
);

const computerShot$= (c:ShotClassInterface)=>computerMove$.pipe(
  delay(1000),
  tap(_=>{
    c.shoot(0, cScore);
    paintCShot(c.shots[c.shots.length-1].pos, c.shots[c.shots.length-1].hit);
  })
);

const playerShot$ = (p:ShotClassInterface) => fromEvent(elem("grid-container-player-id"), "click").pipe(
  map((e:MouseEvent)=> parseInt((e.target as Element).id)),
  skipWhile((x:number)=>!p.shoot(x, pScore)),
  tap(_=>paintShot(p.shots[p.shots.length-1].pos, p.shots[p.shots.length-1].hit)),
  take(1),
  finalize(()=> computerMove$.next(0))
);

export const shots$ = (b:Boards)=> merge(turn$(b), pScore$, cScore$);

//to be test good shots$
/*
export const shots$ = (b:Boards)=> merge(computerShot$, playerShot$(b), compScore$, playerScore$);
*/
