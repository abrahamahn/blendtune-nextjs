// src\client\shared\components\common\Artwork.tsx
import React from "react";
import Image, { ImageProps } from "next/image";

export interface ArtworkProps extends Omit<ImageProps, "src" | "alt"> {
  /** Descriptive alt text for the image */
  alt: string;
  /** Optional catalog value to generate the URL (if no override provided) */
  catalog?: string;
  /** Fallback image name if catalog is not provided (default: "default") */
  fallback?: string;
  /** Override the generated URL with a full URL */
  srcOverride?: string;
}

/**
 * Artwork component centralizes the logic to load track artwork.
 * It builds the image URL from the provided catalog if no srcOverride is provided.
 */
const Artwork: React.FC<ArtworkProps> = ({
  alt,
  catalog,
  fallback = "default",
  srcOverride,
  ...imageProps
}) => {
  const src =
    srcOverride ||
    `https://blendtune-public.nyc3.cdn.digitaloceanspaces.com/artwork/${catalog ||
      fallback}.jpg`;

  return <Image src={src} alt={alt} {...imageProps} crossOrigin="anonymous" />;
};

export default Artwork;
