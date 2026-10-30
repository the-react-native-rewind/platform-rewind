import Image from "next/image";
import { MarkerUnderline } from "@/components/marker-underline";
import { sponsorMailto, sponsorTiers } from "@/lib/sponsors";

export function Sponsors() {
  return (
    <section className="section" id="sponsors" aria-labelledby="sponsors-title">
      <div className="section-inner">
        <h2 id="sponsors-title" className="section-title">
          Our sponsors
          <MarkerUnderline />
        </h2>
        <p className="section-description">Sponsorship for every Rewind newsletter lives here.</p>
        <div className="tier-list">
          {sponsorTiers.map((tier) => {
            const empties = Math.max(tier.slots - tier.logos.length, 0);
            return (
              <div key={tier.id} className="tier">
                <h3 className="tier-name">{tier.name}</h3>
                <ul className="logo-row">
                  {tier.logos.map((logo) => (
                    <li key={logo.src} className="logo-slot logo-slot-filled">
                      {logo.href ? (
                        <a href={logo.href} target="_blank" rel="noreferrer">
                          <Image src={logo.src} alt={logo.alt} width={280} height={120} className="sponsor-logo" />
                        </a>
                      ) : (
                        <Image src={logo.src} alt={logo.alt} width={280} height={120} className="sponsor-logo" />
                      )}
                    </li>
                  ))}
                  {Array.from({ length: empties }, (_, index) => (
                    <li key={`${tier.id}-open-${index}`} className="logo-slot" aria-label="Open sponsor logo slot">
                      <span>Logo</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        <div className="sponsor-cta">
          <p className="body-copy">
            Lead and supporting placements are open. Tell us about the product and we will find where
            the logo sits.
          </p>
          <a className="subscribe-button cta-matrix cta-glitch press-sticker sponsor-button" href={sponsorMailto}>
            <span>Sponsor us</span>
          </a>
        </div>
      </div>
    </section>
  );
}
