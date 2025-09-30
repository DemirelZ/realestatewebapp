"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
  className?: string;
};

export default function ImageCarousel({
  images,
  alt,
  className,
}: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainLoading, setMainLoading] = useState(true);
  const [loadedThumbs, setLoadedThumbs] = useState<Set<number>>(new Set());
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const hasImages = Array.isArray(images) && images.length > 0;
  const safeImages = hasImages
    ? images.filter((src) => src && src.trim() !== "")
    : [];
  const displayImages =
    safeImages.length > 0 ? safeImages : ["/images/no-images.png"];

  useEffect(() => {
    // preload the first image to avoid infinite spinner on first render
    const img = new Image();
    img.src = displayImages[0];
    const handleLoad = () => {
      if (currentIndex === 0) setMainLoading(false);
    };
    const handleError = () => setMainLoading(false);
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", handleError);
    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", handleError);
    };
  }, [displayImages]);

  useEffect(() => {
    // whenever index changes, show loader until the new image loads
    setMainLoading(true);
  }, [currentIndex]);

  const goPrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + displayImages.length) % displayImages.length
    );
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % displayImages.length);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (displayImages.length <= 1) return;
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goPrev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goNext();
    }
  };

  const onTouchStart: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchStartXRef.current = e.changedTouches[0]?.clientX ?? null;
    touchEndXRef.current = null;
  };

  const onTouchMove: React.TouchEventHandler<HTMLDivElement> = (e) => {
    touchEndXRef.current = e.changedTouches[0]?.clientX ?? null;
  };

  const onTouchEnd: React.TouchEventHandler<HTMLDivElement> = () => {
    if (touchStartXRef.current == null || touchEndXRef.current == null) return;
    const deltaX = touchEndXRef.current - touchStartXRef.current;
    const threshold = 40; // px
    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        goPrev();
      } else {
        goNext();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <div className={className ?? ""}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${alt} görsel galerisi`}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        className="relative w-full h-80 md:h-[28rem] rounded-lg overflow-hidden shadow"
      >
        <Image
          src={displayImages[currentIndex]}
          alt={alt}
          fill
          className={`object-contain select-none transition-opacity duration-200 ${
            mainLoading ? "opacity-0" : "opacity-100"
          }`}
          priority
          draggable={false}
          onLoadingComplete={() => setMainLoading(false)}
          onError={() => setMainLoading(false)}
        />

        {mainLoading && (
          <div className="absolute inset-0 grid place-items-center bg-white/40">
            <div className="h-8 w-8 border-2 border-gray-700/40 border-t-gray-700 rounded-full animate-spin" />
          </div>
        )}

        {displayImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="Önceki görsel"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 grid place-items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={goNext}
              aria-label="Sonraki görsel"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-10 h-10 grid place-items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 4.293a1 1 0 011.414 0L13.707 9.293a1 1 0 010 1.414L8.707 15.707a1 1 0 01-1.414-1.414L11.586 10 7.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {displayImages.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-2 w-2 rounded-full ${
                    idx === currentIndex ? "bg-white" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {displayImages.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {displayImages.map((thumbSrc, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Görsel ${idx + 1}`}
              className={`relative flex-shrink-0 rounded-md border-2 ${
                idx === currentIndex
                  ? "border-blue-500"
                  : "border-transparent hover:border-gray-300"
              }`}
            >
              <div className="relative h-20 w-20">
                <Image
                  src={thumbSrc}
                  alt={`${alt} küçük önizleme ${idx + 1}`}
                  fill
                  className={`object-cover rounded-md transition-opacity duration-200 ${
                    loadedThumbs.has(idx) ? "opacity-100" : "opacity-0"
                  }`}
                  onLoadingComplete={() =>
                    setLoadedThumbs((prev) => new Set(prev).add(idx))
                  }
                />
                {!loadedThumbs.has(idx) && (
                  <div className="absolute inset-0 grid place-items-center bg-white/40 rounded-md">
                    <div className="h-5 w-5 border-2 border-gray-700/40 border-t-gray-700 rounded-full animate-spin" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
