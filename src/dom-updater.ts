

import {Letter, State} from "./interfaces";


//const random = () => Math.round(Math.random() * 300);
export const elem = (id:string) => document.getElementById(id);

export function drawLetters(s:State){
  document.body.innerHTML = "";
  document.body.innerHTML+=`SCORE: ${s.score} | level: ${s.level}`+"<br/>"
  for(let i of s.ltrs){
    document.body.innerHTML +='&nbsp'.repeat(i.xCoor) + i.val+"<br/>";
  }
}
export function done(){
  document.body.innerHTML = "DIED";
}

/*
function css(element:any, style:any) {
    for (const property in style)
        element.style[property] = style[property];
}

export function removeTubesUI(tubes:Tube[]):void{
  for( let i of tubes){
    let tube = document.getElementById(`tube-${i.id}`);
    tube.remove();
  }
}

export function moveTubesUI(tubes:Tube[]):void{
  for (let i of tubes){
    let tube = document.getElementById(`tube-${i.id}`);
    tube.style.transform = `translate(${10+i.xCoor*20}px, 10px)`;
  }
}

export function addTubeUI(tube:Tube):void{
  let gw = document.getElementById("gameWindow");
  let t = document.createElement("div");
  let gap = document.createElement("div");
  t.setAttribute("id", `tube-${tube.id}`);
  t.style.transform = `translate(${10+(tube.xCoor*20)}px, 10px)`;
  t.classList.add("pipe");
  //t.style.transition = "all 1s ease-in-out";

  gap.setAttribute("id", `gap-${tube.id}`);
  gap.style.transform = `translate(0px, ${tube.gap*20}px)`;
  gap.classList.add("gap");

  gw.appendChild(t);
  t.appendChild(gap);
}

export function moveBird(y:number):void{
  elem("bird").style.transform = `translate(10px,${(y*20)+10 }px)`;
}



export function updateStatus(s:State):void{
  elem("status").innerHTML = `LIVES: ${s.lives} | SCORE: ${s.score}`;
}
*/
