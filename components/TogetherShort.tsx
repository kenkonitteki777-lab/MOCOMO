import { useId } from 'react';
import CharacterFace from './CharacterFace';
import { togetherFrame, togetherPose, togetherScenes } from '../lib/together-motion';

export default function TogetherShort({ seconds, quiet = false }: { seconds: number; quiet?: boolean }) {
  const pose = togetherPose(seconds, quiet), frame = togetherFrame(seconds), glow = useId();
  return <div className="together-short" data-frame={frame} data-master="cloud-pair-v1" data-contact="shared">
    <svg viewBox="0 0 800 600" role="img" aria-label="モコモとスイが、一つの星をいっしょに支える">
      <defs><radialGradient id={glow}><stop stopColor="#ffe2a1" stopOpacity={pose.glow} /><stop offset="1" stopColor="#ffe2a1" stopOpacity="0" /></radialGradient></defs>
      <ellipse cx="400" cy="540" rx="220" ry="20" fill="#718e9e16" />
      <g className="together-connected" transform={`translate(400 540) rotate(${pose.tilt}) scale(${pose.scaleX} ${pose.scaleY}) translate(-400 -540) translate(0 ${pose.y})`}>
        <circle cx="466" cy="400" r="180" fill={`url(#${glow})`} />
        <image className="together-skin" href="/characters/together/hold-v1.webp" x="0" y="-140" width="800" height="800" />
        <g className="together-moco-face" transform="translate(378 289) rotate(-16) scale(.95) translate(-200 -221)"><g transform={`translate(${pose.mocoLook} 0)`}><CharacterFace character="moco" pose={pose.moco} soft /></g></g>
        <g className="together-sui-face" transform="translate(615 315) rotate(12) scale(1.04) translate(-161 -228)"><g transform={`translate(${pose.suiLook} 0)`}><CharacterFace character="sui" pose={pose.sui} soft /></g></g>
      </g>
    </svg>
    <p className="together-caption" role="status">{togetherScenes[frame].text}</p>
  </div>;
}
