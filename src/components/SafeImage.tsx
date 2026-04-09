"use client";

import React, { useState, useEffect } from "react";

interface SafeImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  fallbackSrc?: string;
  usePlaceholder?: boolean;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className,
  fallbackSrc = "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1000&auto=format&fit=crop",
  usePlaceholder = true,
  ...props
}) => {
  // Use a string state for the image source. If src is an empty string, default to fallbackSrc.
  const initialSrc = src || fallbackSrc;
  const [imgSrc, setImgSrc] = useState<string | null | undefined>(initialSrc);
  const [errorCount, setErrorCount] = useState(0);

  useEffect(() => {
    const nextSrc = src || fallbackSrc;
    setImgSrc(nextSrc);
    setErrorCount(0);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (errorCount === 0 && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setErrorCount(1);
    } else if (errorCount === 1 && usePlaceholder) {
      // Final fallback to a clean placeholder with the product name
      const placeholderText = encodeURIComponent(alt || "IEM Product");
      setImgSrc(`https://placehold.co/600x600/f3f4f6/374151?text=${placeholderText}`);
      setErrorCount(2);
    }
  };

  // If we still have an empty string or nothing at all, pass null to avoid browser warnings
  const finalSrc = imgSrc || null;

  return (
    <img
      src={finalSrc as any}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

export default SafeImage;
