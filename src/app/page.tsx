import React from "react";
import { NavigationBar } from "@/components/NavigationBar/NavigationBar";
import { Footer } from "@/components/Footer/Footer";
import { Page, PageFrame } from "@/components/Page/Page";
import { Hero } from "@/components/sections/Hero";
import { Newsletters } from "@/components/sections/Newsletters";
import { Sponsors } from "@/components/sections/Sponsors";
import { SubscribeBand } from "@/components/sections/SubscribeBand";

export default function HomePage() {
  return (
    <PageFrame typeScale="base">
      <NavigationBar />
      <Page.Wide className="flex flex-col gap-20 pb-8 pt-2">
        <Hero />
        <Newsletters />
        <Sponsors />
      </Page.Wide>
      <SubscribeBand source="homepage-band" />
      <Footer />
    </PageFrame>
  );
}
