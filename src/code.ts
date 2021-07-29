
import {setUpGrid, paintShip, elem, paintShot, paintAll} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {ShotClass, ShotClassInterface} from "./shotsClass";
import {ComputerClass} from "./ComputerClass";
import { Boards } from "./interfaces";
import {from, Subject, merge,interval, fromEvent, combineLatest, concat, of} from "rxjs";
import { mapTo,tap,scan,reduce,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile, switchMap
} from "rxjs/operators";

const gridSize = 10;

const ui$ = of({
  playerBoard:new ShipClass({ships:[], allPos:[]}, gridSize),
  computerBoard:new ComputerClass({ships:[], allPos:[]}, gridSize)
 }).pipe(
  tap((x:Boards)=> setUpGrid(gridSize))
);

const playerSetup$ = (sci:ShipClassInterface) =>
  fromEvent(elem("grid-container-id"), "click").pipe(
    map((e:MouseEvent)=> +(e.target as Element).id),
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

//initial draft
const shots$ = (ships:ShipClassInterface)=>
  fromEvent(elem("grid-container-player-id"), "click").pipe(
    map((e:MouseEvent)=> parseInt((e.target as Element).id)),
    scan<number, ShotClassInterface>((acc:ShotClassInterface, curr:number)=>{
      acc.shoot(curr);
      return acc;
    }, new ShotClass(ships)),
    tap((x:ShotClassInterface)=> paintShot(x.shots[x.shots.length-1].pos, x.shots[x.shots.length-1].hit))
  );

const setUp$ = (initial:Boards) => concat(
  playerSetup$(initial.playerBoard),
  computerSetup$(initial.computerBoard)
);
/*
const game$ = ui$.pipe(
  switchMap((initial:Boards)=>
    concat(setUp$(initial),shots$(initial))
  )
);
*/
const game$ = ui$.pipe(
  switchMap((initial:Boards)=>setUp$(initial))
);
game$.subscribe(console.log);
/*
let computer start first
cShot = BehaviorSubject({random()})
pShot = subject();
pClick = fromEvent().pipe(convert to number);
merge(cShot, pShot, pClick);
*/
