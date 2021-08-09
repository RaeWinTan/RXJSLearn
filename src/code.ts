

import { Boards } from "./interfaces";
import { concat} from "rxjs";
import { setUp$, ui$ } from "./setup";
import {shots$} from "./shots";
import { switchMap } from "rxjs/operators";
//debuging purpose, where computer and player shots can be seen
const game$ = ui$.pipe(
  switchMap((initial:Boards)=>concat(setUp$(initial), shots$(initial)))
);

game$.subscribe();
