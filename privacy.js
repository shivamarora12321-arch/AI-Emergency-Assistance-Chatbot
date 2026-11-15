/* Privacy controls for the client-side assistant.
 *
 * Policy implemented here, and verifiable in DevTools (Network tab shows zero
 * outbound requests; Application tab shows zero cookies/storage):
 *   - The transcript lives only in JavaScript memory for the current tab.
 *   - Nothing is persisted unless the user explicitly exports a chat, which
 *     produces a local file download that never touches a server.
 *   - For any diagnostic display, personally identifiable patterns are
 *     redacted by redact() before text is echoed into reasoning traces. */
window.EC = window.EC || {};
EC.Privacy = (function () {
  "use strict";

  var PII_RULES = [
    { label: "phone", re: /(\+?\d[\d\s().-]{7,}\d)/g },
    { label: "email", re: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi },
    { label: "address-ish", re: /\b\d{1,4}\s+[A-Z][a-z]+\s+(Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Blvd)\b/g }
  ];

  /** Mask obvious PII so traces never echo contact details back. */
  function redact(text) {
    var out = String(text);
    PII_RULES.forEach(function (r) {
      out = out.replace(r.re, function (m) { return "[" + r.label + " redacted]"; });
    });
    return out;
  }

  /** Count of redactions applied — surfaced in the trace to show it ran. */
  function redactionCount(original) {
    var n = 0;
    PII_RULES.forEach(function (r) {
      var m = String(original).match(r.re);
      if (m) n += m.length;
    });
    return n;
  }

  // In-memory transcript. No localStorage, no sessionStorage, no cookies.
  var transcript = [];

  function record(entry) {
    transcript.push({ t: Date.now(), role: entry.role, text: entry.text });
  }

  function clear() {
    transcript = [];
  }

  function getTranscript() {
    return transcript.slice();
  }

  /** Build a downloadable transcript (user-initiated, local only). */
  function exportText() {
    var lines = transcript.map(function (e) {
      var ts = new Date(e.t).toISOString();
      return "[" + ts + "] " + (e.role === "user" ? "You" : "Assistant") + ": " + e.text;
    });
    var header =
      "Emergency Guidance Assistant - local transcript export\n" +
      "Generated " + new Date().toISOString() + "\n" +
      "This file was created entirely on your device; no network was involved.\n" +
      "---------------------------------------------------------------\n\n";
    return header + lines.join("\n") + "\n";
  }

  return {
    redact: redact,
    redactionCount: redactionCount,
    record: record,
    clear: clear,
    getTranscript: getTranscript,
    exportText: exportText
  };
})();
