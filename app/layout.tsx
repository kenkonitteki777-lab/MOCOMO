import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'MOCOMO | 雲の上の、小さな世界', description: 'モコモは、いつも君のそばにいる友達。あそぶ、みつける、つくる、やすむ。子どもの毎日と一緒に育つ、小さな世界。', robots: { index: false, follow: false } };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="ja"><body>{children}</body></html>;}
