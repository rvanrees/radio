import RadioPlayer from "./radio-player";
import OnAirStatus from "./on-air-status";

export default function Home() {
  const streamUrl = process.env.STREAM_URL ?? "";

  return (
    <main className="radio-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="hero" id="top">
        <div className="hero-meta">
          <p className="eyebrow">Rechtstreeks vanuit Vriezenveen</p>
          <OnAirStatus />
        </div>
        <h1>
          De mooiste
          <br />
          <em>piratenhits.</em>
        </h1>
        <RadioPlayer streamUrl={streamUrl} />
      </section>
    </main>
  );
}
