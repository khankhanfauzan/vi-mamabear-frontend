"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import {Coordinates} from "@/store/use-ui-store";

interface FlyToCartGhostProps {
  imageUrl: string;
  startRect: Coordinates;
  endRect: Coordinates;
  onComplete: () => void;
}

export const FlyToCartGhost = ({
  imageUrl,
  startRect,
  endRect,
  onComplete,
}: FlyToCartGhostProps) => {
  const [position, setPosition] = useState<Coordinates>(startRect);
  const [opacity, setOpacity] = useState(1);
  const [isFlying, setIsFlying] = useState(false);

  useEffect(() => {
    // Start the animation a tiny bit after mounting to ensure DOM registers initial styles
    const timer = setTimeout(() => {
      setPosition(endRect);
      setOpacity(0.2); // Fade out slightly as it reaches the cart
      setIsFlying(true);
    }, 50);

    // End animation
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 850); // Match this with CSS transition duration (800ms) + 50ms buffer

    return () => {
      clearTimeout(timer);
      clearTimeout(completeTimer);
    };
  }, [endRect, onComplete]);

  // Only render on client where document.body exists
  if (typeof window === "undefined" || !document.body) return null;

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        width: isFlying ? 24 : startRect.width, // Shrink to cart icon size
        height: isFlying ? 24 : startRect.height, // Shrink to cart icon size
        opacity: opacity,
        zIndex: 99999, // Be above EVERYTHING
        transition: "all 0.8s cubic-bezier(0.25, 1, 0.5, 1)", // Smooth deceleration curve
        pointerEvents: "none", // Don't block clicks while flying
        borderRadius: "50%", // Optional: makes it look like a bubble
        overflow: "hidden",
        boxShadow: isFlying ? "0 4px 12px rgba(0,0,0,0.2)" : "none",
      }}
    >
      <Image
        src={imageUrl}
        alt="flying-item"
        fill
        className="object-cover"
        sizes="100px"
      />
    </div>,
    document.body,
  );
};
