
import {setUpGrid, paintShip} from "./dom-updater";
import {ShipClass, ShipClassInterface} from "./shipclass";
import {Subject, merge,interval, fromEvent, combineLatest, concat, of} from "rxjs";
import { mapTo,tap,scan,
  mergeMap, take,
  finalize,
  repeat,
  filter,
  map,takeWhile
} from "rxjs/operators";

const gridSize = 10;
const ui$ = of({}).pipe(tap((x:any)=> setUpGrid(gridSize)));
const clickSetup$ = fromEvent(document, "click").pipe(
  map((e:MouseEvent)=> +(e.target as Element).id),
  scan<number, ShipClassInterface>((acc:ShipClassInterface, curr:number)=>{
    acc.add(curr);
    return acc;
  }, new ShipClass({ships:[], allPos:[]}, gridSize)),
  tap((x:ShipClassInterface)=>{
    paintShip(x.shipman.ships[x.shipman.ships.length-1].pos[x.shipman.ships[x.shipman.ships.length-1].pos.length-1], 5-x.shipman.ships.length+1);
  }),
  takeWhile((x:ShipClassInterface)=> x.shipman.ships.length < 5)
);



const playerSetup$ = concat(ui$, clickSetup$);
playerSetup$.subscribe((x:ShipClassInterface)=>{

});
