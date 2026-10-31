"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePointerEvade } from "@/utils/usePointerEvade/usePointerEvade";
import { NavigationButtons } from "../NavigationButtons/NavigationButtons";

const HamburgerIcon: React.FC<{ isOpen: boolean; onClick: () => void }> = ({
  isOpen,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="flex size-11 cursor-pointer items-center justify-center text-ink-light focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-ink-dark lg:hidden"
      aria-label="Toggle menu"
      aria-expanded={isOpen}
    >
      {/*
        Three marker strokes rather than three rectangles — the rest of the
        chrome is hand-drawn, and a pixel-perfect icon was the one thing in
        the nav that still looked typed.
      */}
      <svg
        viewBox="0 0 26 20"
        aria-hidden="true"
        focusable="false"
        className="size-7 overflow-visible"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.4}
        strokeLinecap="round"
      >
        <path
          d="M3 4c6-1.2 15-1.2 20 .4"
          className="origin-center transition-transform duration-300"
          style={
            isOpen ? { transform: "translateY(6px) rotate(45deg)" } : undefined
          }
        />
        <path
          d="M3 10c7-1.1 14-1 20 .6"
          className="origin-center transition-opacity duration-300"
          style={isOpen ? { opacity: 0 } : undefined}
        />
        <path
          d="M3 16c5.5-1.3 15-1 20 .3"
          className="origin-center transition-transform duration-300"
          style={
            isOpen
              ? { transform: "translateY(-6px) rotate(-45deg)" }
              : undefined
          }
        />
      </svg>
    </button>
  );
};

const MobileDrawer: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed top-0 left-0 right-0 bottom-0 m-0 p-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        style={{ margin: 0, padding: 0 }}
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 m-0 p-0 h-full w-96 max-w-[90vw] z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ margin: 0, padding: 0 }}
      >
        <div className="flex flex-col items-start p-6 pt-20">
          <NavigationButtons vertical onLinkClick={onClose} />
        </div>
      </div>
    </>
  );
};

export const NavigationBar: React.FC<{ memeMode?: boolean }> = ({
  memeMode = false,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { ref: ufoRef, offset: ufoOffset } = usePointerEvade<HTMLSpanElement>({
    strength: 24,
    reach: 150,
  });

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDrawerOpen]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      {/*
        The drawer sits at z-50 and covers the top-right corner, so while it
        is open the bar has to rise above it — otherwise the close control is
        underneath the panel and the only way out is tapping the backdrop.
      */}
      <nav
        className={`relative flex w-full items-center justify-between px-6 pb-2.5 pt-[18px] sm:px-10 lg:px-16 ${
          isDrawerOpen ? "z-[60]" : "z-[6]"
        }`}
      >
        <Link
          href="/"
          onClick={closeDrawer}
          aria-label="Platform Rewind — home"
          className={`block ${memeMode ? "pointer-events-auto opacity-20 hover:opacity-100 transition-opacity duration-300" : ""}`}
        >
          {/*
            No sticker wrapper here, so no rotation and no drips — this mark
            carries its own outline and reads better sitting straight.

            It backs away from the pointer instead. `strength` stays under
            half the 60px box on purpose: a pointer that reaches where the
            logo used to be is still inside the logo, so the chase always
            ends in a catch and the link never becomes unclickable. On touch
            or with reduced motion the hook does nothing and this is an
            ordinary image in a link.
          */}
          <span
            ref={ufoRef}
            className="block h-[60px] w-[60px] transition-transform duration-[650ms] ease-out will-change-transform"
            style={{
              transform: `translate3d(${ufoOffset.x}px, ${ufoOffset.y}px, 0)`,
            }}
          >
            <Image
              src="/ufo-logo.webp"
              alt=""
              aria-hidden="true"
              width={60}
              height={60}
              priority
              className="h-[60px] w-[60px] select-none object-contain"
            />
          </span>
        </Link>
        {/* Desktop Navigation - hidden on lg and below */}
        <div
          className={`hidden lg:block ${memeMode ? "pointer-events-auto opacity-20 hover:opacity-100 transition-opacity duration-300" : ""}`}
        >
          <NavigationButtons />
        </div>
        {/* Mobile Hamburger - visible on md and below */}
        <div
          className={`lg:hidden ${
            memeMode
              ? "pointer-events-auto opacity-20 hover:opacity-100 transition-opacity duration-300"
              : ""
          }`}
        >
          <HamburgerIcon isOpen={isDrawerOpen} onClick={toggleDrawer} />
        </div>
      </nav>
      {/* Mobile Drawer */}
      <MobileDrawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};
