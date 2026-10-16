"use client";

// Last resort when the root layout itself fails: no app styles, fonts or
// translations are available here, so it's plain, bilingual and self-styled.
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="bn">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          fontFamily: "system-ui, 'Noto Sans Bengali', sans-serif",
          background: "#f4f5f8",
          color: "#16181d",
          textAlign: "center",
          padding: "24px",
        }}
      >
        <title>হিসাব</title>
        <main>
          <h1 style={{ fontSize: 22, margin: "0 0 8px" }}>কিছু একটা ঠিকমতো লোড হয়নি</h1>
          <p style={{ margin: "0 0 4px", color: "#4b5563" }}>Something didn&apos;t load properly.</p>
          <p style={{ margin: "0 0 20px", color: "#4b5563" }}>একটু পরে আবার চেষ্টা করুন · Please try again in a moment.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ background: "#2d7ad8", color: "#fff", border: 0, borderRadius: 12, padding: "12px 20px", fontSize: 15, cursor: "pointer" }}
          >
            আবার চেষ্টা করুন · Try again
          </button>
          {error.digest && <p style={{ marginTop: 20, fontSize: 12, color: "#6b7280" }}>{error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
