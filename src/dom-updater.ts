
import {ShipClassInterface} from "./shipclass";

const random = () => Math.round(Math.random() * 300);
export const elem = (id:string) => document.getElementById(id);


function css(element:any, style:any) {
    for (const property in style)
        element.style[property] = style[property];
}

export function paintCScore(x:any){
    elem("computerPoints").innerHTML = JSON.stringify(x);
}
export function paintPScore(x:any){
    elem("playerPoints").innerHTML = JSON.stringify(x);
}
function idGen(x:number, y:number, n:number){
  if(y === 0){
    return x+1;
  }
  if(x===0){
    return n*y+1;
  }
  return (y*n)+x+1
}

export function setUpGrid(n:number){
  //also must set up the player-id
  let pc = document.getElementById("grid-container-player-id");
  pc.style.width = `${n*32}px`;
  pc.style.height = `${n*32}px`;
  pc.style.gridTemplateColumns = `repeat(${n}, auto)`;
  let gc = document.getElementById("grid-container-id");
  gc.style.width = `${n*32}px`;
  gc.style.height = `${n*32}px`;
  gc.style.gridTemplateColumns = `repeat(${n}, auto)`;

  let cpc = document.getElementById("grid-container-player-id-c");
  cpc.style.width = `${n*32}px`;
  cpc.style.height = `${n*32}px`;
  cpc.style.gridTemplateColumns = `repeat(${n}, auto)`;
  let cgc = document.getElementById("grid-container-id-c");
  cgc.style.width = `${n*32}px`;
  cgc.style.height = `${n*32}px`;
  cgc.style.gridTemplateColumns = `repeat(${n}, auto)`;
  let o = 0;
  while(o< n){
    let i = 0
    while(i < n){
      let id = idGen(i++, o, n);
      let pci = document.createElement("div");
      pci.setAttribute("id", `${id}pci`);
      pci.classList.add("grid-item");
      pc.appendChild(pci);

      let gi = document.createElement("div");
      gi.setAttribute("id", `${id}`);
      gi.classList.add("grid-item");
      gc.appendChild(gi);

      let cpci = document.createElement("div");
      cpci.setAttribute("id", `${id}cpci`);
      cpci.classList.add("grid-item");
      cpc.appendChild(cpci);

      let cgi = document.createElement("div");
      cgi.setAttribute("id", `${id}c`);
      cgi.classList.add("grid-item");
      cgc.appendChild(cgi);
    }
    ++o;
  }
}
export function paintShip(n:number, s:number){
  let i = document.getElementById(`${n}`);
  i.innerHTML = `${s}`;
}

export function paintAll(x:ShipClassInterface){
  for(let i of x.shipman.ships){
    for (let j of i.pos){
      elem(`${j}c`).innerHTML = `${i.length}`;
    }
  }
}

export function paintShot(n:number, s:boolean){
  let i = document.getElementById(`${n}pci`);
  if(s)i.innerHTML = "X";
  else i.innerHTML = "O";
}

export function paintCShot(n:number, s:boolean){
  let i = document.getElementById(`${n}cpci`);
  if(s)i.innerHTML = "X";
  else i.innerHTML = "O";
}
