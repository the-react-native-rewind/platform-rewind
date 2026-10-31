"use client";

import React from "react";
import classNames from "classnames";
import { ClipLoader } from "react-spinners";
import { Text } from "@/components/Text/Text";
import { usePointerOffset } from "@/utils/usePointerOffset/usePointerOffset";

export type PrimaryButtonVariant = "primary" | "marker" | "outline";

export interface PrimaryButtonProps {
  label: string;
  onClick?: () => void;
  loading?: boolean;
  fullWidth?: boolean;
  size?: "lg" | "sm";
  /**
   * `primary` is the pre-redesign button and stays the default so existing
   * callers are untouched. `marker` is the redesign CTA — Permanent Marker
   * over orange, with a hard bottom shadow that reads as a sticker pressed
   * onto the page. `outline` is the same shape with a hand-inked border.
   */
  variant?: PrimaryButtonVariant;
  type?: "button" | "submit";
  className?: string;
  /** `data-ph` for the delegated click tracker. Subscribe CTAs use `"cta"`. */
  dataPh?: string;
  /** `data-location` paired with `dataPh="cta"`. */
  dataLocation?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onClick,
  loading = false,
  fullWidth = true,
  size = "lg",
  variant = "primary",
  type = "button",
  className,
  dataPh,
  dataLocation,
}) => {
  const isMarker = variant === "marker" || variant === "outline";
  // A small pull toward the cursor as you approach. The press shadow still
  // does the work on click; this is only the approach.
  const { ref, offset } = usePointerOffset<HTMLButtonElement>({
    strength: 3,
    radius: 48,
  });

  return (
    <button
      ref={variant === "marker" ? ref : undefined}
      style={
        variant === "marker" && (offset.x || offset.y)
          ? { transform: `translate(${offset.x}px, ${offset.y}px)` }
          : undefined
      }
      type={type}
      onClick={onClick}
      data-ph={dataPh}
      data-location={dataLocation}
      className={classNames(
        fullWidth ? "w-full" : "w-auto",
        "flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        loading && "cursor-not-allowed opacity-70",
        {
          "rounded-lg bg-primary font-semibold text-white hover:bg-opacity-90 focus:ring-2 focus:ring-primary focus:ring-opacity-50":
            variant === "primary",
          "px-6 py-3 text-base": variant === "primary" && size === "sm",
          "px-8 py-4 text-lg": variant === "primary" && size === "lg",

          // The hard 2px bottom shadow is what makes this read as pressed-on
          // rather than drawn-in. Orange in both schemes: spray paint does not
          // care what it is sprayed on.
          // `cta-glitch` is the hook the hover glitch hangs off. It jitters
          // with `translate` rather than `transform`, so the magnetic pull
          // this element's transform carries keeps working underneath it.
          "cta-matrix cta-glitch press-sticker rounded-[10px] bg-primary text-white shadow-[0_2px_0_rgba(150,55,35,0.5),0_1px_2px_rgba(28,25,23,0.2)] transition-[background-color,transform,box-shadow,color] duration-150":
            variant === "marker",
          "rounded-[10px] border-[3px] border-rule-strong-light bg-transparent text-ink-light hover:border-mark-light hover:text-mark-light dark:border-rule-strong-dark dark:text-ink-dark dark:hover:border-mark-dark dark:hover:text-mark-dark":
            variant === "outline",
          "px-6 py-3": isMarker && size === "sm",
          // Tighter sides on a phone. "Beam me up, Scotty!" is a wider
          // label than the box had spare, and at 34px each side it wrapped
          // to two lines on a 320px screen.
          "px-5 py-[17px] sm:px-[34px]": isMarker && size === "lg",
        },
        className,
      )}
      disabled={loading}
    >
      {loading ? (
        <ClipLoader
          color={variant === "outline" ? "#E74B3C" : "#ffffff"}
          size={26}
        />
      ) : isMarker ? (
        <Text variant="cta" as="span" tone="inherit">
          {label}
        </Text>
      ) : (
        label
      )}
    </button>
  );
};
