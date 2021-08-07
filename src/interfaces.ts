import { ShipClassInterface } from "./shipclass";
import {ShotClassInterface} from "./shotsClass";

export interface Boards{
  playerBoard:ShipClassInterface;
  computerBoard:ShipClassInterface;
  playerShot: ShotClassInterface;
  computerShot: ShotClassInterface;
}
