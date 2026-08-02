"use client";

import { useEffect, useRef, useState } from "react";

type RadioPlayerProps = { streamUrl: string };

function formatListeners(value: number | null) {
  if (value === null) return "—";
  return new Intl.NumberFormat("nl-NL").format(value);
}

export default function RadioPlayer({ streamUrl }: RadioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [listeners, setListeners] = useState<number | null>(null);
  const [online, setOnline] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const update = async () => {
      try {
        const response = await fetch("/api/listeners", { cache: "no-store" });
        if (!response.ok) return;
        const data = (await response.json()) as {
          listeners: number | null;
          online?: boolean;
        };
        setListeners(data.listeners);
        setOnline(Boolean(data.online));
      } catch {
        // The stream remains usable when its stats endpoint is unavailable.
      }
    };

    void update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !streamUrl) return;
    setError(false);

    if (playing) {
      audio.pause();
      setPlaying(false);
      return;
    }

    setLoading(true);
    try {
      await audio.play();
      setPlaying(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const onVolumeChange = (value: number) => {
    setVolume(value);
    if (audioRef.current) audioRef.current.volume = value;
  };

  const buttonLabel = !streamUrl
    ? "Configureer de stream"
    : loading
      ? "Verbinden…"
      : playing
        ? "Pauzeer radio"
        : "Luister live";

  return (
    <div className="player-wrap">
      <audio
        ref={audioRef}
        src={streamUrl || undefined}
        preload="none"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setError(true);
          setLoading(false);
          setPlaying(false);
        }}
      />

      <div className="player-surface">
        <div className="player-card">
          <button
            className="play-button"
            type="button"
            onClick={togglePlayback}
            disabled={!streamUrl || loading}
            aria-label={buttonLabel}
          >
            {playing ? (
              <span className="pause-icon" />
            ) : (
              <span className="play-icon" />
            )}
          </button>

          <div className="track-info">
            <span className="micro-label">Nu live</span>
            <strong>
              {streamUrl ? "Radio livestream" : "Stream nog niet ingesteld"}
            </strong>
            <span>
              {error ? "Verbinding mislukt — probeer opnieuw" : buttonLabel}
            </span>
          </div>

          <div className="waveform" aria-hidden="true">
            {[14, 25, 39, 22, 32, 48, 27, 42, 19, 35, 46, 28, 18].map(
              (height, index) => (
                <i
                  key={index}
                  style={{ height }}
                  className={playing ? "moving" : ""}
                />
              ),
            )}
          </div>

          <label className="volume" aria-label="Volume">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4Zm12.5 3a4.5 4.5 0 0 0-2-3.74v7.48A4.5 4.5 0 0 0 16.5 12Z" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(event) => onVolumeChange(Number(event.target.value))}
            />
          </label>
        </div>

        <div className="message-cta">
          <span className="message-label">Reageren</span>
          <p>Voor een groet, verzoek of een reactie op het programma.</p>
          {online ? (
            <a className="message-button" href="sms:+31616545906">
              App de studio
            </a>
          ) : (
            <span
              className="message-button message-button-disabled"
              aria-disabled="true"
            >
              App de studio
            </span>
          )}
        </div>
      </div>

      <div
        className={`listener-row ${online ? "listeners-online" : "listeners-offline"}`}
        aria-live="polite"
      >
        <span className="listener-dot" />
        <strong>{formatListeners(listeners)}</strong>
        <span>{listeners === 1 ? "luisteraar" : "luisteraars"}</span>
      </div>
    </div>
  );
}
