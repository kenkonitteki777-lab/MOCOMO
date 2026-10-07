// Original cloud-top arrangement, synthesized locally; no recorded vocals or samples.
export function createMocomoMusic(initialScene=0){
 const context=new AudioContext();
 const master=context.createGain();master.gain.value=.12;
 const limiter=context.createDynamicsCompressor();limiter.threshold.value=-18;limiter.knee.value=18;limiter.ratio.value=4;
 master.connect(limiter);limiter.connect(context.destination);
 const room=context.createConvolver();const tail=context.createGain();tail.gain.value=.24;room.connect(tail);tail.connect(master);
 // Seeded stereo room tail: smooth decay without unpredictable peaks.
 let seed=613;function noise(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296*2-1;}
 const impulse=context.createBuffer(2,context.sampleRate*2.6,context.sampleRate);
 for(let ch=0;ch<2;ch++){const data=impulse.getChannelData(ch);for(let i=0;i<data.length;i++)data[i]=noise()*Math.pow(1-i/data.length,3);}
 room.buffer=impulse;
 const melody=[72,0,76,79,0,76,74,0,72,0,69,72,0,74,76,0,79,0,81,79,0,76,74,0,72,0,74,76,0,72,0,0];
 const chords=[[48,55,60,64],[53,60,64,69],[57,60,64,67],[55,62,65,69]];
 let cursor=0;let next=context.currentTime+.12;let scene=initialScene;let stopped=false;
 function voice(midi:number,time:number,duration:number,gain:number,type:OscillatorType,attack:number,pan:number){
  if(!midi)return;const oscillator=context.createOscillator();const envelope=context.createGain();const filter=context.createBiquadFilter();const position=context.createStereoPanner();
  oscillator.type=type;oscillator.frequency.value=440*2**((midi-69)/12);filter.type='lowpass';filter.frequency.value=type==='triangle'?1200:3200;position.pan.value=pan;
  envelope.gain.setValueAtTime(0,time);envelope.gain.linearRampToValueAtTime(gain,time+attack);envelope.gain.exponentialRampToValueAtTime(.0001,time+duration);
  oscillator.connect(filter);filter.connect(envelope);envelope.connect(position);position.connect(master);position.connect(room);
  oscillator.start(time);oscillator.stop(time+duration+.05);oscillator.onended=()=>{oscillator.disconnect();filter.disconnect();envelope.disconnect();position.disconnect();};
 }
 // A quiet filtered air layer, with slow movement rather than a rhythmic beat.
 const air=context.createBufferSource();const airBuffer=context.createBuffer(1,context.sampleRate*4,context.sampleRate);const airData=airBuffer.getChannelData(0);
 for(let i=0;i<airData.length;i++)airData[i]=noise();air.buffer=airBuffer;air.loop=true;
 const airFilter=context.createBiquadFilter();airFilter.type='lowpass';airFilter.frequency.value=450;const airGain=context.createGain();airGain.gain.value=.018;
 const drift=context.createOscillator();drift.frequency.value=.07;const driftGain=context.createGain();driftGain.gain.value=.006;drift.connect(driftGain);driftGain.connect(airGain.gain);
 air.connect(airFilter);airFilter.connect(airGain);airGain.connect(master);air.start();drift.start();
 function schedule(){while(!stopped&&next<context.currentTime+1){
   const quiet=scene===2||scene===3;const note=melody[cursor%melody.length];
   // Felt-key melody; the pause after a phrase leaves room for reading aloud.
   if(!quiet||cursor%2===0)voice(note,next,2.8,quiet?.12:.23,'triangle',.025,-.12);
   if(cursor%8===0){const chord=quiet?[57,60,64,67]:chords[Math.floor(cursor/8)%chords.length];for(const pitch of chord)voice(pitch,next,9,.035,'sine',1.7,.15);}
   // Sparse celesta-like star glints; no bright accent during the conflict.
   if(!quiet&&cursor%16===6)voice(note?note+12:84,next,3.6,.055,'sine',.04,.35);
   next+=60/60;cursor++;
 }}
 schedule();const timer=setInterval(schedule,200);
 // Some browsers create a suspended context even within a user gesture.
 if(context.state==='suspended')void context.resume();
 return {
  setVolume(value:number){master.gain.setTargetAtTime(Math.max(0,Math.min(1,value))*.24,context.currentTime,.2);},
  setScene(index:number){scene=index;},
  stop(){if(stopped)return;stopped=true;clearInterval(timer);air.stop();drift.stop();void context.close();}
 };
}
