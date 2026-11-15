/* Composer: builds answers for the agent.
 *
 * Design rule (anti-hallucination): for guidance answers the composer is
 * strictly EXTRACTIVE — every line shown to the user is copied verbatim from
 * an approved knowledge-base document and carries a citation. The only
 * authored strings are safety escalations, disclaimers, and meta answers,
 * all defined as constants so they can be audited in one place. */
window.EC = window.EC || {};
EC.Composer = (function () {
  "use strict";

  var S = EC.Safety;

  /**
   * Compose a guidance answer from ranked retrieval results.
   * @param {Array} results - retriever output (already relevance-gated)
   * @returns {object} answer {lead, steps, warnings, citations, docsUsed}
   */
  function composeGuidance(results) {
    var primary = results[0].chunk.doc;
    var citations = [];
    var citeIndex = {};   // docId -> citation number
    var steps = [];
    var warnings = [];

    function cite(doc) {
      if (!citeIndex[doc.id]) {
        citeIndex[doc.id] = citations.length + 1;
        citations.push({
          n: citeIndex[doc.id],
          docId: doc.id,
          title: doc.title,
          category: doc.category,
          review_date: doc.review_date,
          source_note: doc.source_note
        });
      }
      return citeIndex[doc.id];
    }

    // Lead sentence: the primary document's approved summary.
    var lead = { text: primary.summary, cite: cite(primary) };

    // Steps: best-matching sections, verbatim bullets. Primary document first,
    // then at most one section from one supporting document.
    var usedSections = 0;
    var supportUsed = false;
    var seenBullets = {};
    results.forEach(function (r) {
      if (usedSections >= 3) return;
      var isPrimary = r.chunk.doc.id === primary.id;
      if (!isPrimary) {
        if (usedSections >= 1 && !supportUsed) supportUsed = true;
        else if (usedSections >= 1) return;
      }
      usedSections++;
      steps.push({ heading: r.chunk.heading, cite: cite(r.chunk.doc) });
      r.chunk.bullets.forEach(function (b) {
        if (seenBullets[b]) return;
        seenBullets[b] = 1;
        steps.push({ text: b, cite: cite(r.chunk.doc) });
      });
    });

    // Warnings from the primary document, verbatim.
    (primary.warnings || []).forEach(function (w) {
      if (!seenBullets[w]) warnings.push({ text: w, cite: cite(primary) });
    });

    // Confidence: retrieval score saturation + query coverage.
    var top = results[0];
    var conf = Math.round(
      Math.min(96, 40 + 100 * (top.score / (top.score + 4)) * 0.55 + top.coverage * 25)
    );

    return {
      type: "guidance",
      lead: lead,
      steps: steps,
      warnings: warnings,
      citations: citations,
      confidence: Math.max(conf, 20)
    };
  }

  /** Honest refusal when no approved guidance clears the relevance gate.
   *  nearMatches: [{title, docId}] of closest corpus topics, for pointing the
   *  user at what the system CAN answer — understanding even when declining. */
  function composeRefusal(query, nearMatches) {
    var suggestions = [];
    if (nearMatches && nearMatches.length) {
      suggestions.push("Related approved guidance you can ask about:");
      nearMatches.forEach(function (m) {
        suggestions.push("\u2022 " + m.title);
      });
    }
    suggestions.push("Try naming the situation directly, e.g. \"burns first aid\" or \"what to do in a flood\".");
    suggestions.push("If this is a real emergency, call your local emergency number now (India: 112 / 100 / 101 / 108; 911; 999).");
    suggestions.push("I can only answer from my built-in emergency-guidance documents — I do not generate unverified advice.");
    return {
      type: "refusal",
      lead: {
        text: "I could not find approved guidance in my knowledge base that answers this.",
        cite: null
      },
      steps: [],
      warnings: [],
      citations: [],
      confidence: 0,
      suggestions: suggestions
    };
  }

  /** Crisis-support response for possible self-harm situations. */
  function composeCrisis() {
    return {
      type: "crisis",
      lead: {
        text: "What you described may be a mental-health emergency, and it matters that you reached out. You deserve immediate support from a person, not a bot.",
        cite: null
      },
      steps: [
        { heading: "Please do this now", cite: null },
        { text: "If you are thinking about ending your life or hurting yourself, call a crisis line right now: 14416 (Tele-MANAS) or 1800-599-0019 (KIRAN) in India; 988 in the US and Canada; 116 123 (Samaritans) in the UK and Ireland; 13 11 14 (Lifeline) in Australia.", cite: null },
        { text: "If you feel you may act on these thoughts immediately, call your local emergency number (112 in India, 911 in the US, 999 in the UK) or go to the nearest emergency department.", cite: null },
        { text: "Stay with someone you trust until you are speaking with a crisis counselor — do not be alone with these thoughts.", cite: null },
        { text: "Remove or ask someone to remove means of self-harm, including medications and weapons, if you can.", cite: null }
      ],
      warnings: [
        { text: "I am a demo system with a small first-aid corpus — I cannot provide counseling. A human crisis line can.", cite: null }
      ],
      citations: [],
      confidence: 100,
      pinnedNote: S.CRISIS_LINE_NOTE
    };
  }

  /** Static self-description — the only free-text answer, and it's audited here. */
  function composeMeta() {
    return {
      type: "meta",
      lead: {
        text: "I am a demonstration emergency-guidance assistant. I run entirely inside your browser: the knowledge base, the BM25 search, the agent loop, and the safety filters are all local JavaScript on this page.",
        cite: null
      },
      steps: [
        { heading: "How I answer", cite: null },
        { text: "1. Safety scan — every message is checked for crisis or active-emergency wording before anything else.", cite: null },
        { text: "2. Intent — I classify whether you need emergency escalation, guidance, or information about me.", cite: null },
        { text: "3. Retrieval — I search my approved documents with BM25 keyword scoring (the R in RAG).", cite: null },
        { text: "4. Relevance gate — if no document scores high enough, I say so instead of guessing.", cite: null },
        { text: "5. Extraction — my answers are assembled word-for-word from the approved documents, with numbered citations (the G in RAG, done extractively so nothing can be invented).", cite: null },
        { text: "6. Safety finalize — urgent situations get an escalation banner; every answer carries a disclaimer.", cite: null }
      ],
      warnings: [
        { text: "Nothing you type is sent anywhere: no network calls, no cookies, no storage. Clearing the chat erases everything.", cite: null }
      ],
      citations: [],
      confidence: 100
    };
  }

  /** Polite scope refusal for clearly out-of-domain requests. */
  function composeOffTopic() {
    return {
      type: "off_topic",
      lead: {
        text: "That topic is outside my scope. I only retrieve approved emergency guidance — first aid, hazard safety, and preparedness.",
        cite: null
      },
      steps: [],
      warnings: [],
      citations: [],
      confidence: 0,
      suggestions: [
        "Ask me things like \"CPR steps\", \"choking\", \"stroke signs\", \"flood safety\", or \"what goes in an emergency kit\"."
      ]
    };
  }

  /** Clarifying question when the query is too vague to retrieve. */
  function composeClarify() {
    return {
      type: "clarify",
      lead: {
        text: "I want to give you the right approved guidance — can you tell me a bit more about the situation?",
        cite: null
      },
      steps: [],
      warnings: [],
      citations: [],
      confidence: 0,
      suggestions: [
        "For example: \"someone is choking\", \"how do I do CPR\", \"signs of a stroke\", \"what to do when the power goes out\"."
      ]
    };
  }

  return {
    composeGuidance: composeGuidance,
    composeRefusal: composeRefusal,
    composeCrisis: composeCrisis,
    composeMeta: composeMeta,
    composeOffTopic: composeOffTopic,
    composeClarify: composeClarify
  };
})();
