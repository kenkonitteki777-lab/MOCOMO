type MocoMood = 'happy' | 'rest' | 'wonder';

const expressions: Record<MocoMood, { label: string; position: string }> = {
  happy: { label: 'にっこり', position: '0%' },
  wonder: { label: 'わくわく', position: '50%' },
  rest: { label: 'ひとやすみ', position: '100%' },
};
const poses={crouch:'0% 0%',flight:'100% 0%',land:'0% 100%',wave:'100% 100%'};

export default function Moco({ mood = 'happy', className = '', pose, motion }: { mood?: MocoMood; className?: string; pose?:'crouch'|'flight'|'land'|'wave';motion?:'idle'|'greet' }) {
  const expression = expressions[mood];
  return <span
    className={`moco ${className} ${motion ? `moco-motion-${motion}` : ''}`}
    role="img"
    aria-label={`もこも・${expression.label}`}
    data-mood={mood}
    data-pose={pose}
    style={pose?{backgroundImage:'url(/characters/moco/motion-v1.webp)',backgroundSize:'200% 200%',backgroundPosition:poses[pose]}:{backgroundPosition:`${expression.position} center`}}
  />;
}
