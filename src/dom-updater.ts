

const random = () => Math.round(Math.random() * 300);
export const elem = (id:string) => document.getElementById(id);


function css(element:any, style:any) {
    for (const property in style)
        element.style[property] = style[property];
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
  let gc = document.getElementById("grid-container-id");
  gc.style.width = `${n*32}px`;
  gc.style.height = `${n*32}px`;
  gc.style.gridTemplateColumns = `repeat(${n}, auto)`;
  let o = 0;
  while(o< n){
    let i = 0
    while(i < n){
      let id = idGen(i++, o, n);
      let gi = document.createElement("div");
      gi.setAttribute("id", `${id}`);
      gi.classList.add("grid-item");
      gc.appendChild(gi);
    }
    ++o;
  }
}

export function paintShip(n:number, s:number){
  let i = document.getElementById(`${n}`);
  i.innerHTML = `${s}`;
}
