export const newsletters = [
  {
    id: "agentic",
    name: "The Agentic Rewind",
    description: "We test the AI hype so you only get what actually ships.",
    href: "https://theagenticrewind.com",
    logo: {
      src: "/logos/the-agentic-rewind.png",
      width: 3616,
      height: 1448,
    },
  },
  {
    id: "react-native",
    name: "The React Native Rewind",
    description: "The weekly React Native newsletter that doesn't suck.",
    href: "https://thereactnativerewind.com",
    logo: {
      src: "/logos/the-react-native-rewind.png",
      width: 1024,
      height: 558,
    },
  },
] as const;

export type NewsletterId = (typeof newsletters)[number]["id"];

export type Newsletter = (typeof newsletters)[number];

const newsletterIds = new Set<string>(newsletters.map((newsletter) => newsletter.id));

export function isNewsletterId(value: string): value is NewsletterId {
  return newsletterIds.has(value);
}

export function getNewsletter(id: NewsletterId): Newsletter {
  const newsletter = newsletters.find((item) => item.id === id);
  if (!newsletter) {
    throw new Error(`Unknown newsletter: ${id}`);
  }
  return newsletter;
}
