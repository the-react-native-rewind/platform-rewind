import { SiteFooter } from "@/components/site-footer";
import { NewsletterCards } from "@/components/newsletter-cards";
import { Sponsors } from "@/components/sponsors";
import { SubscribeForm } from "@/components/subscribe-form";
import { WhoWeAre } from "@/components/who-we-are";
import { MarkerUnderline } from "@/components/marker-underline";

export default function HomePage() {
  return (
    <>
      <main>
        <section className="hero" aria-labelledby="platform-rewind-title">
          <div className="hero-stack">
            <h1 id="platform-rewind-title" className="wordmark">
              <span className="wordmark-platform">Platform</span>
              <span className="wordmark-rewind">
                Rewind
                <MarkerUnderline />
              </span>
            </h1>
            <p className="lede">The publication behind the Rewind newsletters.</p>
            <SubscribeForm />
          </div>
        </section>
        <WhoWeAre />
        <NewsletterCards />
        <Sponsors />
      </main>
      <SiteFooter />
    </>
  );
}
