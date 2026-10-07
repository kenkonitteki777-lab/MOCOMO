// Original instrumental sketch: slow cloud-walk melody, not a recorded vocal song.
export function createMocomoMusic(){
 const context=new AudioContext();const master=context.createGain();master.gain.value=.075;master.connect(context.destination);
 const melody=[72,76,79,76,74,72,69,0,72,74,76,79,76,74,72,0];
 let cursor=0;let next=context.currentTime+.1;
 function note(midi:number,time:number,duration:number,gain:number){
  if(!midi)return;const oscillator=context.createOscillator();const envelope=context.createGain();oscillator.type='sine';oscillator.frequency.value=440*2**((midi-69)/12);
  envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(gain,time+.06);envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  oscillator.connect(envelope);envelope.connect(master);oscillator.start(time);oscillator.stop(time+duration+.05);
 }
 function schedule(){while(next<context.currentTime+1){note(melody[cursor%melody.length],next,1.35,.3);if(cursor%4===0){const chord=cursor%16<8?[48,55,60]:[53,57,60];for(const pitch of chord)note(pitch,next,3.2,.08);}next+=60/66;cursor++;}}
 schedule();const timer=setInterval(schedule,200);
 return {setVolume(value:number){master.gain.setTargetAtTime(value*.15,context.currentTime,.1);},stop(){clearInterval(timer);void context.close();}};
}
