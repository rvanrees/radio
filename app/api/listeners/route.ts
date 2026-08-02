function asNumber(value: unknown): number | null {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.round(parsed)) : null;
}

function getListenerCount(data: unknown): number | null {
  if (!data || typeof data !== "object") return null;
  const record = data as Record<string, unknown>;

  // AzuraCast now-playing response.
  if (record.listeners && typeof record.listeners === "object") {
    const listeners = record.listeners as Record<string, unknown>;
    const count = asNumber(listeners.current ?? listeners.total);
    if (count !== null) return count;
  }

  // Icecast status-json.xsl response (single or multiple sources).
  const stats = record.icestats as Record<string, unknown> | undefined;
  const sources = stats?.source;
  if (Array.isArray(sources)) {
    return sources.reduce((total, source) => {
      const item = source as Record<string, unknown>;
      return total + (asNumber(item.listeners) ?? 0);
    }, 0);
  }
  if (sources && typeof sources === "object") {
    return asNumber((sources as Record<string, unknown>).listeners);
  }

  return asNumber(record.listeners ?? record.listener_count);
}

function getOnlineState(data: unknown, listeners: number | null): boolean {
  if (!data || typeof data !== "object") return false;
  const record = data as Record<string, unknown>;

  if (typeof record.is_online === "boolean") return record.is_online;

  const stats = record.icestats as Record<string, unknown> | undefined;
  if (stats) return Boolean(stats.source);

  return listeners !== null;
}

export async function GET() {
  const statsUrl = process.env.STREAM_STATS_URL;
  if (!statsUrl) return Response.json({ listeners: null, configured: false, online: false });

  try {
    const response = await fetch(statsUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) throw new Error(`Stats returned ${response.status}`);
    const data: unknown = await response.json();
    const listeners = getListenerCount(data);
    return Response.json({
      listeners,
      configured: true,
      online: getOnlineState(data, listeners),
    });
  } catch {
    return Response.json({ listeners: null, configured: true, online: false }, { status: 502 });
  }
}
