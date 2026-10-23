import type { SVGProps } from 'react';

const paths = {
  'arrow-right': <path d="M4 10h12m-5-5 5 5-5 5" />,
  'arrow-up-right': <path d="M6 14 14 6M7 6h7v7" />,
  'arrow-down': <path d="M10 4v12m-5-5 5 5 5-5" />,
  'arrow-left': <path d="M16 10H4m5-5-5 5 5 5" />,
  'chevron-down': <path d="m5 8 5 5 5-5" />,
  'chevron-left': <path d="m12 5-5 5 5 5" />,
  'chevron-right': <path d="m8 5 5 5-5 5" />,
  plus: <path d="M10 4v12M4 10h12" />,
  minus: <path d="M4 10h12" />,
  close: <path d="M4 4l12 12M16 4 4 16" />,
  menu: <path d="M3 6h14M3 10h14M3 14h14" />,
  play: <path d="M7 5.5v9l7.5-4.5z" fill="currentColor" stroke="none" />,
  pause: <path d="M7 5v10M13 5v10" />,
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
      <path d="M3.5 8.5h13M7 3v3M13 3v3" />
    </>
  ),
  pin: (
    <>
      <path d="M10 17s5.5-4.8 5.5-9a5.5 5.5 0 1 0-11 0c0 4.2 5.5 9 5.5 9z" />
      <circle cx="10" cy="8" r="2" />
    </>
  ),
  users: (
    <>
      <circle cx="8" cy="7" r="2.75" />
      <path d="M2.75 16c.6-2.9 2.6-4.5 5.25-4.5s4.65 1.6 5.25 4.5M13 4.6a2.75 2.75 0 0 1 0 5M15 11.8c1.3.6 2 1.9 2.3 4.2" />
    </>
  ),
  lock: (
    <>
      <rect x="4.5" y="9" width="11" height="8" rx="1.5" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </>
  ),
  check: <path d="m4.5 10.5 3.5 3.5 7.5-8" />,
  mail: (
    <>
      <rect x="3" y="5" width="14" height="10" rx="1.5" />
      <path d="m3.5 6 6.5 5 6.5-5" />
    </>
  ),
  phone: <path d="M6.5 3.5h-2a1 1 0 0 0-1 1.1C4 11 9 16 15.4 16.5a1 1 0 0 0 1.1-1v-2l-3-1.5-1.5 1.5c-1.8-.8-3.2-2.2-4-4L9.5 8 8 5z" />,
  download: <path d="M10 3.5v9m-4-4 4 4 4-4M4 15.5h12" />,
  external: <path d="M8 4H4.5v11.5H16V12M11 4h5v5M16 4l-7 7" />,
  search: (
    <>
      <circle cx="9" cy="9" r="5" />
      <path d="m13 13 3.5 3.5" />
    </>
  ),
  linkedin: (
    <path
      d="M5.2 7.6H3V17h2.2zM4.1 3a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6zM17 11.6c0-2.6-1.4-4.2-3.6-4.2-1.3 0-2.1.7-2.5 1.3V7.6H8.7V17h2.2v-5c0-1.4.6-2.4 1.8-2.4s1.6 1 1.6 2.4v5H17z"
      fill="currentColor"
      stroke="none"
    />
  ),
  x: <path d="M4 3.5h3.2l3.3 4.7 4-4.7h1.7L11.3 9.3 16.5 16.5h-3.2l-3.6-5.1-4.4 5.1H3.6l5.3-6.1z" fill="currentColor" stroke="none" />,
  globe: (
    <>
      <circle cx="10" cy="10" r="6.5" />
      <path d="M3.5 10h13M10 3.5c1.8 1.8 2.7 4 2.7 6.5s-.9 4.7-2.7 6.5c-1.8-1.8-2.7-4-2.7-6.5s.9-4.7 2.7-6.5z" />
    </>
  ),
  instagram: (
    <>
      <rect x="3.5" y="3.5" width="13" height="13" rx="3.5" />
      <circle cx="10" cy="10" r="3" />
      <circle cx="14" cy="6" r=".6" fill="currentColor" />
    </>
  ),
  telegram: <path d="M16.5 4 3.5 9.2l4 1.5 1.5 4.8 2.3-2.6 3.4 2.6zM7.5 10.7l7-4.7-5.2 5.6" />,
  mic: (
    <>
      <rect x="7.5" y="3" width="5" height="9" rx="2.5" />
      <path d="M5 9.5a5 5 0 0 0 10 0M10 14.5V17" />
    </>
  ),
  handshake: <path d="m2.5 9 3-3.5 3 1 2-1 4 .5 3 3M6 12l2.5 2.5a1 1 0 0 0 1.5 0l.5-.5 1 1a1 1 0 0 0 1.5 0l2.5-3M5.5 5.5 2.5 9l2.5 2.5M14.5 6l3 3-2 2" />,
  door: (
    <>
      <path d="M5 17V3.5h8V17M3 17h14" />
      <circle cx="11" cy="10.5" r=".6" fill="currentColor" />
    </>
  ),
  spark: <path d="M10 3v4M10 13v4M3 10h4M13 10h4M5.5 5.5l2 2M12.5 12.5l2 2M5.5 14.5l2-2M12.5 7.5l2-2" />,
  volume: <path d="M3.5 8h3l4-3.5v11L6.5 12h-3zM13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5.5a6.5 6.5 0 0 1 0 9" />,
  'volume-off': <path d="M3.5 8h3l4-3.5v11L6.5 12h-3zM13.5 8l4 4m0-4-4 4" />,
  expand: <path d="M4 8V4h4M16 8V4h-4M4 12v4h4M16 12v4h-4" />,
} as const;

export type IconName = keyof typeof paths;

type IconProps = SVGProps<SVGSVGElement> & { name: IconName; size?: number; title?: string };

export function Icon({ name, size = 20, title, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {paths[name]}
    </svg>
  );
}
