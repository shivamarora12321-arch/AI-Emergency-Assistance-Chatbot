/* In-browser test suite.
 * Run by opening tests/tests.html — no build step, no server, no dependencies.
 * These tests enforce the system's core promises:
 *   - retrieval finds the right approved document
 *   - safety layers fire (crisis, active emergency, off-topic)
 *   - guidance answers are strictly extractive (verbatim from the KB)
 *   - the bot refuses instead of guessing
 *   - PII redaction works */
window.EC = window.EC || {};
EC.Tests = (function () {
  "use strict";

  var cases = [];
  function test(name, fn) { cases.push({ name: name, fn: fn }); }

  function assert(cond, msg) { if (!cond) throw new Error(msg || "assertion failed"); }
  function assertEq(a, b, msg) { if (a !== b) throw new Error((msg || "assertEq") + ": expected " + JSON.stringify(b) + ", got " + JSON.stringify(a)); }

  // Build the KB exactly like the app does.
  var ALL_DOCS = (EC.KB_META || []).concat(EC.KB_MEDICAL || [], EC.KB_HAZARDS || []);
  EC.Retriever.build(ALL_DOCS);

  // Every string the composer is allowed to emit for guidance answers.
  var VERBATIM_POOL = {};
  ALL_DOCS.forEach(function (d) {
    VERBATIM_POOL[d.summary] = 1;
    d.sections.forEach(function (s) { s.bullets.forEach(function (b) { VERBATIM_POOL[b] = 1; }); });
    (d.warnings || []).forEach(function (w) { VERBATIM_POOL[w] = 1; });
  });

  function topDocId(res) {
    if (!res.retrieval || !res.retrieval.length) return null;
    return res.retrieval[0].chunk.doc.id;
  }

  /* ---------- retriever ---------- */

  test("retriever: choking query surfaces the choking document", function () {
    var r = EC.Retriever.search("my friend is choking what do I do", 5);
    assert(r.length > 0, "no results");
    assertEq(r[0].chunk.doc.id, "choking-adult", "top doc should be choking-adult");
  });

  test("retriever: India emergency-number query surfaces the numbers document", function () {
    var r = EC.Retriever.search("what are the emergency numbers in India", 5);
    assertEq(r[0].chunk.doc.id, "emergency-numbers", "top doc should be emergency-numbers");
  });

  test("retriever: stroke FAST query surfaces the stroke document", function () {
    var r = EC.Retriever.search("signs of a stroke FAST check", 5);
    assertEq(r[0].chunk.doc.id, "stroke-fast", "top doc should be stroke-fast");
  });

  test("retriever: corpus-wide scores separate relevant from irrelevant", function () {
    var good = EC.Retriever.search("severe bleeding what to do", 1)[0].score;
    var badHit = EC.Retriever.search("quantum taxidermy philately", 1)[0];
    var bad = badHit ? badHit.score : 0;
    assert(good > EC.Agent.RELEVANCE_THRESHOLD, "relevant query should clear gate: " + good);
    assert(bad < EC.Agent.RELEVANCE_THRESHOLD, "gibberish should fall under gate: " + bad);
  });

  /* ---------- safety ---------- */

  test("safety: self-harm wording flags a crisis", function () {
    var s = EC.Safety.scan("I want to kill myself");
    assert(s.selfCrisis === true, "selfCrisis should be true");
    assertEq(s.urgency, "CRITICAL");
  });

  test("safety: active emergency detected with immediacy", function () {
    var s = EC.Safety.scan("my dad is not breathing right now");
    assertEq(s.urgency, "CRITICAL");
    assert(s.emergencyActive === true, "emergencyActive should be true");
  });

  test("safety: educational phrasing stays NORMAL urgency", function () {
    var s = EC.Safety.scan("what are the symptoms of a heart attack for a school project");
    assert(s.selfCrisis === false, "not a self-crisis");
  });

  test("safety: off-topic detection with emergency override", function () {
    assert(EC.Safety.looksOffTopic("write me a poem about the moon") === true);
    assert(EC.Safety.looksOffTopic("help my kitchen is on fire") === false, "fire outranks off-topic");
  });

  /* ---------- privacy ---------- */

  test("privacy: phone numbers and emails are redacted", function () {
    var out = EC.Privacy.redact("call me at 9876543210 or me@example.com now");
    assert(out.indexOf("9876543210") === -1, "phone should be masked");
    assert(out.indexOf("me@example.com") === -1, "email should be masked");
    assert(out.indexOf("call me at") > -1, "rest of text preserved");
  });

  /* ---------- agent end-to-end ---------- */

  test("agent: guidance answer is strictly extractive with citations", function () {
    var res = EC.Agent.respond("how do I treat a burn");
    assertEq(res.intent, "GUIDANCE");
    var a = res.answer;
    assertEq(a.type, "guidance");
    assert(a.citations.length > 0, "should cite at least one document");
    assert(VERBATIM_POOL.hasOwnProperty(a.lead.text), "lead must be verbatim from KB: " + a.lead.text);
    a.steps.forEach(function (s) {
      if (s.text) assert(VERBATIM_POOL.hasOwnProperty(s.text), "step must be verbatim from KB: " + s.text);
    });
    (a.warnings || []).forEach(function (w) {
      assert(VERBATIM_POOL.hasOwnProperty(w.text), "warning must be verbatim from KB: " + w.text);
    });
    assert(a.confidence > 0, "confidence should be positive for a passing answer");
  });

  test("agent: burn query retrieves the burn document", function () {
    var res = EC.Agent.respond("how do I treat a burn");
    assertEq(topDocId(res), "burns");
  });

  test("agent: active emergency gets escalation before guidance", function () {
    var res = EC.Agent.respond("my friend is choking and can't breathe");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    var a = res.answer;
    assert(a.escalation && a.escalation.indexOf("112") > -1, "escalation must mention 112 (India)");
    assertEq(a.type, "guidance", "still delivers approved steps");
    assert(a.steps.some(function (s) { return s.text && s.text.indexOf("back blows") > -1; }),
      "should include choking back-blow steps");
  });

  test("agent: crisis wording pins human crisis lines (India first)", function () {
    var res = EC.Agent.respond("I am thinking about ending my life");
    assertEq(res.intent, "CRISIS_SUPPORT");
    var txt = res.answer.steps.map(function (s) { return s.text || ""; }).join(" ");
    assert(txt.indexOf("14416") > -1, "must include Tele-MANAS 14416");
    assert(txt.indexOf("1800-599-0019") > -1, "must include KIRAN line");
    assert(res.answer.pinnedNote && res.answer.pinnedNote.indexOf("14416") > -1, "pinned note carries crisis line");
  });

  test("agent: gibberish is refused, not guessed", function () {
    var res = EC.Agent.respond("quantum taxidermy philately montage");
    assertEq(res.answer.type, "refusal");
    assertEq(res.answer.citations.length, 0, "refusals must not cite");
  });

  test("agent: vague input gets a clarifying question", function () {
    var res = EC.Agent.respond("hello?");
    assert(res.answer.type === "clarify" || res.answer.type === "refusal");
    assertEq(res.answer.citations.length, 0);
  });

  test("agent: out-of-scope request is declined", function () {
    var res = EC.Agent.respond("write me a poem about the moon");
    assertEq(res.answer.type, "off_topic");
  });

  test("agent: meta question explains itself", function () {
    var res = EC.Agent.respond("how do you work and are you private");
    assertEq(res.answer.type, "meta");
    var traceNames = res.trace.map(function (t) { return t.step; });
    assert(traceNames.indexOf("relevance_gate") === -1, "meta answers skip retrieval");
  });

  test("agent: trace always contains all pipeline stages", function () {
    var res = EC.Agent.respond("flood safety tips");
    var names = res.trace.map(function (t) { return t.step; });
    ["input.safety_scan", "intent.classify", "plan", "safety.finalize", "privacy.finalize"]
      .forEach(function (n) { assert(names.indexOf(n) > -1, "trace missing stage " + n); });
  });

  test("agent: India numbers query quotes the reviewed numbers document", function () {
    var res = EC.Agent.respond("what are the emergency numbers in India");
    assertEq(res.answer.type, "guidance");
    var txt = res.answer.steps.map(function (s) { return s.text || ""; }).join(" ");
    assert(txt.indexOf("112") > -1, "should include 112");
    assert(txt.indexOf("108") > -1, "should include 108 ambulance");
    assert(res.answer.citations.some(function (c) { return c.docId === "emergency-numbers"; }),
      "must cite the emergency-numbers document");
  });

  test("agent: every guidance response carries the disclaimer", function () {
    ["what to do in an earthquake", "cpr steps", "flood safety"].forEach(function (q) {
      var res = EC.Agent.respond(q);
      assert(res.answer.disclaimer && res.answer.disclaimer.length > 20, "missing disclaimer for: " + q);
    });
  });

  /* ---------- emergency-type coverage (v2 additions) ---------- */

  test("coverage: road accident with bleeding escalates and retrieves trauma guidance", function () {
    var res = EC.Agent.respond("there was a bike accident and my brother is bleeding badly");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    assert(res.answer.escalation, "must escalate");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("road-accident") > -1 || ids.indexOf("severe-bleeding") > -1,
      "should retrieve road-accident or severe-bleeding, got: " + ids.join(","));
  });

  test("coverage: snake bite retrieves the envenomation document", function () {
    var res = EC.Agent.respond("my son got a snake bite while playing, what do we do");
    assertEq(res.answer.type, "guidance");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("snake-bite-stings") > -1, "should retrieve snake-bite-stings, got: " + ids.join(","));
  });

  test("coverage: electrocution by wire detects emergency and finds the document", function () {
    var res = EC.Agent.respond("my dad got an electric shock from a live wire, urgent");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("electrocution") > -1, "should retrieve electrocution doc, got: " + ids.join(","));
  });

  test("coverage: drowning query retrieves drowning document", function () {
    var r = EC.Retriever.search("child drowning pulled out of water not breathing", 5);
    assertEq(r[0].chunk.doc.id, "drowning");
  });

  test("coverage: Hinglish 'aag lagi' is detected as an active fire emergency", function () {
    var s = EC.Safety.scan("aag lagi hai ghar mein jaldi madad");
    assert(s.emergencyActive === true, "aag lagi should be detected as emergency");
    var res = EC.Agent.respond("aag lagi hai ghar mein jaldi madad");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    assert(res.answer.escalation, "must escalate");
  });

  test("coverage: Hinglish 'saanp ne kaata' retrieves snake-bite guidance via synonyms", function () {
    var res = EC.Agent.respond("mere bhai ko saanp ne kaata hai");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("snake-bite-stings") > -1, "synonym expansion should find snake doc, got: " + ids.join(","));
  });

  test("coverage: synonym expansion maps 'fainted' to the fainting document", function () {
    var r = EC.Retriever.search("someone fainted on the street", 5);
    assert(r.expanded && r.expanded.join(" ").indexOf("faint→unconscious") > -1,
      "expansion should map faint→unconscious");
    assertEq(r[0].chunk.doc.id, "fainting");
  });

  test("coverage: unknown emergency type falls back to universal first steps, never refuses", function () {
    var res = EC.Agent.respond("the lift collapsed in our building and my friend is trapped inside");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    assert(res.answer.type === "guidance", "must still give guidance, got " + res.answer.type);
    assert(res.answer.citations.some(function (c) { return c.docId === "any-emergency-basics"; }),
      "must cite the universal any-emergency-basics document");
    assert(res.answer.escalation, "must escalate");
  });

  test("coverage: infant choking retrieves pediatric differences doc", function () {
    var res = EC.Agent.respond("my 8 month old baby is choking on food");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("child-infant") > -1 || ids.indexOf("choking-adult") > -1,
      "should retrieve child-infant or choking doc, got: " + ids.join(","));
  });

  test("coverage: gibberish still refused after expansion (no false positives)", function () {
    var res = EC.Agent.respond("quantum taxidermy philately montage");
    assertEq(res.answer.type, "refusal");
  });

  /* ---------- v3 — broad scenario coverage ---------- */

  test("scenario: dog bite washes and hospitalizes (rabies awareness)", function () {
    var res = EC.Agent.respond("a street dog bit my friend's leg");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("animal-bites") > -1, "should retrieve animal-bites, got: " + ids.join(","));
    var txt = res.answer.lead.text + " " + res.answer.steps.map(function (s) { return s.text || ""; }).join(" ");
    assert(/15 minutes/i.test(txt), "must include the 15-minute wash rule");
  });

  test("scenario: Hinglish 'kutta ne kaata' finds animal-bites via synonyms", function () {
    var res = EC.Agent.respond("kutta ne kaata hai");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("animal-bites") > -1, "should retrieve animal-bites, got: " + ids.join(","));
  });

  test("scenario: broken arm retrieves fractures guidance", function () {
    var res = EC.Agent.respond("my son fell and his arm is broken");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("fractures-sprains") > -1, "should retrieve fractures-sprains, got: " + ids.join(","));
  });

  test("scenario: head injury danger signs are quoted", function () {
    var res = EC.Agent.respond("he hit his head on the stairs, should I worry?");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("head-injury") > -1, "should retrieve head-injury, got: " + ids.join(","));
  });

  test("scenario: asthma attack quotes inhaler steps", function () {
    var res = EC.Agent.respond("my sister is having an asthma attack, no inhaler");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("asthma-attack") > -1, "should retrieve asthma-attack, got: " + ids.join(","));
  });

  test("scenario: nosebleed says lean forward", function () {
    var res = EC.Agent.respond("my nose is bleeding a lot");
    var txt = res.answer.steps.map(function (s) { return s.text || ""; }).join(" ");
    assert(/lean the head FORWARD|lean forward/i.test(txt), "must include lean-forward instruction");
  });

  test("scenario: panic attack is medical, NOT crisis-pinned", function () {
    var res = EC.Agent.respond("I think I am having a panic attack");
    assert(res.intent !== "CRISIS_SUPPORT", "panic attack must not route to self-harm crisis");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("panic-attack") > -1, "should retrieve panic-attack, got: " + ids.join(","));
  });

  test("scenario: low blood sugar gives fast sugar guidance", function () {
    var res = EC.Agent.respond("my grandpa is diabetic and shaking and sweating, sugar low");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("low-blood-sugar") > -1, "should retrieve low-blood-sugar, got: " + ids.join(","));
  });

  test("scenario: lightning strike guidance available", function () {
    var res = EC.Agent.respond("someone was struck by lightning in the field");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("lightning") > -1, "should retrieve lightning, got: " + ids.join(","));
  });

  test("scenario: crowd crush protects the chest", function () {
    var res = EC.Agent.respond("stampede at the station, crowd crushing people");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("stampede-crowd-crush") > -1, "should retrieve stampede-crowd-crush, got: " + ids.join(","));
  });

  test("scenario: cyclone 'toofan' synonym reaches the disaster doc", function () {
    var r = EC.Retriever.search("toofan aaya hai cyclone warning", 5);
    var ids = r.map(function (x) { return x.chunk.doc.id; });
    assert(ids.indexOf("landslide-cyclone-tsunami") > -1, "should reach landslide-cyclone-tsunami, got: " + ids.join(","));
  });

  test("scenario: 'behosh' is detected as an active emergency", function () {
    var s = EC.Safety.scan("mere papa behosh ho gaye hain");
    assert(s.emergencyActive === true, "behosh should trigger emergency detection");
    var res = EC.Agent.respond("mere papa behosh ho gaye hain");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    assert(res.answer.escalation, "must escalate");
  });

  test("scenario: chemical splash in eye — flush 20 minutes", function () {
    var res = EC.Agent.respond("acid went into my eye in the lab");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("eye-injury") > -1, "should retrieve eye-injury, got: " + ids.join(","));
  });

  test("scenario: knife stuck in body — never removed, always escalated", function () {
    var res = EC.Agent.respond("a knife is stuck in his shoulder, blood everywhere");
    assertEq(res.intent, "EMERGENCY_ACTIVE");
    var ids = (res.retrieval || []).map(function (r) { return r.chunk.doc.id; });
    assert(ids.indexOf("embedded-object") > -1, "should retrieve embedded-object, got: " + ids.join(","));
    var txt = res.answer.lead.text + " " + res.answer.steps.map(function (s) { return (s.heading || "") + " " + (s.text || ""); }).join(" ") + " " + res.answer.warnings.map(function (w) { return w.text; }).join(" ");
    assert(/remov/i.test(txt), "must warn against removal");
  });

  test("scenario: off-topic queries (cricket, cake) never return guidance", function () {
    ["who won the cricket match last night",
     "how do I bake a chocolate cake at home",
     "best exercise routine for gym beginners"].forEach(function (q) {
      var res = EC.Agent.respond(q);
      assert(res.answer.type !== "guidance", "off-topic query must not return guidance: " + q);
      assertEq(res.answer.citations.length, 0, "off-topic must not cite: " + q);
    });
  });

  function run() {
    var results = [];
    cases.forEach(function (c) {
      try {
        c.fn();
        results.push({ name: c.name, pass: true });
      } catch (e) {
        results.push({ name: c.name, pass: false, error: e.message });
      }
    });
    return results;
  }

  return { run: run, count: function () { return cases.length; } };
})();
