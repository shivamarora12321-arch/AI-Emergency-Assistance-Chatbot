/* Retriever: BM25 lexical search over the approved guidance knowledge base.
 * Documents are indexed section-by-section; each section is a retrievable
 * chunk carrying its parent document's approval metadata. */
window.EC = window.EC || {};
EC.Retriever = (function () {
  "use strict";

  var STOPWORDS = {
    a: 1, an: 1, and: 1, are: 1, as: 1, at: 1, be: 1, but: 1, by: 1,
    can: 1, do: 1, does: 1, for: 1, from: 1, had: 1, has: 1, have: 1,
    how: 1, i: 1, if: 1, in: 1, is: 1, it: 1, its: 1, me: 1, my: 1,
    no: 1, not: 1, of: 1, on: 1, or: 1, should: 1, so: 1, some: 1,
    that: 1, the: 1, their: 1, them: 1, there: 1, they: 1, this: 1,
    to: 1, was: 1, we: 1, were: 1, what: 1, when: 1, where: 1, which: 1,
    who: 1, why: 1, will: 1, with: 1, would: 1, you: 1, your: 1, about: 1,
    get: 1, got: 1, any: 1, into: 1, over: 1, just: 1, than: 1, then: 1,
    "someone's": 1, someones: 1, our: 1, ours: 1, much: 1, very: 1, also: 1, after: 1,
    before: 1, during: 1, person: 1, help: 1, need: 1, "what's": 1,
    // task words — they ask FOR guidance but never identify a topic
    treat: 1, treated: 1, treating: 1, treatment: 1, handle: 1, manage: 1,
    deal: 1, doing: 1, doing: 1, done: 1, "do's": 1
  };

  function stem(w) {
    // Light suffix folding: plurals and -ed/-ies endings.
    if (w.length > 4 && /ies$/.test(w)) return w.slice(0, -3) + "y";
    if (w.length > 4 && /ed$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && /(es|s)$/.test(w) && !/(ss|us|is)$/.test(w) && !/^(gas|bus|yes|as|is)$/.test(w)) {
      return w.slice(0, -1);
    }
    return w;
  }

  function tokenize(text) {
    var raw = String(text).toLowerCase().replace(/[^a-z0-9\s'-]/g, " ").split(/\s+/);
    var out = [];
    raw.forEach(function (w) {
      w = w.replace(/^['-]+|['-]+$/g, "").replace(/'/g, "");
      if (!w || STOPWORDS[w]) return;
      var s = stem(w);
      if (s && !STOPWORDS[s]) out.push(s);
    });
    return out;
  }

  var K1 = 1.5, B = 0.75;

  /* Query-time synonym expansion. Keys are STEMS (post-suffix-stripping) so
   * "fainted", "fainted"→"faint" all hit one entry. Values are corpus stems.
   * Expansion only widens MATCHING — never what gets quoted — so answers stay
   * verbatim. Includes transliterated Hindi/Hinglish → English stems so
   * everyday Indian phrasings still find the right guidance. */
  var SYNONYMS = {
    faint: ["unconscious"],
    fits: ["seizure"], fit: ["seizure"], convulsion: ["seizure"],
    heimlich: ["abdominal", "thrust"],
    paralysis: ["stroke"], lakwa: ["stroke"], lakhwa: ["stroke"], "lakva": ["stroke"],
    dil: ["heart"], dora: ["attack"], dawla: ["attack"], daura: ["attack"],
    aag: ["fire"], lagi: ["fire"], jal: ["burn", "fire"],
    khoon: ["bleed", "bleeding"], lahoo: ["bleed", "bleeding"],
    saanp: ["snake"], sanp: ["snake"], saamp: ["snake"],
    kaata: ["bite", "bitten"], kata: ["bite", "bitten"], kaat: ["bite", "bitten"],
    doob: ["drown", "drowning"],
    bachcha: ["child", "infant"], bachhe: ["child"], shishu: ["infant"],
    bimari: ["illness"],
    crash: ["accident", "road"], wreck: ["accident", "road"],
    accident: ["road", "scene"],
    wire: ["electrical", "electrocut"], current: ["electrical", "electrocut"],
    hosh: ["unconscious"],  // "hosh nahi" → unconscious
    // v3 — animals, bones, collapse, breathing, sugar, crowd, weather
    kutta: ["dog"], kutte: ["dog"], kukkur: ["dog"],
    bite: ["rabies", "wound"],
    haddi: ["fracture", "bone"], toota: ["fracture", "break"], toot: ["fracture", "break"],
    behosh: ["unconscious", "faint"], cheakkar: ["faint"], chaakar: ["faint"], chakkar: ["faint"],
    gira: ["fall"], gire: ["fall"], gir: ["fall"],
    dama: ["asthma"], saans: ["breathing", "breath"],
    gabrahat: ["panic"], ghabrahat: ["panic"],
    naak: ["nose"], nose: ["nosebleed"],
    shakkar: ["sugar"], madhumeh: ["diabetes"],
    aankh: ["eye"], aankhon: ["eye"],
    bijli: ["lightning"], badal: ["storm"],
    toofan: ["cyclone"], samudra: ["tsunami", "sea"],
    bhagdad: ["stampede"], bheed: ["crowd"],
    chot: ["injury"],
    nahi: [], nahin: [], nhi: [], hai: [], gaya: [], gayi: [], gaye: [], raha: [], rahi: [],
    ne: [], ka: [], ki: [], ke: [], ko: [], se: [], par: [], pe: [], mein: [], me: [],
    meri: [], mera: [], mere: [], kya: [], kaise: [], karein: [], karo: [], karna: [], liye: []
  };

  function expandTokens(tokens) {
    var out = tokens.slice();
    var added = [];
    tokens.forEach(function (t) {
      var syn = SYNONYMS[t];
      if (!syn) return;
      syn.forEach(function (s) {
        if (out.indexOf(s) === -1) { out.push(s); added.push(t + "→" + s); }
      });
    });
    return { tokens: out, added: added };
  }

  var chunks = [];    // [{doc, sectionIndex, heading, text, tokens, tf, len}]
  var avgLen = 0;
  var docCount = 0;
  var df = {};        // term -> number of chunks containing it

  function chunkText(section, doc) {
    return [doc.title, doc.summary, section.heading].concat(section.bullets, doc.warnings || []).join(" . ");
  }

  function build(docs) {
    chunks = [];
    df = {};
    docs.forEach(function (doc) {
      doc.sections.forEach(function (section, si) {
        var text = chunkText(section, doc);
        var tokens = tokenize(text);
        var tf = {};
        tokens.forEach(function (t) { tf[t] = (tf[t] || 0) + 1; });
        Object.keys(tf).forEach(function (t) { df[t] = (df[t] || 0) + 1; });
        chunks.push({
          doc: doc,
          sectionIndex: si,
          heading: section.heading,
          bullets: section.bullets,
          text: text,
          tokens: tokens,
          tf: tf,
          len: tokens.length
        });
      });
    });
    docCount = chunks.length;
    avgLen = chunks.reduce(function (s, c) { return s + c.len; }, 0) / (docCount || 1);
    computeDocTopics();
  }

  /* Topic filter data: the distinctive TITLE stems of each document (words
   * that appear in few documents' title+summary), topped up from the summary.
   * A chunk may only answer a query whose tokens actually name the doc's
   * topic — incidental rare-word matches ("dead", "water") can no longer
   * route off-topic queries into random guidance. */
  function computeDocTopics() {
    var docsSeen = {};
    chunks.forEach(function (c) { docsSeen[c.doc.id] = c.doc; });
    var allDocsArr = Object.keys(docsSeen).map(function (k) { return docsSeen[k]; });

    // document-level frequency of each stem across title+summary blocks
    var dfDocs = {};
    allDocsArr.forEach(function (d) {
      var seen = {};
      tokenize(d.title + " . " + d.summary).forEach(function (t) { seen[t] = 1; });
      Object.keys(seen).forEach(function (t) { dfDocs[t] = (dfDocs[t] || 0) + 1; });
    });

    allDocsArr.forEach(function (d) {
      if (d.topicStems) return;
      var titleStems = [], summaryStems = [], seenT = {}, seenS = {};
      tokenize(d.title).forEach(function (t) { if (!seenT[t]) { seenT[t] = 1; titleStems.push(t); } });
      tokenize(d.summary).forEach(function (t) { if (!seenS[t] && !seenT[t]) { seenS[t] = 1; summaryStems.push(t); } });
      var distinct = function (t) { return (dfDocs[t] || 0) <= 4; };
      var topics = titleStems.filter(distinct);
      for (var i = 0; topics.length < 6 && i < summaryStems.length; i++) {
        if (distinct(summaryStems[i]) && topics.indexOf(summaryStems[i]) === -1) topics.push(summaryStems[i]);
      }
      d.topicStems = topics.length ? topics : titleStems.slice(0, 3);
    });
  }

  function topicHit(doc, qTokens) {
    if (!doc.topicStems || !doc.topicStems.length) return true;   // never blocks
    return doc.topicStems.some(function (t) { return qTokens.indexOf(t) > -1; });
  }

  function idf(term) {
    var n = df[term] || 0;
    return Math.log(1 + (docCount - n + 0.5) / (n + 0.5));
  }

  function bm25Score(queryTokens, chunk) {
    var score = 0;
    var matched = 0;
    queryTokens.forEach(function (t) {
      var f = chunk.tf[t] || 0;
      if (f > 0) matched++;
      if (f === 0) return;
      score += idf(t) * (f * (K1 + 1)) / (f + K1 * (1 - B + B * chunk.len / avgLen));
    });
    return { score: score, matched: matched };
  }

  /**
   * Search the knowledge base.
   * @returns {Array} ranked [{chunk, score, matched, coverage}] best first
   */
  function search(query, topK, opts) {
    topK = topK || 5;
    opts = opts || {};
    var base = tokenize(query);
    if (!base.length) return [];
    var exp = expandTokens(base);
    var qTokens = exp.tokens;
    var scored = chunks.map(function (c) {
      var r = bm25Score(qTokens, c);
      // Coverage counts only the user's own tokens, not expansion additions.
      var baseMatched = 0;
      base.forEach(function (t) { if (c.tf[t]) baseMatched++; });
      return {
        chunk: c, score: r.score, matched: r.matched,
        coverage: baseMatched / base.length,
        topicHit: topicHit(c.doc, qTokens)
      };
    });
    // Topic filter: keep only chunks whose doc the query names. For genuine
    // emergencies (allowFallback) an unfiltered ranking may still be searched
    // when nothing topic-hits — the universal checklist covers the rest.
    var onTopic = scored.filter(function (s) { return s.topicHit && s.score > 0; });
    if (onTopic.length) scored = onTopic;
    else if (!opts.allowFallback) scored = [];
    scored.sort(function (a, b) { return b.score - a.score; });
    // Phrase bonus: reward chunks containing query bigrams verbatim.
    var lower = " " + query.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ") + " ";
    scored.forEach(function (s) {
      base.forEach(function (t, i) {
        if (i > 0) {
          var rawPrev = base[i - 1];
          var bigram = " " + rawPrev + " " + t + " ";
          if (lower.indexOf(bigram) > -1 && (" " + s.chunk.text.toLowerCase() + " ").indexOf(bigram) > -1) {
            s.score += 1.5;
          }
        }
      });
    });
    scored.sort(function (a, b) { return b.score - a.score; });
    var arr = scored.slice(0, topK);
    arr.expanded = exp.added;   // e.g. ["aag→fire"] — surfaced in the trace
    return arr;
  }

  function allDocs() {
    var seen = {};
    var docs = [];
    chunks.forEach(function (c) {
      if (!seen[c.doc.id]) { seen[c.doc.id] = 1; docs.push(c.doc); }
    });
    return docs;
  }

  return {
    build: build,
    search: search,
    tokenize: tokenize,
    allDocs: allDocs,
    chunkCount: function () { return docCount; },
    chunkOf: function (docId, sectionIndex) {
      for (var i = 0; i < chunks.length; i++) {
        var c = chunks[i];
        if (c.doc.id === docId && c.sectionIndex === (sectionIndex || 0)) return c;
      }
      return null;
    }
  };
})();
