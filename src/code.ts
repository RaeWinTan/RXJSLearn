
import {setUpGrid, paintShip, elem, paintShot, paintAll} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {ShotClass, ShotClassInterface} from "./shotsClass";
import {ComputerClass} from "./ComputerClass";
import { Boards } from "./interfaces";
import {from, Subject, merge,interval, fromEvent, combineLatest, concat, of} from "rxjs";
import { setUp$, ui$ } from "./setup";
import {shots$} from "./shots";
import { mapTo,tap,scan,reduce,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile, switchMap
} from "rxjs/operators";
import {gridSize} from "./constants";


const game$ = ui$.pipe(
  switchMap((initial:Boards)=>concat(setUp$(initial), shots$(initial.computerBoard)))
);
game$.subscribe(console.log);
