import Image from "next/image";
import { MarkerUnderline } from "@/components/marker-underline";
import { newsletters } from "@/lib/newsletters";

export function NewsletterCards() {
  return (
    <section className="section section-band" id="newsletters" aria-labelledby="newsletters-title">
      <div className="section-inner">
        <h2 id="newsletters-title" className="section-title">
          The newsletters
          <MarkerUnderline />
        </h2>
        <p className="section-description">Two today. The list grows when a new platform is worth a rewind.</p>
        <ul className="card-grid">
          {newsletters.map((newsletter) => (
            <li key={newsletter.id} className="newsletter-card">
              <Image
                src={newsletter.logo.src}
                alt=""
                width={newsletter.logo.width}
                height={newsletter.logo.height}
                className="newsletter-logo"
                style={{ width: "auto", height: "auto" }}
                unoptimized
                loading="eager"
              />
              <h3 className="card-title">{newsletter.name}</h3>
              <p className="card-description">{newsletter.description}</p>
              <a className="card-link" href={newsletter.href} target="_blank" rel="noreferrer">
                Visit the site
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
