type MocoMood = 'happy' | 'rest' | 'wonder';

const expressions: Record<MocoMood, { label: string; position: string }> = {
  happy: { label: 'にっこり', position: '0%' },
  wonder: { label: 'わくわく', position: '50%' },
  rest: { label: 'ひとやすみ', position: '100%' },
};

export default function Moco({ mood = 'happy', className = '' }: { mood?: MocoMood; className?: string }) {
  const expression = expressions[mood];
  return <span
    className={`moco ${className}`}
    role="img"
    aria-label={`もこも・${expression.label}`}
    data-mood={mood}
    style={{ backgroundPosition: `${expression.position} center` }}
  />;
}
