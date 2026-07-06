import { ImageResponse } from "next/og";
import { loadDisplayFont } from "@/lib/og-font";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const GRADIENT =
  "linear-gradient(135deg, #ff8a3d -10%, #e63d6f 45%, #2a2044 100%)";

export default async function AppleIcon() {
  const font = await loadDisplayFont();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: GRADIENT,
          color: "#f3efe9",
          fontFamily: font ? "Arimo" : undefined,
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        SJ
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
