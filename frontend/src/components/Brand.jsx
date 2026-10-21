export function Logo({ size = 36 }) {
  return <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#22C55E" /><stop offset="1" stopColor="#166534" /></linearGradient></defs>
    <rect width="40" height="40" rx="11" fill="url(#lg)" /><path d="M9 16l11-5 11 5v11l-11 5-11-5z" fill="none" stroke="#fff" strokeWidth="2" strokeLinejoin="round" /><path d="M9 16l11 5 11-5M20 21v11" stroke="#fff" strokeWidth="2" fill="none" opacity=".7" />
    <path d="M26 8l1 2.5 2.5 1-2.5 1L26 15l-1-2.5-2.5-1 2.5-1z" fill="#DCFCE7" /></svg>;
}
export function Sparkle({ size = 16, color = '#16A34A' }) { return <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.2 6.3L21 10l-6.8 1.7L12 18l-2.2-6.3L3 10l6.8-1.7z" fill={color} /></svg>; }
export function EmptyArt() {
  return <svg width="120" height="96" viewBox="0 0 120 96" aria-hidden="true"><ellipse cx="60" cy="84" rx="40" ry="7" fill="#F1F5F9" /><path d="M30 38l30-14 30 14v30L60 82 30 68z" fill="#F0FDF4" stroke="#86EFAC" strokeWidth="2" strokeLinejoin="round" /><path d="M30 38l30 14 30-14M60 52v30" stroke="#86EFAC" strokeWidth="2" fill="none" /><path d="M88 14l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" fill="#22C55E" /></svg>;
}
export function LoginArt() {
  return <svg viewBox="0 0 460 300" style={{ width: '100%', maxWidth: 460 }} aria-hidden="true">
    <path d="M10 270h440" stroke="#86EFAC" strokeWidth="2" />
    <g className="float"><path d="M250 120l60-28 60 28v60l-60 28-60-28z" fill="#fff" stroke="#16A34A" strokeWidth="3" strokeLinejoin="round" /><path d="M250 120l60 28 60-28M310 148v60" stroke="#16A34A" strokeWidth="3" fill="none" /><path d="M280 106l60 28" stroke="#BBF7D0" strokeWidth="6" /></g>
    {[[40, 190], [40, 140], [110, 190], [180, 190]].map(([x, y], i) => <g key={i}><rect x={x} y={y + 30} width="62" height="50" rx="4" fill="#fff" stroke="#16A34A" strokeWidth="2" /><path d={`M${x} ${y + 48}h62M${x + 31} ${y + 30}v18`} stroke="#86EFAC" strokeWidth="2" /></g>)}
    <rect x="40" y="230" width="62" height="40" rx="4" fill="#fff" stroke="#16A34A" strokeWidth="2" /><rect x="110" y="230" width="62" height="40" rx="4" fill="#fff" stroke="#16A34A" strokeWidth="2" /><rect x="180" y="230" width="62" height="40" rx="4" fill="#fff" stroke="#16A34A" strokeWidth="2" />
    <g transform="translate(250,20)"><rect width="200" height="64" rx="12" fill="#fff" opacity=".92" /><polyline points="14,46 50,38 80,42 112,24 146,28 186,10" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" /><polyline points="146,28 186,10" fill="none" stroke="#16A34A" strokeWidth="3" strokeDasharray="5 4" /></g>
    <path d="M60 60l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill="#22C55E" /><path d="M420 150l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#16A34A" opacity=".7" /><circle cx="400" cy="250" r="26" fill="none" stroke="#16A34A" strokeWidth="3" opacity=".4" /><path d="M400 236v14l9 6" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" opacity=".6" />
  </svg>;
}
