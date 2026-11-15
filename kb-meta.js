/* Knowledge base: meta / general emergency guidance.
 * Demo corpus of "approved" guidance. Every document carries review metadata;
 * answers may only quote text that lives in these documents.
 * Content aligns with widely published public-safety principles — it is not a
 * substitute for certified training or local official guidance. */
window.EC = window.EC || {};
EC.KB_META = [
  {
    id: "emergency-numbers",
    title: "Emergency numbers — India and worldwide",
    category: "General",
    review_date: "2026-10-01",
    source_note: "Indian numbers as published by Government of India helplines; verify locally.",
    summary: "In India, 112 is the single national emergency number for police, fire, and medical help — but you can also dial the services directly. Calling early is the most important step in any serious emergency.",
    sections: [
      {
        heading: "India — national emergency numbers",
        bullets: [
          "112 — national emergency number (ERSS): connects police, fire, and ambulance anywhere in India.",
          "100 — police. 101 — fire and rescue. 108 — free ambulance service.",
          "1091 — women in distress. 1098 — children in need (Childline).",
          "1078 — natural disaster helpline (NDMA). 139 — railway assistance.",
          "14416 — Tele-MANAS national mental-health support; 1930 — cyber financial fraud."
        ]
      },
      {
        heading: "Other countries",
        bullets: [
          "United States and Canada: 911.",
          "European Union: 112. United Kingdom: 999 or 112.",
          "Australia: 000. New Zealand: 111."
        ]
      },
      {
        heading: "When to call immediately",
        bullets: [
          "Call immediately if someone is unconscious, not breathing, or breathing abnormally.",
          "Call immediately if there is heavy bleeding, signs of a stroke or heart attack, severe burns, or a serious fall.",
          "Call if there is a fire, gas smell, structural collapse, or any situation that is getting worse fast.",
          "If you are unsure whether it is an emergency, call — dispatchers would rather rule it out than be called too late."
        ]
      },
      {
        heading: "Information to give the dispatcher",
        bullets: [
          "State your location first, including floor or apartment number, then what happened.",
          "Say how many people are affected and whether anyone is unconscious or not breathing.",
          "Do not hang up until the dispatcher tells you to; follow their instructions."
        ]
      }
    ],
    warnings: [
      "If you are alone and treating an unconscious, non-breathing person, put your phone on speaker so you can start aid while talking."
    ]
  },
  {
    id: "mental-health-crisis",
    title: "Mental health crisis and thoughts of self-harm",
    category: "General",
    review_date: "2026-10-01",
    source_note: "Aligns with published crisis-line guidance; local resources vary.",
    summary: "Thoughts of self-harm are a medical emergency. Immediate connection to a person or crisis line saves lives.",
    sections: [
      {
        heading: "If someone may hurt themselves right now",
        bullets: [
          "Stay with the person; do not leave them alone.",
          "Remove or distance access to means of self-harm, including medications, weapons, and sharp objects, if you can do so safely.",
          "Call your local emergency number, or a crisis line: 14416 (Tele-MANAS) or 1800-599-0019 (KIRAN) in India; 988 in the US and Canada; 116 123 (Samaritans) in the UK and Ireland; 13 11 14 (Lifeline) in Australia.",
          "Talk calmly, listen without judgment, and do not promise to keep it secret."
        ]
      },
      {
        heading: "What to avoid",
        bullets: [
          "Do not argue, act shocked, or offer quick fixes.",
          "Do not try to handle an immediate risk of suicide alone — involve emergency services or a crisis line."
        ]
      }
    ],
    warnings: [
      "Any expressed plan or intent to end life is an emergency — treat it exactly as seriously as a physical injury."
    ]
  },
  {
    id: "emergency-kit",
    title: "Home emergency kit basics",
    category: "Preparedness",
    review_date: "2026-10-01",
    source_note: "Aligns with published disaster-preparedness checklists.",
    summary: "Keep a kit that lets your household survive at least 72 hours without utilities or shopping.",
    sections: [
      {
        heading: "Kit contents",
        bullets: [
          "Water: at least 3 liters (1 gallon) per person per day, for three days.",
          "Food: three days of non-perishable food plus a manual can opener.",
          "Medications: a week's supply of essential medicines, plus basic first-aid supplies.",
          "Light and power: flashlight with spare batteries, power bank, and a battery or hand-crank radio.",
          "Documents: copies of ID, insurance, and medical information in a waterproof bag.",
          "Extras: whistle, dust mask, wet wipes, cash in small bills, and pet supplies if needed."
        ]
      },
      {
        heading: "Maintenance",
        bullets: [
          "Check the kit twice a year; replace expired food, medicine, and batteries.",
          "Keep a smaller version of the kit in your car."
        ]
      }
    ],
    warnings: [
      "Do not use candles for emergency lighting — they cause fires after disasters; use flashlights."
    ]
  },
  {
    id: "any-emergency-basics",
    title: "Any emergency — the first five minutes",
    category: "General",
    review_date: "2026-11-12",
    source_note: "Universal priorities published by first-aid organizations; applies when the situation is not yet clear.",
    summary: "Whatever is happening: keep yourself safe, call your emergency number, and stay with the person. This universal checklist applies to any emergency, even when the type is not yet clear.",
    sections: [
      {
        heading: "First priorities",
        bullets: [
          "Get yourself safe first — you cannot help anyone if you become a casualty.",
          "Call 112 (or 100 police / 101 fire / 108 ambulance in India; 911 US; 999 UK), or point at one specific bystander and tell them to call.",
          "If someone is unconscious, send another person to find an AED and check breathing immediately.",
          "Do not move an injured person unless there is fire, falling debris, traffic, or water danger."
        ]
      },
      {
        heading: "While waiting for help",
        bullets: [
          "Control visible bleeding with firm direct pressure using a clean cloth.",
          "Keep the person warm, talk calmly, and stay with them.",
          "Unlock the front door and clear a path so responders can reach you.",
          "Note what happened and when it started — paramedics will ask."
        ]
      }
    ],
    warnings: [
      "If you are alone with an unconscious, non-breathing person, put your phone on speaker, call, and start CPR immediately."
    ]
  }
];
