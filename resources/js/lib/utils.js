import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures all Bengali digits (০-৯) are wrapped in a dedicated span
 * with standard regular Bengali typography (Noto Sans Bengali) for crystal-clear legibility.
 */
export function formatBanglaDigits(text) {
  if (!text) return text;
  const str = String(text);
  if (!/[\u09E6-\u09EF]/.test(str)) return text;
  const parts = str.split(/([\u09E6-\u09EF]+)/g);
  return parts.map((part, i) => {
    if (/^[\u09E6-\u09EF]+$/.test(part)) {
      return React.createElement(
        "span",
        { key: i, className: "font-bengali-digits" },
        part
      );
    }
    return part;
  });
}
