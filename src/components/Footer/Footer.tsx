import React from "react";
import Link from "next/link";
import Image from "next/image";
import { StaticUFO } from "../UFO/StaticUFO";
import { NavigationButtons } from "../NavigationButtons/NavigationButtons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSquareXTwitter,
  faLinkedin,
  faMedium,
  faSquareYoutube,
  faSquareGithub,
} from "@fortawesome/free-brands-svg-icons";
import { Text } from "../Text/Text";

export const Footer: React.FC = () => {
  return (
    <footer className="relative flex flex-col items-center space-y-8 py-8 w-full px-10">
      <Link href="/" aria-label="Platform Rewind — home">
        <StaticUFO width={40} height={40} />
      </Link>
      <NavigationButtons />
      <Text
        variant="body"
        tone="inherit"
        className="mb-4 max-w-xs text-center text-base"
      >
        The publication behind{" "}
        <a href="https://theagenticrewind.com" className="text-brand underline">
          The Agentic Rewind
        </a>{" "}
        and{" "}
        <a href="https://thereactnativerewind.com" className="text-brand underline">
          The React Native Rewind
        </a>
        .
      </Text>
      <div className="flex flex-col items-center gap-3">
        <div className="flex space-x-4">
          <a
            href="https://x.com/ReactNativeRwd"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faSquareXTwitter}
              className="wobble dark:text-white text-black hover:text-brand dark:hover:text-accent w-6 h-6"
            />
          </a>
          <a
            href="https://www.linkedin.com/newsletters/the-react-native-rewind-7265722507217764353/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faLinkedin}
              className="wobble dark:text-white text-black hover:text-brand dark:hover:text-accent w-6 h-6"
            />
          </a>
          <a
            href="https://medium.com/@thereactnativerewind"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faMedium}
              className="wobble dark:text-white text-black hover:text-brand dark:hover:text-accent w-6 h-6"
            />
          </a>
          <a
            href="https://www.youtube.com/@ReactNativeRewind"
            aria-label="YouTube"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faSquareYoutube}
              className="wobble dark:text-white text-black hover:text-brand dark:hover:text-accent w-6 h-6"
            />
          </a>
          <a
            href="https://github.com/the-react-native-rewind"
            aria-label="GitHub"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faSquareGithub}
              className="wobble dark:text-white text-black hover:text-brand dark:hover:text-accent w-6 h-6"
            />
          </a>
        </div>
      </div>

      {/*
        Decoration, so both copies are empty-alt and hidden from assistive
        tech rather than described — they say nothing the footer does not.

        Two files rather than one filtered one. The artwork is line work on
        transparency, not a painted white body, so on the dark wall the
        inverted stopgap could bring the ink back but not the yellow, which
        came out a dark brown nobody would see. A drawn dark variant keeps
        its own accent colour.

        Desktop only and lazy: `display: none` means a phone never fetches
        either one, and this sits at the bottom of a long page.

        `bottom-0` puts it against the very bottom edge of the footer, past
        the py-8, which is what makes it read as standing on the floor of
        the page rather than floating in the footer.
      */}
      <Image
        src="/alien-where-are-we-light.webp"
        alt=""
        aria-hidden="true"
        width={640}
        height={640}
        sizes="(min-width: 1024px) 240px, 0px"
        className="pointer-events-none absolute bottom-0 right-4 hidden h-auto w-[200px] select-none lg:block xl:w-[240px] dark:lg:hidden"
      />
      <Image
        src="/alien-where-are-we-dark.webp"
        alt=""
        aria-hidden="true"
        width={640}
        height={640}
        sizes="(min-width: 1024px) 240px, 0px"
        className="pointer-events-none absolute bottom-0 right-4 hidden h-auto w-[200px] select-none xl:w-[240px] dark:lg:block"
      />
    </footer>
  );
};
