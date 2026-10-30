export type SponsorLogo = {
  src: string;
  alt: string;
  href?: string;
};

export type SponsorTier = {
  id: string;
  name: string;
  slots: number;
  logos: SponsorLogo[];
};

export const sponsorTiers: SponsorTier[] = [
  { id: "lead", name: "Lead", slots: 3, logos: [] },
  { id: "supporting", name: "Supporting", slots: 4, logos: [] },
];

export const sponsorMailto =
  "mailto:sponsors@platformrewind.com?subject=Sponsoring%20Platform%20Rewind";
