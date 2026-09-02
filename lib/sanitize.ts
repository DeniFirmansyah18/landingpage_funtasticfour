/**
 * Security & Sanitization Utilities
 * Prevents Cross-Site Scripting (XSS), SQL/NoSQL Injection, and HTML Injection
 */

/**
 * Escapes potentially dangerous HTML characters.
 */
export function escapeHtml(str: string): string {
  if (!str || typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Sanitizes generic user text input by trimming, stripping script/html tags, and removing control chars.
 */
export function sanitizeText(input: unknown): string {
  if (typeof input !== "string") return "";
  // Strip control characters & strip <script> / HTML tags
  const clean = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
    .trim();
  return clean;
}

/**
 * Validates and sanitizes email address format.
 */
export function sanitizeEmail(email: string): string {
  const clean = sanitizeText(email).toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(clean) ? clean : "";
}

/**
 * Validates and sanitizes Indonesian / international phone numbers.
 */
export function sanitizePhone(phone: string): string {
  const clean = sanitizeText(phone).replace(/[^\d+]/g, "");
  return clean.length >= 8 && clean.length <= 16 ? clean : "";
}
