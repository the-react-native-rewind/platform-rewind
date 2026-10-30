import { newsletters } from "@/lib/newsletters";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <p className="footer-name">Platform Rewind</p>
        <nav aria-label="Newsletters">
          <ul className="footer-links">
            {newsletters.map((newsletter) => (
              <li key={newsletter.id}>
                <a href={newsletter.href} target="_blank" rel="noreferrer">
                  {newsletter.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="footer-copy">© 2026 Platform Rewind</p>
      </div>
    </footer>
  );
}
