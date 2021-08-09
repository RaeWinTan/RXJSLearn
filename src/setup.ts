
import {setUpGrid, paintShip, elem, paintShot, paintAll} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {ShotClass, ShotClassInterface} from "./shotsClass";
import {ComputerClass} from "./ComputerClass";
import { Boards } from "./interfaces";
import {ComputerShotClass} from "./computerShotClass";
import {from, Subject, merge,interval, fromEvent, combineLatest, concat, of} from "rxjs";
import { mapTo,tap,scan,reduce,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile, switchMap
} from "rxjs/operators";
//let the ships also be another constant to be used
import {gridSize, ships} from "./constants";
const sc:ShipClassInterface = new ShipClass({ships:[], allPos:[]}, gridSize);
const cc:ShipClassInterface = new ComputerClass({ships:[], allPos:[]}, gridSize);

//actually can put the turn here
export const ui$ = of({
  playerBoard:sc,
  computerBoard:cc,
  playerShot: new ShotClass(cc),
  computerShot: new ComputerShotClass(sc)
 }).pipe(
  tap(_=> setUpGrid(gridSize))
);
const playerSetup$ = (sci:ShipClassInterface) =>
  fromEvent(elem("setup-player"), "click").pipe(
    map((e:MouseEvent)=> +(e.target as Element).id),
    scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=> acc.add(curr), sci),
    tap((x:ShipClassInterface)=>{
      paintShip(x.shipman.ships[x.shipman.ships.length-1].pos[x.shipman.ships[x.shipman.ships.length-1].pos.length-1], ships-x.shipman.ships.length+1);
    }),
    takeWhile((x:ShipClassInterface)=> x.shipman.ships.length < ships)
  );


const computerSetup$ = (sci:ShipClassInterface) =>
  interval().pipe(
    map((x:number)=> Math.floor(Math.random() * (gridSize*gridSize))+1 ),
    scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=> acc.add(curr),sci),
    tap((x:ShipClassInterface)=>paintAll(x)),
    takeWhile((x:ShipClassInterface) => x.shipman.ships.length < ships)
  );

export const setUp$ = (initial:Boards) => concat(
    playerSetup$(initial.playerBoard),
    computerSetup$(initial.computerBoard)
  );
