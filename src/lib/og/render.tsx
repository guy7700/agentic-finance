import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import sharp from 'sharp';
import type { OgCard } from './cards';

/**
 * Draws a share card at build time: 1200 × 630, the site's navy, gold and type
 * (Space Grotesk, Cormorant Garamond italic), returned as a JPEG. The image
 * renderer reads PNG and JPEG only, so every photo and logo goes through sharp
 * first, cropped to the exact size it is drawn at.
 */

export const OG_SIZE = { width: 1200, height: 630 };

const INK = '#0a1428';
const GOLD = '#d1b679';
const GOLD_BRIGHT = '#e6cf9c';
const IVORY = '#ede6d3';
const MUTED = '#c2c6d6';
const LINE = 'rgba(230, 207, 156, 0.28)';

const ROOT = process.cwd();
const fromPublic = (src: string) => path.join(ROOT, 'public', src.replace(/^\//, ''));

const PORTRAIT = { width: 330, height: 412 };

type Font = { name: string; data: Buffer; weight: 400 | 500 | 600 | 700; style: 'normal' | 'italic' };

let fonts: Promise<Font[]> | undefined;
function loadFonts(): Promise<Font[]> {
  const dir = path.join(ROOT, 'src/assets/fonts');
  const font = async (file: string, name: string, weight: Font['weight'], style: Font['style'] = 'normal'): Promise<Font> => ({
    name,
    data: await readFile(path.join(dir, file)),
    weight,
    style,
  });
  fonts ??= Promise.all([
    font('SpaceGrotesk-Regular.ttf', 'Space Grotesk', 400),
    font('SpaceGrotesk-Medium.ttf', 'Space Grotesk', 500),
    font('SpaceGrotesk-SemiBold.ttf', 'Space Grotesk', 600),
    font('SpaceGrotesk-Bold.ttf', 'Space Grotesk', 700),
    font('CormorantGaramond-MediumItalic.ttf', 'Cormorant Garamond', 500, 'italic'),
  ]);
  return fonts;
}

const dataUri = (buf: Buffer, type: 'png' | 'jpeg') => `data:image/${type};base64,${buf.toString('base64')}`;

type Logo = { src: string; width: number; height: number };
const logoCache = new Map<string, Promise<Logo>>();

/** A brand file rasterised at twice the size it is drawn at, so its edges stay sharp. */
function logo(file: string, height: number): Promise<Logo> {
  const key = `${file}@${height}`;
  let hit = logoCache.get(key);
  if (!hit) {
    hit = (async () => {
      const input = fromPublic(file);
      const meta = await sharp(input).metadata();
      const width = Math.round((height * (meta.width ?? 1)) / (meta.height ?? 1));
      const png = await sharp(input, { density: 600 })
        .resize(width * 2, height * 2, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();
      return { src: dataUri(png, 'png'), width, height };
    })();
    logoCache.set(key, hit);
  }
  return hit;
}

/** "50% 40%" → [0.5, 0.4]; anything else centres the crop. */
function focalPoint(position?: string): [number, number] {
  const m = position?.match(/(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
  return m ? [Number(m[1]) / 100, Number(m[2]) / 100] : [0.5, 0.5];
}

/** Crops a photo to cover width × height around its focal point, like CSS object-fit: cover. */
async function cover(src: string, width: number, height: number, position?: string): Promise<string> {
  const input = fromPublic(src);
  const meta = await sharp(input).metadata();
  const w = meta.width ?? width;
  const h = meta.height ?? height;
  const scale = Math.max(width / w, height / h);
  const rw = Math.max(width, Math.round(w * scale));
  const rh = Math.max(height, Math.round(h * scale));
  const [fx, fy] = focalPoint(position);
  const jpeg = await sharp(input)
    .resize(rw, rh)
    .extract({ left: Math.round((rw - width) * fx), top: Math.round((rh - height) * fy), width, height })
    .jpeg({ quality: 90 })
    .toBuffer();
  return dataUri(jpeg, 'jpeg');
}

/** Headline size from its length and the width it has, so it stays within three lines. */
function headlineSize(card: OgCard, narrow: boolean): number {
  const chars = card.title.length + (card.accent?.length ?? 0) * 0.85;
  const steps: [number, number][] = narrow
    ? [[14, 76], [22, 66], [34, 56], [50, 48], [Infinity, 42]]
    : [[14, 96], [22, 84], [32, 74], [46, 64], [64, 56], [Infinity, 48]];
  return steps.find(([max]) => chars <= max)![1];
}

export async function renderOgCard(card: OgCard): Promise<Buffer> {
  const narrow = Boolean(card.portrait);
  const odds = card.brand === 'the-odds';
  const [fontData, brandMark, producer, background, portrait] = await Promise.all([
    loadFonts(),
    odds ? logo('/brand/the-odds-logo.png', 62) : logo('/brand/agentic-finance-logo-gold.svg', 74),
    logo('/brand/more-and-more-logo-gold-m.svg', 28),
    card.image && !card.portrait ? cover(card.image, OG_SIZE.width, OG_SIZE.height, card.position) : undefined,
    card.portrait ? cover(card.portrait, PORTRAIT.width, PORTRAIT.height, '50% 30%') : undefined,
  ]);

  const size = headlineSize(card, narrow);
  const textWidth = narrow ? 660 : 900;

  const response = new ImageResponse(
    (
      <div style={{ display: 'flex', position: 'relative', width: '100%', height: '100%', background: INK, fontFamily: 'Space Grotesk', color: '#ffffff' }}>
        {background ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
          <img src={background} width={OG_SIZE.width} height={OG_SIZE.height} style={{ position: 'absolute', top: 0, left: 0 }} />
        ) : null}
        {/* Scrim: solid navy behind the text on the left, the photo showing through on the right. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundImage: background
              ? 'linear-gradient(90deg, rgba(5,11,24,0.96) 0%, rgba(8,16,34,0.9) 38%, rgba(10,20,40,0.5) 70%, rgba(10,20,40,0.18) 100%)'
              : 'radial-gradient(circle at 85% 12%, rgba(209,182,121,0.2) 0%, rgba(10,20,40,0) 55%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            backgroundImage: 'linear-gradient(0deg, rgba(5,11,24,0.9) 0%, rgba(5,11,24,0) 32%)',
          }}
        />
        {portrait ? (
          <div
            style={{
              position: 'absolute',
              top: 72,
              right: 72,
              display: 'flex',
              width: PORTRAIT.width + 4,
              height: PORTRAIT.height + 4,
              padding: 2,
              borderRadius: 24,
              background: `linear-gradient(160deg, ${GOLD_BRIGHT} 0%, rgba(209,182,121,0.25) 100%)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={portrait} width={PORTRAIT.width} height={PORTRAIT.height} style={{ borderRadius: 22 }} />
          </div>
        ) : null}

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '56px 72px 48px' }}>
          {/* Brand row: the event mark, a hairline, then the producer. */}
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={brandMark.src} width={brandMark.width} height={brandMark.height} />
            <div style={{ display: 'flex', width: 1, height: 44, margin: '0 26px', background: 'rgba(209,182,121,0.45)' }} />
            {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
            <img src={producer.src} width={producer.width} height={producer.height} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', flexGrow: 1, width: textWidth, paddingBottom: 34 }}>
            <div style={{ display: 'flex', alignItems: 'center', fontSize: 21, fontWeight: 500, letterSpacing: 3.6, textTransform: 'uppercase', color: GOLD }}>
              <div style={{ display: 'flex', width: 34, height: 2, marginRight: 16, background: GOLD }} />
              {card.eyebrow}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 22 }}>
              <div style={{ display: 'flex', fontSize: size, fontWeight: 600, lineHeight: 1.04, letterSpacing: -0.025 * size }}>{card.title}</div>
              {card.accent ? (
                <div
                  style={{
                    display: 'flex',
                    fontFamily: 'Cormorant Garamond',
                    fontStyle: 'italic',
                    fontWeight: 500,
                    fontSize: Math.round(size * 1.12),
                    lineHeight: 1.02,
                    color: GOLD_BRIGHT,
                    marginTop: Math.round(size * 0.06),
                  }}
                >
                  {card.accent}
                </div>
              ) : null}
            </div>
            {card.subtitle ? (
              <div style={{ display: 'flex', marginTop: 24, fontSize: narrow ? 26 : 28, lineHeight: 1.35, color: IVORY, maxWidth: textWidth }}>{card.subtitle}</div>
            ) : null}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingTop: 20,
              borderTop: `1px solid ${LINE}`,
              fontSize: 20,
              letterSpacing: 1.2,
            }}
          >
            <div style={{ display: 'flex', color: MUTED }}>agentic-finance.live</div>
            {card.note ? <div style={{ display: 'flex', color: GOLD_BRIGHT }}>{card.note}</div> : null}
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fontData },
  );

  const png = Buffer.from(await response.arrayBuffer());
  // 4:4:4 chroma keeps gold type on navy crisp; mozjpeg keeps the file small.
  return sharp(png).jpeg({ quality: 84, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
}
