import { ImageResponse } from 'next/og';
import { seo, site } from '@/lib/site';

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 84,
          background: '#1a1917',
          color: '#efece5',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 22,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#9a9488',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          Portfolio — {site.location}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 148, lineHeight: 0.95, letterSpacing: -3 }}>
            Mahak Jain
          </div>
          <div style={{ display: 'flex', fontSize: 40, marginTop: 20, color: '#efece5' }}>
            <span>Full-Stack&nbsp;</span>
            <span style={{ color: '#e2603b' }}>·</span>
            <span>&nbsp;Python&nbsp;</span>
            <span style={{ color: '#e2603b' }}>·</span>
            <span>&nbsp;GenAI</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            fontSize: 24,
            color: '#9a9488',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          {site.url.replace(/^https?:\/\//, '')}
        </div>
      </div>
    ),
    size
  );
}
