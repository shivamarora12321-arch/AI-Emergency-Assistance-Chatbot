/* Knowledge base: hazard and disaster guidance.
 * Demo corpus of "approved" guidance. Answers may only quote text from these
 * documents. Content aligns with widely published public-safety principles —
 * always follow instructions from local officials during real events. */
window.EC = window.EC || {};
EC.KB_HAZARDS = [
  {
    id: "fire-evacuation",
    title: "House fire — escape and prevention",
    category: "Hazard",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published fire-safety guidance.",
    summary: "Get out, stay out, and call the fire service from outside. You may have less than two minutes to escape a house fire.",
    sections: [
      {
        heading: "If a fire starts",
        bullets: [
          "Shout to alert everyone and leave immediately; do not stop to collect belongings.",
          "If there is smoke, stay low and crawl — cleanest air is near the floor.",
          "Close doors behind you as you go to slow the fire's spread.",
          "Once out, stay out; never go back inside. Call the emergency number from outside."
        ]
      },
      {
        heading: "If your exit is blocked",
        bullets: [
          "Get into a room with a window, close the door, and seal gaps with clothing or towels.",
          "Open the window and signal for help; call the emergency number and give your exact room location."
        ]
      },
      {
        heading: "Preparedness",
        bullets: [
          "Test smoke alarms monthly and replace batteries yearly; alarms cut fire deaths roughly in half.",
          "Plan two escape routes from every room and agree on a meeting point outside; practice twice a year."
        ]
      }
    ],
    warnings: [
      "If clothes catch fire: stop, drop, and roll — do not run."
    ]
  },
  {
    id: "earthquake",
    title: "Earthquake — protect yourself",
    category: "Hazard",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published earthquake-safety guidance.",
    summary: "Drop, Cover, and Hold On during shaking; expect aftershocks and check for injuries and gas afterward.",
    sections: [
      {
        heading: "During the shaking",
        bullets: [
          "Drop to the ground, take Cover under a sturdy table or desk, and Hold On until shaking stops.",
          "If no shelter is near, kneel against an interior wall and protect your head and neck with your arms.",
          "Stay away from windows, glass, mirrors, and heavy furniture that can topple.",
          "Do not run outside while shaking — falling debris causes many injuries at doorways and exits."
        ]
      },
      {
        heading: "After the shaking stops",
        bullets: [
          "Expect aftershocks; drop, cover, and hold on for each one.",
          "Check yourself and others for injuries; treat bleeding first.",
          "Check for gas smells or hissing; if you smell gas, leave and keep others away.",
          "Use flashlights, not candles; listen to a battery radio for official instructions.",
          "Leave damaged buildings via stairs, never elevators."
        ]
      }
    ],
    warnings: [
      "If you are in bed, stay there and protect your head with a pillow — moving in the dark causes injuries."
    ]
  },
  {
    id: "flood",
    title: "Flood — before and during",
    category: "Hazard",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published flood-safety guidance.",
    summary: "Never walk or drive through flood water — turn around, don't drown. Move to higher ground on official notice.",
    sections: [
      {
        heading: "When flooding threatens",
        bullets: [
          "Follow evacuation orders immediately; take your emergency kit and documents.",
          "Move to higher ground before water rises; never wait for an official instruction if water is entering."
        ]
      },
      {
        heading: "During a flood",
        bullets: [
          "Never walk through moving flood water — 15 cm (6 inches) can knock an adult down.",
          "Never drive through flooded roads — 60 cm (2 feet) of water can carry a car away; most flood deaths happen in vehicles.",
          "Do not touch electrical equipment if you are wet or standing in water."
        ]
      },
      {
        heading: "Afterward",
        bullets: [
          "Boil or treat all drinking water until officials declare supplies safe.",
          "Do not enter a building until it has been checked for structural damage; avoid downed power lines.",
          "Discard food that touched flood water."
        ]
      }
    ],
    warnings: [
      "Moving water and hidden debris make flood water far more dangerous than it looks."
    ]
  },
  {
    id: "severe-storm",
    title: "Severe storms, hurricanes, and high wind",
    category: "Hazard",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published storm-safety guidance.",
    summary: "Take shelter in an interior room on the lowest floor, away from windows, and keep a radio for official updates.",
    sections: [
      {
        heading: "Before the storm",
        bullets: [
          "Bring in or secure outdoor furniture and anything wind can turn into a projectile.",
          "Charge phones and power banks; fill bathtubs and containers with water if advised.",
          "If officials issue an evacuation order for your zone, leave early — do not wait for the storm."
        ]
      },
      {
        heading: "During the storm",
        bullets: [
          "Shelter in an interior room or hallway on the lowest floor, away from windows and doors.",
          "For tornado-strength winds, a basement or interior bathroom offers the best protection; cover your head.",
          "Stay indoors away from windows even if it suddenly goes calm — you may be in the eye of the storm.",
          "Use a battery or hand-crank radio for official updates."
        ]
      }
    ],
    warnings: [
      "Do not go outside to photograph or watch the storm."
    ]
  },
  {
    id: "power-outage",
    title: "Power outage — safety",
    category: "Hazard",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published outage-safety guidance.",
    summary: "Use flashlights instead of candles, keep fridge and freezer closed, and never run generators or grills indoors.",
    sections: [
      {
        heading: "Immediate steps",
        bullets: [
          "Use flashlights for lighting; candles cause fires during outages.",
          "Keep refrigerator and freezer doors closed — an unopened fridge keeps food safe about 4 hours, a full freezer about 48.",
          "Unplug sensitive electronics to protect them from surges when power returns."
        ]
      },
      {
        heading: "Carbon monoxide danger",
        bullets: [
          "Never run generators, charcoal grills, or fuel-burning camp stoves indoors or in a garage — carbon monoxide kills invisibly.",
          "Place generators outdoors, far from windows and vents.",
          "If a CO alarm sounds or anyone feels dizzy, weak, or confused, get to fresh air immediately and call the emergency number."
        ]
      }
    ],
    warnings: [
      "Carbon monoxide has no smell — detectors save lives; test them with your smoke alarms."
    ]
  },
  {
    id: "lightning",
    title: "Lightning storms — stay safe outdoors",
    category: "Hazard",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published lightning-safety guidance (30-30 rule).",
    summary: "When thunder roars, go indoors — lightning can strike 15 km ahead of a storm; wait 30 minutes after the last thunder before going back outside.",
    sections: [
      {
        heading: "During the storm",
        bullets: [
          "Get inside a substantial building or a hard-topped metal car at the first sound of thunder.",
          "If stuck outside, avoid open fields, hilltops, tall isolated trees, water, and metal fences; crouch low on the balls of your feet, feet together, head down — do not lie flat.",
          "Stay off corded electronics and away from windows; unplug devices before the storm arrives if you can."
        ]
      },
      {
        heading: "If someone is struck",
        bullets: [
          "Lightning victims carry no charge — it is safe to touch them; call the emergency number immediately.",
          "Check breathing and start CPR if the person is not breathing; treat burn marks with cool water."
        ]
      }
    ],
    warnings: [
      "Follow the 30-30 rule: go indoors if thunder follows lightning within 30 seconds, and stay inside for 30 minutes after the last thunder."
    ]
  },
  {
    id: "landslide-cyclone-tsunami",
    title: "Landslides, cyclones and tsunami",
    category: "Hazard",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published disaster-safety guidance; India coastal and hill-region relevant.",
    summary: "Move uphill away from landslide slopes, evacuate inland for cyclones before the surge, and run to high ground the moment a tsunami warning or long ground shaking hits.",
    sections: [
      {
        heading: "Landslide",
        bullets: [
          "Leave the slope area quickly at any sign — rumbling ground, cracks appearing, tilting trees or poles.",
          "Move up and away from the slide path, not across it; if escaping is impossible, curl into a ball protecting your head.",
          "Never return to a slide area — further slides are common."
        ]
      },
      {
        heading: "Cyclone",
        bullets: [
          "Follow evacuation orders early; move inland or to designated shelters before the storm surge, and keep your emergency kit and documents ready.",
          "Shelter in an interior room away from windows on the highest safe floor — surge flooding makes ground floors dangerous.",
          "Beware the calm 'eye' — winds return suddenly from the opposite direction."
        ]
      },
      {
        heading: "Tsunami",
        bullets: [
          "If you feel long or strong ground shaking near a coast, or see the sea withdraw suddenly, move to high ground or far inland immediately — do not wait for an official warning.",
          "A tsunami is a series of waves for hours; never go to the shore to watch, and return only on official all-clear."
        ]
      }
    ],
    warnings: [
      "Never drive through floodwater during evacuation — most disaster deaths in cyclones and tsunamis are from drowning in moving water."
    ]
  },
  {
    id: "stampede-crowd-crush",
    title: "Crowd crush and stampede",
    category: "Hazard",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published crowd-safety guidance.",
    summary: "In a crowd crush, protect your chest, stay on your feet, and move diagonally with the flow — most deaths come from crushed ribs and asphyxiation, not trampling.",
    sections: [
      {
        heading: "If the crowd surges",
        bullets: [
          "Stay on your feet at all costs; if you fall, curl on your side protecting head and neck and try to get up fast.",
          "Make space for your chest by bracing arms in front of you like a boxer, and breathe steadily even when compressed.",
          "Move diagonally with the crowd toward the edges, using lulls between surges — never push directly against the flow."
        ]
      },
      {
        heading: "Getting out and helping",
        bullets: [
          "Leave early along walls and barriers rather than the center; keep your arms up and avoid dropped-object crouches.",
          "If someone falls near you, link arms with others to form a human barrier and pull them to safety when the flow pauses.",
          "Call the emergency number once clear, and report missing people to police on site rather than searching the crush yourself."
        ]
      }
    ],
    warnings: [
      "Do not stop to film or pick up belongings — a crowd crush develops in seconds and escaping is the only priority."
    ]
  }
];
