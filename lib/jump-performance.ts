export const hopDuration=940;
const ease=(value:number)=>{const p=Math.max(0,Math.min(1,value));return p*p*(3-2*p);};
export function hopPhase(milliseconds:number){const t=Number.isFinite(milliseconds)?Math.max(0,milliseconds):hopDuration;return t>=940?'idle':t<160?'crouch':t<680?'flight':'land';}
export function hopPose(milliseconds:number,actor:'moco'|'ren'){
 const t=Number.isFinite(milliseconds)?Math.max(0,Math.min(hopDuration,milliseconds)):hopDuration;let y=0,compression=0;
 if(t<160)compression=-.07*ease(t/160);
 else if(t<680){const p=(t-160)/520;y=-(actor==='ren'?78:60)*Math.sin(Math.PI*p)**2;compression=-.07*(1-ease(p/.18))+.03*Math.sin(Math.PI*p)-.08*ease((p-.85)/.15);}
 else{const p=(t-680)/260;compression=-.08*(1-ease(p))+.015*Math.sin(2*Math.PI*p)*(1-p);}
 return {phase:hopPhase(t),y,sx:1-compression*.5,sy:1+compression,load:Math.max(0,-compression)};
}
