// Google Fonts serves a legacy .ttf file when the request looks like it came
// from a browser that predates woff2 support — that's the only way to get a
// raw font file (rather than woff2) out of the CSS API for satori to embed.
const LEGACY_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.90 Safari/537.36";

let cached: ArrayBuffer | null = null;

// Arimo is metric-compatible with Arial/Helvetica and openly licensed, so it
// stands in for Helvetica in generated images (satori can't use system fonts).
export async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  if (cached) return cached;
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Arimo:wght@700&display=swap",
      { headers: { "User-Agent": LEGACY_USER_AGENT } }
    ).then((res) => res.text());

    const match = css.match(/src: url\(([^)]+)\)/);
    if (!match) return null;

    const fontRes = await fetch(match[1]);
    cached = await fontRes.arrayBuffer();
    return cached;
  } catch {
    return null;
  }
}
