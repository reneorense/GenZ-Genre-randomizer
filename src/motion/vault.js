import{wrap,nearest,settle,randomTarget}from './vault-math.js?v=4.0.1';
export const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
export function createVault({stage,rotor,palettes,onStart,onPreview,onFinish,onCancel,tick}){
 let items=[],position=0,frame=0,drag=null,active=false,last=-1;
 const slots=Array.from({length:9},()=>{const el=document.createElement('div');el.className='vault-card';const tag=document.createElement('small'),disc=document.createElement('div'),name=document.createElement('strong');disc.className='vault-disc';el.append(tag,disc,name);rotor.append(el);return {el,tag,name,id:null};});
 function paint(){
  const center=Math.round(position),i=nearest(position,items.length);
  rotor.hidden=!items.length;
  slots.forEach((s,k)=>{const offset=k-4,j=center+offset,g=items[wrap(j,items.length)];s.el.hidden=!g||(items.length<9&&(offset<-Math.floor((items.length-1)/2)||offset>Math.floor(items.length/2)));if(!g)return;
   if(s.id!==g.id){s.id=g.id;s.tag.textContent='GZ / '+String(g.id).padStart(3,'0');s.name.textContent=g.name;s.el.style.setProperty('--tile',palettes[g.category]||'#b6a6ee');}
   const theta=(j-position)*32;s.el.style.transform='rotateY('+theta+'deg) translateZ(var(--vault-radius))';s.el.style.opacity=String(Math.max(0,1-Math.abs(theta)/150));
  });
  if(i>=0&&i!==last){last=i;onPreview(items[i]);if(active)tick();}
 }
 function stop(){cancelAnimationFrame(frame);frame=0;}
 function begin(){if(!active){active=true;onStart();}}
 function finish(target){position=target;paint();const winner=items[nearest(position,items.length)];active=false;position=nearest(position,items.length);last=-1;paint();if(winner)onFinish(winner);else onCancel();}
 function animate(target,duration){stop();begin();const start=position;if(reduced()||duration<=0){finish(target);return;}let t0=null;function loop(t){if(t0===null)t0=t;const p=Math.min((t-t0)/duration,1);position=start+(target-start)*(1-Math.pow(1-p,3));paint();if(p<1)frame=requestAnimationFrame(loop);else{frame=0;finish(target);}}frame=requestAnimationFrame(loop);}
 function sync(list,id){if(active||drag)return;items=list.slice();const i=items.findIndex(g=>g.id===id);position=Math.max(0,i);last=-1;paint();}
 function spin(winner,quick){if(!items.length||drag||active)return false;const i=items.findIndex(g=>g.id===winner.id);if(i<0)return false;animate(randomTarget(position,i,items.length),quick?0:3400);return true;}
 function move(delta){if(!items.length||drag)return;animate(Math.round(position)+delta,270);}
 stage.addEventListener('pointerdown',e=>{if(!e.isPrimary||e.button!==0||!items.length)return;stop();drag={id:e.pointerId,x:e.clientX,y:e.clientY,t:performance.now(),v:0,moved:false};stage.setPointerCapture(e.pointerId);begin();stage.classList.add('vault-dragging');});
 stage.addEventListener('pointermove',e=>{if(!drag||e.pointerId!==drag.id)return;const now=performance.now(),dx=e.clientX-drag.x,dt=Math.max(1,now-drag.t);if(Math.abs(dx)>1)drag.moved=true;position-=dx/48;drag.v=.4*drag.v+.6*(-dx/48/dt);drag.x=e.clientX;drag.y=e.clientY;drag.t=now;paint();});
 function release(e,cancel=false){if(!drag||e.pointerId!==drag.id)return;const velocity=cancel||performance.now()-drag.t>100?0:drag.v;drag=null;stage.classList.remove('vault-dragging');const target=settle(position,velocity);animate(target,Math.abs(target-position)>1?Math.min(1450,400+Math.abs(target-position)*65):220);}
 stage.addEventListener('pointerup',e=>release(e));stage.addEventListener('pointercancel',e=>release(e,true));stage.addEventListener('lostpointercapture',e=>release(e,true));
 stage.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
 return {sync,spin,move};
}
