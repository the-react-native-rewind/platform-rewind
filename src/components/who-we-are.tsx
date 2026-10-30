import { MarkerUnderline } from "@/components/marker-underline";

export function WhoWeAre() {
  return (
    <section className="section" id="who-we-are" aria-labelledby="who-we-are-title">
      <div className="section-inner section-copy">
        <h2 id="who-we-are-title" className="section-title">
          Who we are
          <MarkerUnderline />
        </h2>
        <p className="section-description">
          Developers have always adapted. We keep watching where the wave is breaking.
        </p>
        <div className="body-copy">
          <p>
            A new runtime shows up, the work moves, and the people who ship learn the next tools.
            That part is not new.
          </p>
          <p>
            What is new is the speed. This moment asks for faster adapting than most of us have had
            to do. We would rather say that plainly than hype it, or panic about it.
          </p>
          <p>Platform Rewind is the publication. The newsletters are how it goes out.</p>
        </div>
      </div>
    </section>
  );
}
