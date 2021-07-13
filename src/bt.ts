import { removeTubesUI, addTubeUI, moveTubesUI} from "./dom-updater";
import {Tube, Bird} from "./interfaces";



export class BufferTubes {
  _tubes:Tube[];
  _take:number;
  mapWidth:number;
  constructor(tubes:Tube[], take:number, mapWidth:number){
      this._take = take;
      tubes.splice(0,tubes.length-this._take);
      this._tubes = tubes;
      this.mapWidth = mapWidth;
  }
  get tubes():Tube[]{
    return this._tubes;
  }
  get take():number{
    return this._take;
  }
  //all ways add the the end of the map where x = 9
  addTube(id:number):Tube[]{
    //move pipe(s) in the current tubes then push new one with xCoor = 9
    let t:Tube = {"id":id, "xCoor":this.mapWidth -1, "gap":Math.floor(Math.random() * 7), "clear":false};
    this._tubes.push(t);
    addTubeUI(t);
    //to be removed from the UI as well
    removeTubesUI(this._tubes.splice(0,this._tubes.length-this._take));
    return this._tubes;
  }

  moveTubes(){
    for(let i=0; i<this._tubes.length;i++){
      this._tubes[i] = {"id":this._tubes[i].id, "xCoor":this._tubes[i].xCoor-1, "gap":this._tubes[i].gap, "clear":this._tubes[i].clear};
      if(this._tubes[i].xCoor < 0) {
        removeTubesUI([this._tubes.shift()]);
        i-=1;
      }
      moveTubesUI(this._tubes);
    }
  }
  clearPipe(){
    this._tubes[0].clear = true;
  }
  static isInGap(b:Bird, t:Tube):boolean{
    //the size of hte gap is 4 so if b.yCoor >= gap && b.yCoor < gap+4
    return b.yCoor>=t.gap && b.yCoor<t.gap+4;

  }

}
