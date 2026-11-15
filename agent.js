/* Agent: the reasoning loop.
 *
 * A transparent, deterministic agent pipeline. Each stage appends a trace
 * entry so the UI can show exactly what the agent did and why:
 *
 *   input.safety_scan  → urgency, crisis flags (runs FIRST, always)
 *   intent.classify    → EMERGENCY_ACTIVE | CRISIS_SUPPORT | META | OFF_TOPIC | GUIDANCE | UNCLEAR
 *   plan               → which tools to call, and why
 *   search_kb          → BM25 retrieval with query terms and scores
 *   relevance_gate     → threshold check; refuse below it
 *   compose            → extractive answer with citations
 *   safety.finalize    → escalation banner, crisis pinning, disclaimer
 */
window.EC = window.EC || {};
EC.Agent = (function () {
  "use strict";

  var S = EC.Safety, R = EC.Retriever, C = EC.Composer, P = EC.Privacy;

  var RELEVANCE_THRESHOLD = 2.4;   // BM25 score; calibrated in tests
  var MIN_QUERY_TOKENS = 1;

  var basicsCache = null;
  function basicsChunk() {
    if (!basicsCache) basicsCache = R.chunkOf("any-emergency-basics", 0);
    return basicsCache;
  }

  var META_TRIGGERS = [
    /\bhow (do|does) (you|it|this) work\b/i,
    /\bwho are you\b/i, /\bwhat are you\b/i,
    /\bwhat can you do\b/i,
    /\bare you (private|safe|secure)\b/i,
    /\b(do|does) you (store|save|send|collect|track)/i,
    /\b(rag|retrieval|bm25|agent|knowledge base)\b/i,
    /\byour (privacy|data|sources|sources)\b/i
  ];

  function classifyIntent(text, safety) {
    if (safety.selfCrisis) return "CRISIS_SUPPORT";
    var metaHit = META_TRIGGERS.some(function (re) { return re.test(text); });
    if (metaHit && !safety.emergencyHits.length) return "META";
    if (S.looksOffTopic(text)) return "OFF_TOPIC";
    if (safety.emergencyActive) return "EMERGENCY_ACTIVE";
    return "GUIDANCE";
  }

  function planFor(intent, safety) {
    switch (intent) {
      case "CRISIS_SUPPORT":
        return { tools: ["respond_crisis"], why: "Self-harm indicators detected — support content outranks retrieval." };
      case "META":
        return { tools: ["respond_meta"], why: "Question is about this system itself." };
      case "OFF_TOPIC":
        return { tools: ["respond_off_topic"], why: "Request is outside the emergency-guidance scope." };
      case "EMERGENCY_ACTIVE":
        return { tools: ["search_kb", "compose_escalated"], why: "Active emergency detected — retrieve critical steps AND escalate to real emergency services." };
      default:
        return { tools: ["search_kb"], why: "Guidance question — retrieve from approved knowledge base." };
    }
  }

  /**
   * Main entry point. Returns a full response object for the UI.
   */
  function respond(userText) {
    var trace = [];
    var t0 = (window.performance && performance.now) ? performance.now() : Date.now();
    function mark(step, label, detail, meta) {
      var entry = { step: step, label: label, detail: detail };
      if (meta) entry.meta = meta;
      trace.push(entry);
    }

    // 1 ── Safety scan always runs first.
    var safety = S.scan(userText);
    var redactions = P.redactionCount(userText);
    mark("input.safety_scan", "Safety scan",
      "urgency=" + safety.urgency +
      (safety.selfCrisis ? ", self-crisis indicators=" + JSON.stringify(safety.crisisHits) : "") +
      (safety.emergencyActive ? ", active-emergency terms=" + JSON.stringify(safety.emergencyHits.slice(0, 3)) : "") +
      (redactions ? ", PII redacted for trace: " + redactions + " item(s)" : ""),
      { urgency: safety.urgency, selfCrisis: safety.selfCrisis, emergencyActive: safety.emergencyActive });

    // 2 ── Intent.
    var intent = classifyIntent(userText, safety);
    mark("intent.classify", "Classify intent", "intent=" + intent, { intent: intent });

    // 3 ── Plan.
    var plan = planFor(intent, safety);
    mark("plan", "Plan", "tools: [" + plan.tools.join(", ") + "] — " + plan.why, { tools: plan.tools });

    // 4 ── Execute tools.
    var answer = null;
    var retrieval = null;

    if (intent === "CRISIS_SUPPORT") {
      answer = C.composeCrisis();
      mark("respond_crisis", "Compose crisis support", "Pinned crisis-line response; retrieval skipped by design.", {});
    } else if (intent === "META") {
      answer = C.composeMeta();
      mark("respond_meta", "Compose self-description", "Static audited description of this pipeline.", {});
    } else if (intent === "OFF_TOPIC") {
      answer = C.composeOffTopic();
      mark("respond_off_topic", "Decline out-of-scope request", "Scope limited to emergency guidance.", {});
    } else {
      // GUIDANCE and EMERGENCY_ACTIVE both retrieve. Active emergencies may
      // search the unfiltered ranking when nothing topic-hits — the universal
      // checklist then covers whatever the corpus does not.
      var qTokens = R.tokenize(userText);
      retrieval = R.search(userText, 5, { allowFallback: intent === "EMERGENCY_ACTIVE" });
      var expansion = retrieval.expanded || [];
      var topScore = retrieval.length ? retrieval[0].score : 0;
      mark("search_kb", "Search knowledge base",
        "query terms: [" + qTokens.slice(0, 8).join(", ") + "]" +
        (expansion.length ? " · synonym expansion: [" + expansion.slice(0, 4).join(", ") + "]" : "") +
        " → " +
        (retrieval.length
          ? "top: \"" + retrieval[0].chunk.doc.title + " › " + retrieval[0].chunk.heading +
            "\" (score " + retrieval[0].score.toFixed(2) + ", coverage " + Math.round(retrieval[0].coverage * 100) + "%)"
          : "no chunks matched"),
        { topScore: topScore, results: retrieval.length, expansion: expansion });

      // Active emergencies always carry the universal first-steps checklist
      // as a supporting source — inserted after the primary document's own
      // sections so specific guidance keeps priority.
      if (intent === "EMERGENCY_ACTIVE") {
        var b = basicsChunk();
        if (b && !retrieval.some(function (r) { return r.chunk.doc.id === "any-emergency-basics"; })) {
          var insertAt = retrieval.length;
          for (var ri = 0; ri < retrieval.length; ri++) {
            if (retrieval[ri].chunk.doc.id !== retrieval[0].chunk.doc.id) { insertAt = ri; break; }
          }
          retrieval = retrieval.slice();
          retrieval.splice(insertAt, 0, { chunk: b, score: 0.01, matched: 0, coverage: 0 });
        }
      }

      // 5 ── Relevance gate.
      var pass = topScore >= RELEVANCE_THRESHOLD && retrieval.length > 0;
      mark("relevance_gate", "Relevance gate",
        (pass ? "PASS" : "FAIL") + " — top score " + topScore.toFixed(2) +
        (pass ? " ≥" : " <") + " threshold " + RELEVANCE_THRESHOLD,
        { pass: pass, threshold: RELEVANCE_THRESHOLD });

      if (!pass && intent === "EMERGENCY_ACTIVE") {
        // Unknown emergency TYPE: never refuse — quote the universal
        // any-emergency checklist instead, still fully grounded.
        var basics = basicsChunk();
        if (basics) {
          retrieval = [{ chunk: basics, score: topScore, matched: 0, coverage: 0 }];
          answer = C.composeGuidance(retrieval);
          answer.confidence = Math.max(20, answer.confidence - 30);
          mark("compose", "Compose answer",
            "Emergency with no specific guidance found — quoting universal first-steps document; every line still verbatim.",
            { fallback: "any-emergency-basics" });
        }
      } else if (!pass) {
        // Too vague / unknown topic → clarify or refuse, never guess — but
        // point at the nearest approved topics so the user still gets somewhere.
        var tooShort = qTokens.length <= MIN_QUERY_TOKENS && !safety.emergencyHits.length;
        var near = [];
        var seenDocs = {};
        (retrieval || []).forEach(function (r) {
          if (r.score > 0.5 && !seenDocs[r.chunk.doc.id]) {
            seenDocs[r.chunk.doc.id] = 1;
            near.push({ title: r.chunk.doc.title, docId: r.chunk.doc.id });
          }
        });
        near = near.slice(0, 3);
        answer = tooShort ? C.composeClarify() : C.composeRefusal(userText, near);
        mark("compose", "Compose answer",
          tooShort ? "Asked a clarifying question." :
          (near.length ? "No approved guidance — refusing, but offering " + near.length + " nearest approved topic(s)." :
            "No approved guidance — refusing rather than guessing."), {});
      } else {
        answer = C.composeGuidance(retrieval);
        mark("compose", "Compose answer",
          "Extractive composition from " + answer.citations.length + " approved document(s); every line is quoted verbatim with citations.",
          { citations: answer.citations.length, confidence: answer.confidence });
      }
    }

    // Defensive: never let a null answer reach finalize (e.g. missing basics doc).
    if (!answer) answer = C.composeRefusal();

    // 6 ── Safety finalize: escalation, crisis pinning, disclaimer.
    var escalation = false;
    if (safety.urgency === "CRITICAL" || intent === "EMERGENCY_ACTIVE") {
      escalation = true;
      answer.escalation = S.ESCALATION_LINE;
    }
    answer.disclaimer = S.DISCLAIMER;
    answer.urgency = safety.urgency;
    mark("safety.finalize", "Safety finalize",
      escalation ? "Escalation banner attached (call emergency services first)." : "Standard disclaimer attached.",
      { escalation: escalation });

    // 7 ── Privacy finalize.
    P.record({ role: "user", text: userText });
    P.record({ role: "assistant", text: answer.lead.text });
    mark("privacy.finalize", "Privacy finalize",
      "Transcript kept in memory only (this tab); no network, cookies, or storage. Use Clear to wipe instantly.",
      {});

    var t1 = (window.performance && performance.now) ? performance.now() : Date.now();
    return {
      answer: answer,
      intent: intent,
      trace: trace,
      latencyMs: Math.max(0, Math.round((t1 - t0) * 10) / 10),
      retrieval: retrieval
    };
  }

  return {
    respond: respond,
    RELEVANCE_THRESHOLD: RELEVANCE_THRESHOLD
  };
})();
