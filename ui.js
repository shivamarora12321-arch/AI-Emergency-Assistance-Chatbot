/* UI wiring: renders chat messages, reasoning traces, citations, and the
 * guidance library. All DOM text is escaped — user input is never inserted
 * as raw HTML. */
(function () {
  "use strict";

  var state = { thinking: false };

  function $(sel) { return document.querySelector(sel); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // ---------- knowledge base bootstrap ----------
  var ALL_DOCS = (EC.KB_META || []).concat(EC.KB_MEDICAL || [], EC.KB_HAZARDS || []);
  EC.Retriever.build(ALL_DOCS);

  // Live counts so displayed numbers always match the corpus.
  function setCount(id, v) { var el = document.getElementById(id); if (el) el.textContent = v; }
  setCount("docCount", ALL_DOCS.length);
  setCount("docCount2", ALL_DOCS.length);
  setCount("secCount", EC.Retriever.chunkCount());

  // ---------- chat rendering ----------

  function addUserMessage(text) {
    var wrap = document.createElement("div");
    wrap.className = "msg user";
    wrap.innerHTML = '<div class="bubble"><div class="msg-role">You</div><div class="msg-body"></div></div>';
    wrap.querySelector(".msg-body").textContent = text;
    $("#chatScroll").appendChild(wrap);
    scrollDown();
  }

  function addTyping() {
    var el = document.createElement("div");
    el.className = "msg assistant";
    el.id = "typingMsg";
    el.innerHTML =
      '<div class="bubble"><div class="msg-role">Assistant</div>' +
      '<div class="typing"><span></span><span></span><span></span></div></div>';
    $("#chatScroll").appendChild(el);
    scrollDown();
  }

  function removeTyping() {
    var el = $("#typingMsg");
    if (el) el.parentNode.removeChild(el);
  }

  function citeChip(n) {
    return '<sup class="cite" data-cite="' + n + '">' + n + "</sup>";
  }

  function buildAssistantHTML(res) {
    var a = res.answer;
    var h = "";

    if (a.escalation) h += '<div class="escalation">🚨 ' + esc(a.escalation) + "</div>";
    if (a.pinnedNote) h += '<div class="escalation">☎ ' + esc(a.pinnedNote) + "</div>";

    h += '<p class="lead">' + esc(a.lead.text) + (a.lead.cite ? citeChip(a.lead.cite) : "") + "</p>";

    var steps = a.steps || [];
    if (steps.length) {
      h += '<div class="steps-head">Approved guidance</div><ul class="bullets">';
      steps.forEach(function (s) {
        if (s.heading) {
          h += '</ul><div class="step-heading">' + esc(s.heading) + (s.cite ? citeChip(s.cite) : "") + "</div><ul class=\"bullets\">";
        } else {
          h += "<li>" + esc(s.text) + (s.cite ? citeChip(s.cite) : "") + "</li>";
        }
      });
      h += "</ul>";
    }

    if (a.warnings && a.warnings.length) {
      h += '<div class="warnings"><div class="warn-title">⚠ Warnings</div><ul>';
      a.warnings.forEach(function (w) {
        h += "<li>" + esc(w.text) + (w.cite ? citeChip(w.cite) : "") + "</li>";
      });
      h += "</ul></div>";
    }

    if (a.suggestions && a.suggestions.length) {
      h += '<div class="suggest-box"><div class="suggest-title">Suggestions</div>';
      a.suggestions.forEach(function (s) { h += '<span class="suggestion">• ' + esc(s) + "</span>"; });
      h += "</div>";
    }

    if (a.citations && a.citations.length) {
      h += '<div class="citation-list">';
      a.citations.forEach(function (c) {
        h += '<div class="citation-item"><b>[' + c.n + "]</b> " + esc(c.title) +
             " · reviewed " + esc(c.review_date) + " · " + esc(c.category) +
             ' <a href="#" class="cite-link" data-doc="' + esc(c.docId) + '">view</a></div>';
      });
      h += "</div>";
    }

    // meta row: confidence, intent, urgency, latency
    h += '<div class="meta-row">';
    h += '<span>confidence ' + (a.confidence || 0) + '%</span>';
    h += '<span class="conf-bar"><span class="conf-fill" style="width:' + (a.confidence || 0) + '%"></span></span>';
    h += '<span class="intent-pill">intent: ' + esc(res.intent) + "</span>";
    h += '<span class="urgency-pill urgency-' + esc(a.urgency || "NORMAL") + '">urgency: ' + esc(a.urgency || "NORMAL") + "</span>";
    h += "<span>" + res.latencyMs + " ms</span>";
    h += "</div>";

    // reasoning trace
    h += '<button class="trace-toggle" data-trace>▸ Show agent reasoning</button>';
    h += '<div class="trace" style="display:none"><ol class="trace-steps">';
    res.trace.forEach(function (t) {
      var detail = esc(t.detail).replace(/\b(PASS)\b/g, '<span class="pass">$1</span>')
                                .replace(/\b(FAIL)\b/g, '<span class="fail">$1</span>');
      h += '<li><span class="trace-step-name">' + esc(t.step) + "</span>" +
           '<span class="trace-detail">' + detail + "</span></li>";
    });
    h += "</ol></div>";

    h += '<div class="disclaimer">' + esc(a.disclaimer) + "</div>";
    return h;
  }

  function addAssistantMessage(res) {
    var wrap = document.createElement("div");
    wrap.className = "msg assistant";
    wrap.innerHTML =
      '<div class="bubble"><div class="msg-role">Assistant</div>' +
      '<div class="msg-assistant-body">' + buildAssistantHTML(res) + "</div></div>";

    wrap.querySelector("[data-trace]").addEventListener("click", function () {
      var box = wrap.querySelector(".trace");
      var open = box.style.display !== "none";
      box.style.display = open ? "none" : "block";
      this.textContent = open ? "▸ Show agent reasoning" : "▾ Hide agent reasoning";
    });

    wrap.addEventListener("click", function (ev) {
      var cite = ev.target.closest("[data-cite]");
      if (cite) { openDocModal(cite.getAttribute("data-cite")); return; }
      var link = ev.target.closest(".cite-link");
      if (link) { ev.preventDefault(); openDocModal(link.getAttribute("data-doc")); }
    });

    $("#chatScroll").appendChild(wrap);
    scrollDown();
  }

  function scrollDown() {
    var sc = $("#chatScroll");
    sc.scrollTop = sc.scrollHeight;
  }

  function send(text) {
    if (state.thinking || !text.trim()) return;
    state.thinking = true;
    addUserMessage(text.trim());
    addTyping();
    // Small delay so the reasoning trace reads as a process, not a jump.
    window.setTimeout(function () {
      removeTyping();
      var res = EC.Agent.respond(text.trim());
      addAssistantMessage(res);
      state.thinking = false;
    }, 450);
  }

  // ---------- guidance library ----------

  function renderDocList() {
    var host = $("#docList");
    var html = "";
    var CAT_CLASS = { Medical: "cat-medical", Hazard: "cat-hazard", General: "cat-general", Preparedness: "cat-prepared" };
    ALL_DOCS.forEach(function (d) {
      var cls = CAT_CLASS[d.category] || "cat-general";
      html += '<div class="doc-card ' + cls + '" data-doc-card="' + esc(d.id) + '">' +
        '<div class="doc-head"><span class="doc-title">' + esc(d.title) + "</span>" +
        '<span class="doc-meta">' + esc(d.category) + " · " + esc(d.review_date) + "</span></div>" +
        '<div class="doc-body"><div class="doc-summary">' + esc(d.summary) + "</div>" +
        '<div class="doc-source">' + esc(d.source_note) + "</div></div></div>";
    });
    host.innerHTML = html;
    host.addEventListener("click", function (ev) {
      var head = ev.target.closest(".doc-head");
      if (head) head.parentNode.classList.toggle("open");
    });
  }

  function openDocModal(docId) {
    var d = null;
    ALL_DOCS.forEach(function (x) { if (x.id === docId) d = x; });
    if (!d) return;
    var body = "";
    d.sections.forEach(function (s) {
      body += "<h4>" + esc(s.heading) + "</h4><ul>";
      s.bullets.forEach(function (b) { body += "<li>" + esc(b) + "</li>"; });
      body += "</ul>";
    });
    if (d.warnings && d.warnings.length) {
      body += '<div class="warnings"><div class="warn-title">⚠ Warnings</div><ul>';
      d.warnings.forEach(function (w) { body += "<li>" + esc(w) + "</li>"; });
      body += "</ul></div>";
    }
    $("#modalBody").innerHTML =
      "<h3>" + esc(d.title) + "</h3>" +
      '<p class="doc-meta">' + esc(d.category) + " · reviewed " + esc(d.review_date) + "</p>" +
      "<p>" + esc(d.summary) + "</p>" + body +
      '<p class="doc-source" style="font-size:0.75rem;color:var(--muted);font-style:italic">' + esc(d.source_note) + "</p>";
    $("#modalBackdrop").classList.add("open");
  }

  // ---------- wire up ----------

  $("#chatForm").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var input = $("#chatInput");
    send(input.value);
    input.value = "";
  });

  document.addEventListener("click", function (ev) {
    if (ev.target.classList && ev.target.classList.contains("chip")) {
      send(ev.target.textContent);
    }
  });

  $("#btnClear").addEventListener("click", function () {
    EC.Privacy.clear();
    var sc = $("#chatScroll");
    while (sc.children.length > 1) sc.removeChild(sc.lastChild);
    sc.appendChild($("#welcome"));
    $("#welcome").style.display = "";
    scrollDown();
  });

  $("#btnExport").addEventListener("click", function () {
    var blob = new Blob([EC.Privacy.exportText()], { type: "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "emergency-assistant-transcript.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  // side tabs
  Array.prototype.forEach.call(document.querySelectorAll(".side-tab"), function (tab) {
    tab.addEventListener("click", function () {
      Array.prototype.forEach.call(document.querySelectorAll(".side-tab"), function (t) { t.classList.remove("active"); });
      Array.prototype.forEach.call(document.querySelectorAll(".side-tab-panel"), function (p) { p.classList.remove("active"); });
      tab.classList.add("active");
      document.querySelector('.side-tab-panel[data-panel="' + tab.dataset.tab + '"]').classList.add("active");
    });
  });

  $("#linkHow").addEventListener("click", function (ev) {
    ev.preventDefault();
    document.querySelector('.side-tab[data-tab="how"]').click();
  });

  $("#modalClose").addEventListener("click", function () { $("#modalBackdrop").classList.remove("open"); });
  $("#modalBackdrop").addEventListener("click", function (ev) {
    if (ev.target === this) this.classList.remove("open");
  });

  renderDocList();
})();
