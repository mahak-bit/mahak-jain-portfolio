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
          padding: 80,
          background: '#0d0d10',
          color: '#f4f4f5',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 25,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: '#e8b45c',
          }}
        >
          <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 999, background: '#e8b45c', marginRight: 18 }} />
          AI Engineer · Creative Technologist
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: 84,
            fontWeight: 600,
            lineHeight: 1.12,
            letterSpacing: -2,
          }}
        >
          <div style={{ display: 'flex' }}>Building intelligent products</div>
          <div style={{ display: 'flex' }}>
            <span>with&nbsp;</span>
            <span style={{ color: '#e8b45c' }}>AI</span>
            <span>, code &amp; creativity.</span>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 27,
            color: '#a1a1aa',
          }}
        >
          <span style={{ color: '#f4f4f5', fontWeight: 600 }}>{site.name}</span>
          <span>{site.url.replace('https://', '')}</span>
        </div>
      </div>
    ),
    size
  );
}
