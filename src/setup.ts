
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
import {gridSize} from "./constants";
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
/*
const playerSetup$ = (sci:ShipClassInterface) =>
  fromEvent(elem("grid-container-id"), "click").pipe(
    map((e:MouseEvent)=> +(e.target as Element).id),
    scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=> acc.add(curr), sci),
    tap((x:ShipClassInterface)=>{
      paintShip(x.shipman.ships[x.shipman.ships.length-1].pos[x.shipman.ships[x.shipman.ships.length-1].pos.length-1], 5-x.shipman.ships.length+1);
      console.log(x.shipman.allPos);
    }),
    takeWhile((x:ShipClassInterface)=> x.shipman.ships.length < 5)
  );
*/
//Test data for playerSetup$ [17, 27, 37, 47, 57, 65, 55, 45, 35, 66, 67, 68, 36, 26, 46]

const playerSetup$ = (sci:ShipClassInterface) =>
  from([63, 64, 65, 66, 67, 42, 43, 44, 45, 62, 52, 72, 55, 56, 54]).pipe(
    scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=> acc.add(curr), sci),
    tap((x:ShipClassInterface)=>{
      paintShip(x.shipman.ships[x.shipman.ships.length-1].pos[x.shipman.ships[x.shipman.ships.length-1].pos.length-1], 5-x.shipman.ships.length+1);
    }),
    takeWhile((x:ShipClassInterface)=> x.shipman.ships.length < 5)
  );

const computerSetup$ = (sci:ShipClassInterface) =>
  interval().pipe(
    map((x:number)=> Math.floor(Math.random() * (gridSize*gridSize))+1 ),
    scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=> acc.add(curr),sci),
    tap((x:ShipClassInterface)=>paintAll(x)),
    takeWhile((x:ShipClassInterface) => x.shipman.ships.length < 5)
  );

export const setUp$ = (initial:Boards) => concat(
    playerSetup$(initial.playerBoard),
    computerSetup$(initial.computerBoard)
  );
