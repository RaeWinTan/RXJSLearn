import {setUpGrid, paintShip, elem, paintShot, paintAll} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {ShotClass, ShotClassInterface} from "./shotsClass";
import {ComputerClass} from "./ComputerClass";
import {from, Subject, merge,interval, fromEvent, combineLatest, concat, of} from "rxjs";
import { mapTo,tap,scan,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile, switchMap
} from "rxjs/operators";

export const shots$ = (ships:ShipClassInterface)=>
  fromEvent(elem("grid-container-player-id"), "click").pipe(
    map((e:MouseEvent)=> parseInt((e.target as Element).id)),
    scan<number, ShotClassInterface>((acc:ShotClassInterface, curr:number)=>{
      acc.shoot(curr);
      return acc;
    }, new ShotClass(ships)),
    tap((x:ShotClassInterface)=> paintShot(x.shots[x.shots.length-1].pos, x.shots[x.shots.length-1].hit))
  );
