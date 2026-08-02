# Radio

Een moderne webplayer voor een internetradiostream, met automatische on-airstatus
en een live luisteraarsteller.

## Configuratie

Kopieer `.env.example` naar `.env.local` en vul de twee URL's in:

```bash
STREAM_URL=https://jouw-server.nl/live.mp3
STREAM_STATS_URL=https://jouw-server.nl/status-json.xsl
```

`STREAM_STATS_URL` ondersteunt het JSON-formaat van Icecast (`status-json.xsl`)
en AzuraCast (`/api/nowplaying/{station_short_code}`). De statistiek-URL blijft
op de server en wordt niet naar de browser gestuurd.

## Ontwikkelen

```bash
npm run dev
```

Open daarna [http://localhost:3000](http://localhost:3000).

## Controle

```bash
npm run lint
npm run build
```
