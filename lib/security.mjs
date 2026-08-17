/**
 * @param {{ development?: boolean, blockIndexing?: boolean }} options
 */
export function createSecurityHeaders({ development = false, blockIndexing = false } = {}) {
  const scriptSources = ["'self'", "'unsafe-inline'", ...(development ? ["'unsafe-eval'"] : [])];
  const connectSources = ["'self'", ...(development ? ["ws:", "wss:"] : [])];
  const contentSecurityPolicy = [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${scriptSources.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${connectSources.join(" ")}`,
    "worker-src 'self' blob:",
    "manifest-src 'self'",
  ].join("; ");

  return [
    { key: "Content-Security-Policy", value: contentSecurityPolicy },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
    { key: "X-Frame-Options", value: "DENY" },
    { key: "Strict-Transport-Security", value: "max-age=31536000" },
    ...(blockIndexing ? [{ key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" }] : []),
  ];
}
