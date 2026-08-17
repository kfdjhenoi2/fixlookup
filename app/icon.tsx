import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#092f2c",
      color: "#cceadd",
      border: "28px solid #9fd6c4",
      borderRadius: "112px",
      fontFamily: "monospace",
      fontSize: 150,
      fontWeight: 800,
      letterSpacing: "-16px",
      paddingRight: "16px",
    }}>
      F/L
    </div>,
    size,
  );
}
