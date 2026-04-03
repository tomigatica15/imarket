import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "iMarket - Tu tienda de tecnología y celulares";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(135deg, #007AFF 0%, #0055CC 100%)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Apple logo + iMarket */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "32px",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 814 1000"
          width="64"
          height="64"
          fill="white"
        >
          <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-43.6-150.3-109.2c-52.9-77.7-96.7-198.8-96.7-314.5 0-208.8 136.3-319.1 270.8-319.1 67.2 0 123.1 44.3 164.7 44.3 39.5 0 101.1-47 176.3-47 28.5 0 130.9 2.6 198.3 99.2zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z" />
        </svg>
        <span
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-2px",
          }}
        >
          iMarket
        </span>
      </div>

      <p
        style={{
          fontSize: 28,
          color: "rgba(255,255,255,0.9)",
          maxWidth: 600,
          textAlign: "center",
          lineHeight: 1.4,
        }}
      >
        Tu tienda de tecnología y celulares
      </p>

      {/* Bottom bar */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          display: "flex",
          gap: "32px",
          color: "rgba(255,255,255,0.7)",
          fontSize: 18,
        }}
      >
        <span>iPhone</span>
        <span>·</span>
        <span>Mac</span>
        <span>·</span>
        <span>AirPods</span>
        <span>·</span>
        <span>iPad</span>
        <span>·</span>
        <span>Apple Watch</span>
      </div>
    </div>,
    { ...size },
  );
}
