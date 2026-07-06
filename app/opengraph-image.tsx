import { ImageResponse } from "next/og";
import { getState } from "@/lib/streak";
import { loadDisplayFont } from "@/lib/og-font";

export const runtime = "edge";
export const alt = "Sarah & Jalyn's daily streak";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const GRADIENT =
  "linear-gradient(128deg, #ff8a3d -10%, #e63d6f 32%, #2a2044 62%, #08090c 85%)";

export default async function Image() {
  const [state, font] = await Promise.all([
    getState().catch(() => null),
    loadDisplayFont(),
  ]);

  const streak = state?.streak ?? 186;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#08090c",
          backgroundImage: GRADIENT,
          color: "#f3efe9",
          fontFamily: font ? "Arimo" : undefined,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 14,
            textTransform: "uppercase",
            opacity: 0.65,
          }}
        >
          Sarah & Jalyn
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 320,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: -12,
            marginTop: 8,
          }}
        >
          {streak}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 14,
            textTransform: "uppercase",
            opacity: 0.65,
            marginTop: 8,
          }}
        >
          Day Streak
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Arimo", data: font, weight: 700, style: "normal" }]
        : undefined,
    }
  );
}
