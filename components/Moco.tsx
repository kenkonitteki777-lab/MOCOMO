export default function Moco({ mood = 'happy', className = '' }: { mood?: 'happy' | 'rest' | 'wonder'; className?: string }) {
  return <svg className={`moco ${className}`} viewBox="0 0 240 205" role="img" aria-label={`もこも・${mood === 'rest' ? 'ひとやすみ' : mood === 'wonder' ? 'わくわく' : 'にっこり'}`}>
    <ellipse cx="120" cy="187" rx="74" ry="9" fill="#748f9a" opacity=".13" />
    <path d="M53 161C23 158 12 131 28 110C15 88 33 61 59 62C61 29 94 20 114 40C137 12 171 32 173 57C202 52 220 78 210 100C235 120 217 151 194 156C187 181 154 184 136 173C111 191 80 181 72 167C66 169 59 166 53 161Z" fill="#fffcf3" stroke="#e9e6da" strokeWidth="2" />
    <ellipse cx="64" cy="131" rx="13" ry="7" fill="#f4c2c1" opacity=".65" /><ellipse cx="173" cy="131" rx="13" ry="7" fill="#f4c2c1" opacity=".65" />
    {mood === 'rest' ? <g stroke="#536069" strokeWidth="3.5" strokeLinecap="round" fill="none"><path d="M77 114q7 7 14 0"/><path d="M147 114q7 7 14 0"/></g> : <g fill="#46535c"><ellipse cx="84" cy="114" rx="4" ry={mood === 'wonder' ? 7 : 5}/><ellipse cx="154" cy="114" rx="4" ry={mood === 'wonder' ? 7 : 5}/></g>}
    <path d="M114 130q5 5 10 0" stroke="#64717a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M95 169q-3 12 8 9M143 169q3 12-8 9" stroke="#e9e6da" strokeWidth="2" fill="#fffcf3" />
  </svg>;
}
