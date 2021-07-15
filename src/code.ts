//this is tsa test on alphabe invawiton
import {Letter, State} from "./interfaces";
import {drawLetters, done} from "./dom-updater";
//import {Alphabet} from "./alphabetClass";
import {merge,interval, fromEvent, combineLatest, BehaviorSubject, iif } from "rxjs";
import { mapTo,tap,scan,
  mergeMap, take,
  finalize,
  repeat,
  map,takeWhile, switchMap, startWith
} from "rxjs/operators";

const maxSpeed = 400;
const random =(n:number)=> Math.floor(Math.random() * n);
const height = 5;
const speed$ = new BehaviorSubject(1000);
const alphabet$ = speed$.pipe(
  switchMap((s:number)=> generator$(s))
);

const keyDown$ = fromEvent(document, 'keydown').pipe(
  map((e: KeyboardEvent) => e.key)
);
const keyUp$ = fromEvent(document, 'keyup').pipe(
  mapTo("")
);
const keyed$ = merge(keyUp$, keyDown$).pipe(
  startWith("")
);
//String.fromCharCode(97+random(26))
const generator$ = (s:number)  => interval(s).pipe(
  map((x:number)=>({"val":String.fromCharCode(97+random(26)), "xCoor":random(height*4)})),
  tap((x:Letter)=> console.log(x.xCoor)),
  scan<Letter,Letter[]>((acc:Letter[], curr:Letter)=>{
    acc = [curr,...acc];
    return acc;
  }, [])
);


const game$ = combineLatest(keyed$,alphabet$).pipe(
    scan<[string,Letter[]], State>((acc:State, [key,letters])=>{
      if(letters.length>0 &&letters[letters.length-1].val === key){
        acc.score++;
        letters.pop();
      }
      if(acc.score>0 && acc.score%height===0 && !acc.clear){
        acc.clear = true;
        acc.level++;
        acc.invl = acc.invl-50;
        speed$.next(acc.invl);
      }
      if(acc.score%height === 1) acc.clear =false;
      acc.ltrs=letters;
      return acc;
    }, {score:0, level:1, invl:1000, clear:false, ltrs:[]}),
    takeWhile((s:State)=>s.ltrs.length<= height)
).subscribe({
      next(x:State){drawLetters(x)},
      error(err){},
      complete(){done()}
});
