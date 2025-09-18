"use client";

import Image from "next/image";
import { useRef, useState } from "react";

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
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const hasImages = Array.isArray(images) && images.length > 0;
  const safeImages = hasImages
    ? images.filter((src) => src && src.trim() !== "")
    : [];
  const displayImages =
    safeImages.length > 0 ? safeImages : ["/images/no-images.png"];

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
          className="object-contain select-none"
          priority
          draggable={false}
        />

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
              <Image
                src={thumbSrc}
                alt={`${alt} küçük önizleme ${idx + 1}`}
                width={80}
                height={80}
                className="object-cover rounded-md"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
