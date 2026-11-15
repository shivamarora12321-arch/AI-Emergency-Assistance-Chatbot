/* Safety layer: urgency detection, crisis support, scope gating, disclaimers.
 * Every response passes through this module before and after composition. */
window.EC = window.EC || {};
EC.Safety = (function () {
  "use strict";

  // Phrases that indicate a possible mental-health crisis involving self-harm.
  var CRISIS_PATTERNS = [
    /\bkill (myself|himself|herself|themself)\b/i,
    /\b(killing|want to kill) (myself|himself|herself|themselves)\b/i,
    /\bsuicid(e|al)\b/i,
    /\bend(ing)? (my|his|her|their)( own)? life\b/i,
    /\btake my own life\b/i,
    /\b(hurt|harm|harming) (myself|himself|herself|themselves)\b/i,
    /\bself[- ]harm\b/i,
    /\b(want|wanna|plan|planning|thinking) (to|about) (die|dying|disappear|disappearing forever)\b/i,
    /\bdon'?t want to (live|be here|go on)\b/i,
    /\bno reason to (live|go on)\b/i,
    /\bcut(ting)? (myself|himself|herself|themselves)\b/i,
    /\boverdos(e|ing) on\b/i
  ];

  // Phrases indicating an immediate, life-threatening physical event.
  var EMERGENCY_PATTERNS = [
    /\bnot breathing\b/i, /\bisn'?t breathing\b/i, /\bcan'?t breathe\b/i,
    /\bcannot breathe\b/i, /\bnot able to breathe\b/i, /\bsuffocat(e|ing|ing)\b/i,
    /\bno pulse\b/i, /\bno heartbeat\b/i,
    /\bunconscious\b/i, /\bpassed out\b/i, /\bcollapsed\b/i,
    /\bturning (blue|gray|pale)\b/i, /\b(choking|chokes|choked)\b/i,
    /\bheart attack\b/i, /\b(cardiac arrest|code blue)\b/i,
    /\bstroke\b/i, /\bseizure\b/i, /\bconvulsion/i,
    /\bsevere(ly)? bleeding\b/i, /\bbleeding (badly|heavily|a lot|out|nonstop)\b/i,
    /\bblood (everywhere|pouring|gushing|won'?t stop)\b/i,
    /\b(anaphyla|throat (closing|swelling))\b/i,
    /\b(overdose|overdosed|swallowed (pills|poison|bleach|cleaner|battery))\b/i,
    /\bpoison(ed|ing|ous)\b/i,
    /\b(hypothermi|heat ?stroke)\b/i,
    /\bburn(ed|s)? (badly|bad|severely)\b/i, /\b(on fire|caught fire)\b/i,
    /\bgas leak\b/i, /\bsmell(s|ing)? gas\b/i,
    /\bhouse fire\b/i, /\bsomething is on fire\b/i, /\bkitchen fire\b/i,
    /\b(drowning|drowned)\b/i, /\bfell from\b/i, /\bfell off (a |the )?(ladder|roof|balcony|bike|stairs)\b/i,
    /\bcrash(ed)? (into|head on)\b/i, /\bhit by (a|an|the)? ?(car|vehicle|truck|bus|train)\b/i,
    /\bwater rising (in|inside) (my|the) (house|home)\b/i,
    /\bcarbon monoxide\b/i, /\bco alarm\b/i,
    // Road and trauma
    /\b(road|car|bike|motorcycle|scooter|auto|truck|bus|train) (accident|crash|hit|collided|collision)\b/i,
    /\b(accident|crash|wreck) (happened|happening|now|just)\b/i,
    /\bstab(bed|bing)?\b/i, /\bgun ?shot\b/i, /\bshooting\b/i,
    /\bdeep (cut|wound)\b/i, /\b(bone|bones) (sticking|showing|broken through)\b/i,
    // Envenomation and environment
    /\bsnake ?bit(e|ten)?\b/i, /\bscorpion sting\b/i,
    /\belectrocut(ed|ion)\b/i, /\belectric(al)? shock\b/i,
    /\bshock(ed)? (by|from) (a |the )?(wire|electricity|current|socket|line)\b/i,
    /\b(building|roof|wall|scaffold|lift|elevator) (collapse|collapsed|fell|caved)\b/i,
    /\btrapped (in|under|inside)\b/i, /\bcaved in\b/i,
    // Hinglish / transliterated emergency phrasings
    /\baag (lagi|lag gayi|lagi hai|bhadi)\b/i,
    /\bkhoon (beh|bah|band|rukk?|ruk) (raha|rahi|nahin|nahi|hai)?\b/i,
    /\bsaanp? ne (kaata|kata|kat liya|kaata hai)\b/i,
    /\bdhadkan (rukh|ruk) (gayi|gayi hai)?\b/i,
    /\bsaanp kaat(NE)? (gaya|liya)\b/i,
    /\bdoob (raha|rahi|gaya|gayi)\b/i,
    /\bkisi (par|pe) (gir|gira) (pada|gaya)\b/i,
    /\bbehosh (ho gaya|ho gaye|hai|ho)\b/i,
    /\bsaans (nahi|nahin|nhi) (aa|le|chala)\b/i,
    /\bdil ka (daura|dora)\b/i,
    /\bkutta (ne|ne)? ?(kaata|kata|kat liya)\b/i
  ];

  // Immediacy markers suggesting the event is happening now.
  var NOW_MARKERS = [
    /\b(right now|now|currently|at this moment|just now|suddenly|immediately|urgent(ly)?|asap)\b/i,
    /\bemergency\b/i,
    /\b(is|are|am|was|were) (not|no|unconscious|choking|bleeding|collapsing|burning|turning|drowning|shaking|fitting)\b/i,
    /\b(my|our|the|mera|meri|mere) (dad|mom|father|mother|son|daughter|child|kid|baby|husband|wife|friend|brother|sister|coworker|grandma|grandpa|colleague|neighbor|boss|teacher|uncle|aunt|cousin|papa|bhai|didi|bhabhi|nana|nani|dada|dadi)\b/i,
    /\b(someone|somebody|a person|people|kisi)\b/i,
    /\bhelp\b/i, /\bmadad\b/i, /\bjaldi\b/i,
    /\b(came|come|comes|coming) (over|home|inside)\b/i,
    /\bhappened|happening\b/i
  ];

  // Clearly out-of-scope domains (the bot only discusses emergency guidance).
  var OFF_TOPIC_HINTS = [
    /\b(stock|share price|crypto|bitcoin|invest)\w*\b/i,
    /\b(homework|essay|poem|story|song|lyrics)\b/i,
    /\b(recipe|cook dinner|bake)\b/i,
    /\b(legal advice|sue|lawsuit|custody)\b/i,
    /\b(football|soccer|basketball|cricket|hockey|tennis|match|movie|netflix|video game)\b/i,
    /\b(gym|workout|exercise|diet|weight loss)\b/i,
    /\b(weather forecast|horoscope|lottery)\b/i,
    /\b(chatgpt|write me code|javascript|python code)\b/i
  ];

  var ESCALATION_LINE =
    "If this is happening right now, call for help immediately — India: 112 (national) / 100 police / 101 fire / 108 ambulance; " +
    "US: 911; EU: 112; UK: 999. Do not wait for this chatbot.";

  var CRISIS_LINE_NOTE =
    "Crisis support: 14416 (Tele-MANAS) or 1800-599-0019 (KIRAN) in India; 988 in the US and Canada; " +
    "116 123 (Samaritans) in the UK and Ireland; 13 11 14 (Lifeline) in Australia.";

  var DISCLAIMER =
    "This demo retrieves text only from its built-in approved guidance documents. " +
    "It is not a medical service and not a substitute for emergency services or certified training.";

  function matches(patterns, text) {
    var hit = [];
    patterns.forEach(function (p) {
      var m = text.match(p);
      if (m) hit.push(m[0].toLowerCase());
    });
    return hit;
  }

  /**
   * Scan raw user input before anything else runs.
   * Returns an assessment object consumed by the agent.
   */
  function scan(text) {
    var crisisHits = matches(CRISIS_PATTERNS, text);
    var emergencyHits = matches(EMERGENCY_PATTERNS, text);
    var nowHits = matches(NOW_MARKERS, text);

    var selfCrisis = crisisHits.length > 0;
    // Educational questions ABOUT an emergency ("signs of a stroke") are
    // answered with guidance; anything else matching an emergency pattern is
    // treated as an active event. Over-escalation is the safe default.
    var educational =
      /\b(symptoms?|signs? of|causes?|treatment for|first aid for|explain|meaning of|project|for school)\b/i.test(text) ||
      /^(what|how|why|when|which)\s+(are|is|do|does|can|should)\b/i.test(text.trim());
    var emergencyActive = emergencyHits.length > 0 && !educational;

    var urgency = "NORMAL";
    if (crisisHits.length || emergencyHits.length) urgency = "CRITICAL";
    else if (/\b(badly|severe|serious|a lot|heavy|lots of blood|deep|major|bad (cut|burn|fall))\b/i.test(text)) urgency = "HIGH";

    return {
      urgency: urgency,
      selfCrisis: selfCrisis,
      emergencyActive: emergencyActive,
      crisisHits: crisisHits,
      emergencyHits: emergencyHits,
      nowHits: nowHits
    };
  }

  function looksOffTopic(text) {
    // An emergency term always overrides off-topic hints.
    if (matches(EMERGENCY_PATTERNS, text).length || matches(CRISIS_PATTERNS, text).length) {
      return false;
    }
    return matches(OFF_TOPIC_HINTS, text).length > 0;
  }

  return {
    scan: scan,
    looksOffTopic: looksOffTopic,
    ESCALATION_LINE: ESCALATION_LINE,
    CRISIS_LINE_NOTE: CRISIS_LINE_NOTE,
    DISCLAIMER: DISCLAIMER
  };
})();
