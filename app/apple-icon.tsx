import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#092f2c",
      color: "#cceadd",
      fontFamily: "monospace",
      fontSize: 58,
      fontWeight: 800,
      letterSpacing: "-7px",
      paddingRight: "7px",
    }}>
      F/L
    </div>,
    size,
  );
}
