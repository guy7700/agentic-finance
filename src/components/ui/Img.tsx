import Image, { type ImageProps } from 'next/image';
import { asset } from '@/lib/paths';

type ImgProps = Omit<ImageProps, 'src'> & { src: string; position?: string };

/**
 * next/image with base-path-aware sources and optional focal point.
 * Lazy-loaded by default; pass `preload` only for the LCP image.
 */
export function Img({ src, position, style, alt, ...rest }: ImgProps) {
  return (
    <Image
      src={asset(src)}
      alt={alt}
      style={position ? { objectPosition: position, ...style } : style}
      {...rest}
    />
  );
}
