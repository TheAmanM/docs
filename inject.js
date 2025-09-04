(function () {
  // This script attempts to set the Content Security Policy (CSP) for the site
  // by injecting a <meta> tag into the document's <head>.

  // --- IMPORTANT ---
  // This method will ONLY work if Mintlify is NOT already sending a CSP via an HTTP header.
  // If a CSP header is sent by the server, the browser will enforce the STRICTER of the two policies
  // (the header and this meta tag), which means this fix may be ignored.
  // This is a last-resort attempt given the platform constraints.

  // 1. Define the desired Content Security Policy
  // We are building a complete policy string. We must redefine all directives,
  // not just the 'form-action' one. This is a reasonably permissive policy
  // to avoid breaking other site features.
  const cspPolicy = [
    "default-src 'self'", // Default to only allowing content from the site's own origin.
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:", // Allow scripts from self, inline, eval, and any HTTPS source. 'unsafe-eval' is often needed for modern JS frameworks.
    "style-src 'self' 'unsafe-inline' https:", // Allow styles from self, inline, and any HTTPS source.
    "img-src 'self' data: https:", // Allow images from self, data URIs, and any HTTPS source.
    "font-src 'self' https:", // Allow fonts from self and any HTTPS source.
    "connect-src 'self' https:", // Allows AJAX/fetch requests to any HTTPS source.
    // === THE FIX IS HERE ===
    // This directive explicitly allows form submissions to your own site ('self'),
    // codesandbox.io, and now formspree.io.
    "form-action 'self' https://codesandbox.io https://formspree.io",
    "frame-ancestors 'none'", // Blocks the site from being used in an iframe to prevent clickjacking.
    "upgrade-insecure-requests", // Tells browsers to prefer HTTPS.
  ].join("; "); // The directives are joined into a single string with semicolons.

  // 2. Create the <meta> tag element
  const metaTag = document.createElement("meta");
  metaTag.setAttribute("http-equiv", "Content-Security-Policy");
  metaTag.setAttribute("content", cspPolicy);

  // 3. Add the <meta> tag to the document's <head>
  // This needs to happen as early as possible, so we append it to the head.
  if (document.head) {
    document.head.appendChild(metaTag);
  } else {
    // Fallback for cases where the script might run before <head> exists (less likely).
    const head = document.createElement("head");
    head.appendChild(metaTag);
    document.documentElement.insertBefore(head, document.body);
  }

  console.log("CSP meta tag injected successfully.");
})();
