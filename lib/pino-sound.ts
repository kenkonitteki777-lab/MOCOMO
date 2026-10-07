// Original, locally synthesized palette music. No network, samples or microphone.
export function createPinoSound(){
 const context=new AudioContext();const master=context.createGain();master.gain.value=.07;
 const limiter=context.createDynamicsCompressor();limiter.threshold.value=-20;limiter.ratio.value=4;master.connect(limiter);limiter.connect(context.destination);
 const pitches:Record<string,number>={'ももいろ':72,'そらいろ':76,'きいろ':79,'みどり':81};
 let colors=['ももいろ','きいろ','そらいろ'];let cursor=0;let next=context.currentTime+.1;let stopped=false;
 function note(midi:number,time:number,length:number,volume:number,type:OscillatorType,pan:number){
  if(stopped)return;const voice=context.createOscillator();const gain=context.createGain();const filter=context.createBiquadFilter();const position=context.createStereoPanner();
  voice.type=type;voice.frequency.value=440*2**((midi-69)/12);filter.type='lowpass';filter.frequency.value=1800;position.pan.value=pan;
  gain.gain.setValueAtTime(0,time);gain.gain.linearRampToValueAtTime(volume,time+.04);gain.gain.exponentialRampToValueAtTime(.0001,time+length);
  voice.connect(filter);filter.connect(gain);gain.connect(position);position.connect(master);voice.start(time);voice.stop(time+length+.05);
  voice.onended=()=>{voice.disconnect();filter.disconnect();gain.disconnect();position.disconnect();};
 }
 function schedule(){while(!stopped&&next<context.currentTime+.5){
  const pitch=pitches[colors[cursor%3]]??72;
  if(cursor%8<6)note(pitch,next,2.5,.18,'triangle',cursor%2?.2:-.2);
  if(cursor%8===0){note(48,next,7,.11,'sine',-.1);note(55,next,7,.07,'sine',.1);}
  if(cursor%12===5)note(pitch+12,next,3,.04,'sine',.3);
  next+=1.25;cursor++;
 }}
 schedule();const timer=setInterval(schedule,200);
 return {
  start:()=>context.resume(),
  setColors(nextColors:string[]){colors=[...nextColors];},
  pluck(color:string,band:number){note(pitches[color]??72,context.currentTime+.02,1.8,.32,'sine',(band-1)*.3);},
  stop(){if(stopped)return;stopped=true;clearInterval(timer);master.gain.setTargetAtTime(0,context.currentTime,.03);void context.close();}
 };
}
