type MocoMood = 'happy' | 'rest' | 'wonder' | 'laugh' | 'listen' | 'tickle' | 'thanks';

const expressions: Record<MocoMood, { label: string; position: string }> = {
  happy: { label: 'にっこり', position: '0%' },
  wonder: { label: 'わくわく', position: '50%' },
  rest: { label: 'ひとやすみ', position: '100%' },
  laugh: { label: 'にこにこ', position: '0% 0%' },
  listen: { label: 'きいている', position: '100% 0%' },
  tickle: { label: 'くすぐったい', position: '0% 100%' },
  thanks: { label: 'ありがとう', position: '100% 100%' },
};
const poses={crouch:'0%',flight:'50%',land:'0%',wave:'0%'};

export default function Moco({ mood = 'happy', className = '', pose, motion }: { mood?: MocoMood; className?: string; pose?:'crouch'|'flight'|'land'|'wave';motion?:'idle'|'greet' }) {
  const expression = expressions[mood];
  return <span
    className={`moco ${className} ${motion ? `moco-motion-${motion}` : ''}`}
    role="img"
    aria-label={`もこも・${expression.label}`}
    data-mood={mood}
    data-pose={pose}
    style={pose?{backgroundImage:'url(/characters/moco/expressions-v2.webp)',backgroundSize:'300% 100%',backgroundPosition:`${poses[pose]} center`}:['laugh','listen','tickle','thanks'].includes(mood)?{backgroundImage:'url(/characters/moco/reactions-v2.webp)',backgroundSize:'200% 200%',backgroundPosition:expression.position}:{backgroundPosition:`${expression.position} center`}}
  />;
}
