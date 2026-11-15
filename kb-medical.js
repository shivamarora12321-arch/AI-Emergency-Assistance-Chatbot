/* Knowledge base: medical emergency guidance.
 * Demo corpus of "approved" guidance. Answers may only quote text from these
 * documents. Content aligns with widely published first-aid principles — it is
 * not a substitute for certified training. */
window.EC = window.EC || {};
EC.KB_MEDICAL = [
  {
    id: "cpr-adult",
    title: "CPR for adults — basics",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely taught hands-only CPR guidance; take a certified course.",
    summary: "If a person is unconscious and not breathing normally, start chest compressions immediately and send someone for an AED.",
    sections: [
      {
        heading: "Before you start",
        bullets: [
          "Check the scene is safe for you, then tap the person's shoulders and shout to check for a response.",
          "Shout for help: tell one specific person to call the emergency number and another to fetch an AED if available.",
          "If alone, call the emergency number on speaker, then start compressions immediately."
        ]
      },
      {
        heading: "Chest compressions",
        bullets: [
          "Place the heel of one hand on the center of the chest, your other hand on top, arms straight.",
          "Push hard and fast: at least 5 cm (2 inches) deep, at 100–120 compressions per minute.",
          "Let the chest rise fully between pushes; minimize pauses.",
          "Continue without stopping until the person breathes normally, an AED arrives, or professional help takes over.",
          "If an AED arrives, turn it on and follow its voice prompts; it is safe for anyone to use."
        ]
      },
      {
        heading: "Rescue breaths (if trained)",
        bullets: [
          "If you are trained, give 30 compressions then 2 rescue breaths, repeating.",
          "If untrained or unwilling, continuous compressions alone are far better than nothing."
        ]
      }
    ],
    warnings: [
      "Do not practice compressions on a person who does not need them.",
      "Hands-only CPR is for adults; child and infant CPR uses different technique."
    ]
  },
  {
    id: "choking-adult",
    title: "Choking — adult and child over 1 year",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published first-aid guidance.",
    summary: "A person who cannot cough, speak, or breathe needs back blows and abdominal thrusts immediately.",
    sections: [
      {
        heading: "Recognize severe choking",
        bullets: [
          "Ask: \"Are you choking?\" If they cannot speak or cough effectively, act at once.",
          "Signs include clutching the throat, no sound, and bluish lips."
        ]
      },
      {
        heading: "What to do",
        bullets: [
          "Lean the person forward and give 5 firm back blows between the shoulder blades with the heel of your hand.",
          "Then give 5 abdominal thrusts: stand behind, fist just above the navel, quick inward-and-upward pulls.",
          "Alternate 5 back blows and 5 abdominal thrusts until the object clears or the person collapses.",
          "If the person becomes unconscious, lower them to the floor, call the emergency number, and start CPR."
        ]
      }
    ],
    warnings: [
      "Abdominal thrusts are for adults and children over 1 year only — never infants.",
      "Anyone who has received abdominal thrusts should be checked by a medical professional afterward."
    ]
  },
  {
    id: "severe-bleeding",
    title: "Severe bleeding — first response",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published first-aid guidance (stop-the-bleed principles).",
    summary: "Apply firm direct pressure to stop life-threatening bleeding and call for help.",
    sections: [
      {
        heading: "Immediate steps",
        bullets: [
          "Call your local emergency number for heavy or spurting bleeding.",
          "Press hard on the wound with a sterile dressing or clean cloth; do not remove soaked dressings — add new ones on top.",
          "Keep pressing continuously; if you can, ask the injured person to help press.",
          "If bleeding soaks through, add more material and press harder; do not look under the dressing."
        ]
      },
      {
        heading: "While waiting for help",
        bullets: [
          "Help the person lie down and keep them still; cover them to keep warm.",
          "If a limb is bleeding and pressure fails, apply a tourniquet 5–7 cm above the wound if you have one and are trained; note the time.",
          "Never use a tourniquet on neck or torso."
        ]
      }
    ],
    warnings: [
      "Do not remove embedded objects — press around them."
    ]
  },
  {
    id: "burns",
    title: "Burns — first aid",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published first-aid guidance.",
    summary: "Cool the burn with cool running water for at least 20 minutes; call for help for large or deep burns.",
    sections: [
      {
        heading: "Immediate steps",
        bullets: [
          "Stop the burning: remove the person from the heat source; smother flames with a blanket if clothing burns.",
          "Cool the burn under gently running cool water for at least 20 minutes; cool water, not ice.",
          "Remove jewelry or tight clothing near the burn before swelling starts, if it does not stick to skin.",
          "Cover loosely with cling film or a clean non-fluffy cloth laid lengthways."
        ]
      },
      {
        heading: "When to call the emergency number",
        bullets: [
          "Call for burns larger than the person's palm, burns on face, hands, feet, genitals, or over joints, any chemical or electrical burn, and any smoke inhalation.",
          "For chemical burns, wear gloves, brush off dry chemicals, then flush with cool water for at least 20 minutes."
        ]
      }
    ],
    warnings: [
      "Never use ice, butter, ointments, or toothpaste on a fresh burn.",
      "Electrical burns can stop the heart — switch off power first and call the emergency number."
    ]
  },
  {
    id: "stroke-fast",
    title: "Stroke — recognize with FAST",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published stroke-awareness guidance.",
    summary: "Use FAST — Face, Arms, Speech, Time — and call the emergency number at the first sign; treatment is time-critical.",
    sections: [
      {
        heading: "FAST check",
        bullets: [
          "Face: ask the person to smile — does one side droop?",
          "Arms: ask them to raise both arms — does one drift down?",
          "Speech: ask them to repeat a simple sentence — is it slurred or odd?",
          "Time: if any sign is present, call the emergency number immediately and note when symptoms started."
        ]
      },
      {
        heading: "While waiting",
        bullets: [
          "Note the exact time symptoms began and tell paramedics — it decides treatment options.",
          "Help the person sit or lie down, keep them calm, and give nothing to eat or drink."
        ]
      }
    ],
    warnings: [
      "Do not give aspirin for a suspected stroke — bleeding type must be ruled out in hospital first."
    ]
  },
  {
    id: "heart-attack",
    title: "Heart attack — warning signs",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published heart-attack awareness guidance.",
    summary: "Chest pressure with sweating, nausea, or shortness of breath may be a heart attack — call the emergency number, do not drive yourself.",
    sections: [
      {
        heading: "Common signs",
        bullets: [
          "Pressure, squeezing, or pain in the center of the chest, lasting more than a few minutes or coming and going.",
          "Pain or discomfort spreading to arm, jaw, neck, back, or stomach.",
          "Cold sweat, nausea, sudden shortness of breath, or unusual exhaustion."
        ]
      },
      {
        heading: "What to do",
        bullets: [
          "Call the emergency number immediately and say you suspect a heart attack.",
          "Help the person sit down, rest, and loosen tight clothing; keep them calm.",
          "If the person is not allergic and no doctor has told them otherwise, chewing one regular aspirin may help — tell paramedics what was taken.",
          "If they become unconscious and stop breathing normally, start CPR."
        ]
      }
    ],
    warnings: [
      "Never drive yourself to hospital with suspected heart attack symptoms — call for an ambulance."
    ]
  },
  {
    id: "poisoning",
    title: "Poisoning and overdose",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published poison-control guidance.",
    summary: "Call the emergency number or poison control immediately; do not make the person vomit.",
    sections: [
      {
        heading: "Immediate steps",
        bullets: [
          "Call your local emergency number or poison control (US: 1-800-222-1222) right away.",
          "Keep the container, bottle, or plant sample to show or describe to responders.",
          "Follow the dispatcher's or poison control's instructions exactly."
        ]
      },
      {
        heading: "What not to do",
        bullets: [
          "Do not make the person vomit and do not give water, milk, or anything else unless told to.",
          "Do not give ipecac or any home remedy."
        ]
      },
      {
        heading: "If the person is unconscious",
        bullets: [
          "Check breathing; if absent or abnormal, start CPR.",
          "Place a breathing but unconscious person in the recovery position on their side."
        ]
      }
    ],
    warnings: [
      "Call even if the person seems fine — many poisons act with delay."
    ]
  },
  {
    id: "seizure",
    title: "Seizure — assisting someone",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published seizure first-aid guidance.",
    summary: "Protect the person from injury, time the seizure, and call the emergency number if it lasts over 5 minutes.",
    sections: [
      {
        heading: "During the seizure",
        bullets: [
          "Stay calm; guide people away and clear hard or sharp objects.",
          "Cushion the head, loosen tight neckwear, and note the time the seizure started.",
          "Do not hold the person down and never put anything in their mouth."
        ]
      },
      {
        heading: "After the seizure",
        bullets: [
          "Turn the person onto their side in the recovery position once movements stop.",
          "Stay with them until fully alert; speak calmly and explain what happened."
        ]
      },
      {
        heading: "When to call the emergency number",
        bullets: [
          "Call if the seizure lasts more than 5 minutes, repeats, starts in water, or the person is injured, pregnant, or has no known seizure history.",
          "Call if the person does not regain consciousness or has difficulty breathing afterward."
        ]
      }
    ],
    warnings: [
      "Never restrain a seizing person or force anything between their teeth."
    ]
  },
  {
    id: "anaphylaxis",
    title: "Severe allergic reaction (anaphylaxis)",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published allergy-emergency guidance.",
    summary: "Trouble breathing or fainting after exposure to an allergen is an emergency — use an epinephrine auto-injector immediately and call for help.",
    sections: [
      {
        heading: "Signs of anaphylaxis",
        bullets: [
          "Swelling of lips, tongue, or throat; hives over the body; trouble breathing or a tight airway.",
          "Sudden weakness, dizziness, vomiting, or collapse after eating a food, taking a drug, or an insect sting."
        ]
      },
      {
        heading: "What to do",
        bullets: [
          "Use the person's epinephrine auto-injector immediately into the outer thigh, through clothing if needed.",
          "Call the emergency number even if symptoms improve — a second reaction can occur hours later.",
          "Help the person lie flat with legs raised unless breathing is easier sitting up."
        ]
      }
    ],
    warnings: [
      "Antihistamines alone do not treat anaphylaxis — epinephrine comes first."
    ]
  },
  {
    id: "hypothermia-heatstroke",
    title: "Hypothermia and heat stroke",
    category: "Medical",
    review_date: "2026-10-01",
    source_note: "Aligns with widely published environmental-emergency guidance.",
    summary: "Both hypothermia and heat stroke are emergencies: warm a hypothermic person gradually; cool a heat-stroke person fast.",
    sections: [
      {
        heading: "Hypothermia (dangerous cooling)",
        bullets: [
          "Signs: uncontrolled shivering, slurred speech, confusion, drowsiness.",
          "Move the person somewhere warm, remove wet clothing, and insulate with dry layers and a blanket.",
          "Warm the core gradually — trunk, neck, armpits, groin; give warm sweet drinks only if fully alert.",
          "Handle gently and call the emergency number for any moderate or severe case."
        ]
      },
      {
        heading: "Heat stroke (dangerous overheating)",
        bullets: [
          "Signs: very hot skin, confusion, agitation, fainting, skin that may be dry or sweaty.",
          "Move to shade or air conditioning and call the emergency number immediately.",
          "Cool aggressively: wet the skin, fan continuously, apply ice packs to armpits, neck, and groin.",
          "Do not give fluids if the person is confused or not fully alert."
        ]
      }
    ],
    warnings: [
      "Do not rub a hypothermic person's limbs or warm them with direct high heat like hot bath water."
    ]
  },
  {
    id: "road-accident",
    title: "Road accident — helping at the scene",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published roadside first-aid guidance.",
    summary: "Make the scene safe, call 112 and 108 immediately, and do not move casualties unless there is fire or imminent danger.",
    sections: [
      {
        heading: "Secure the scene first",
        bullets: [
          "Park safely out of traffic with hazard lights on before getting out; do not run across live lanes.",
          "Ask a bystander to warn oncoming traffic or place a warning triangle if available.",
          "Switch off the ignitions of vehicles involved if you can reach them safely."
        ]
      },
      {
        heading: "Care for casualties",
        bullets: [
          "Call 112 for police and 108 for an ambulance in India (911/112/999 elsewhere); state location and number of injured.",
          "Check each person: are they conscious and breathing normally? Treat anyone not breathing first.",
          "Control visible bleeding with firm direct pressure using a clean cloth.",
          "Keep injured people warm and still; talk calmly and do not give them food or water.",
          "Do not remove a motorcycle helmet unless the rider is not breathing — removing it can worsen a spine injury."
        ]
      }
    ],
    warnings: [
      "Assume anyone unconscious, thrown from a vehicle, or hit hard has a spine injury — do not move them unless there is fire or traffic danger."
    ]
  },
  {
    id: "snake-bite-stings",
    title: "Snake bite, scorpion and insect stings",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published envenomation first-aid guidance; India-relevant.",
    summary: "Keep the bitten person calm and still, immobilize the limb, and get to a hospital for anti-venom — never use tourniquets, cutting or sucking.",
    sections: [
      {
        heading: "Snake bite — do this",
        bullets: [
          "Keep the person calm and completely still; movement pumps venom through the body faster.",
          "Call 108 for an ambulance or arrange immediate transport to the nearest hospital with anti-venom.",
          "Immobilize the bitten limb with a splint at or below heart level; remove rings, watches and tight clothing.",
          "Wash the wound with plain water and cover it lightly; note the time of the bite.",
          "If safe, photograph the snake from a distance — never carry a live or dead snake to hospital."
        ]
      },
      {
        heading: "Never do these",
        bullets: [
          "Do not apply a tourniquet or tight band, cut or suck the wound, or apply ice or herbs.",
          "Do not give painkillers, alcohol, or anything by mouth."
        ]
      },
      {
        heading: "Scorpion and insect stings",
        bullets: [
          "Wash the sting site with soap and water and apply a cold compress for 10 minutes.",
          "Watch for difficulty breathing, drooling, muscle twitching or numbness — go to hospital immediately if any appear.",
          "Any scorpion sting to a small child needs hospital assessment, even if the child seems fine."
        ]
      }
    ],
    warnings: [
      "In India, treat every snake bite as venomous — go to hospital even when there are no symptoms yet."
    ]
  },
  {
    id: "electrocution",
    title: "Electrical injury (electrocution)",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published electrical-injury guidance.",
    summary: "Cut the power before touching the person — then check breathing, start CPR if needed, and treat burn sites with cool water.",
    sections: [
      {
        heading: "Make it safe first",
        bullets: [
          "Switch off the main power or the appliance at the socket before approaching the person.",
          "Never touch the person while they are still in contact with the electricity source.",
          "If you cannot switch off power, move the source away using a dry, non-conductive item such as a wooden pole or plastic chair.",
          "For downed high-voltage lines, stay at least 10 meters away, keep others back, and call the power authority and emergency number."
        ]
      },
      {
        heading: "Then treat the person",
        bullets: [
          "Call 112 / 108 immediately — electrical current can stop the heart without visible injury.",
          "Check breathing; if absent or abnormal, start CPR and send someone for an AED.",
          "Cool burn wounds (entry and exit points) with cool running water, then cover loosely with a clean cloth.",
          "Every electrical injury needs a hospital check, even if the person feels fine."
        ]
      }
    ],
    warnings: [
      "Water and metal conduct electricity — never touch a person who is wet and in contact with current."
    ]
  },
  {
    id: "drowning",
    title: "Drowning rescue and first aid",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published drowning first-aid guidance.",
    summary: "Reach or throw — do not walk into deep water yourself. Once out, check breathing, start CPR if needed, and keep the person warm.",
    sections: [
      {
        heading: "Getting the person out",
        bullets: [
          "Reach with a pole, branch or rope, or throw a float or empty sealed container — only enter the water if you are trained.",
          "Call 108 / 112 for an ambulance as soon as the person is out or while rescuing on speaker."
        ]
      },
      {
        heading: "First aid after rescue",
        bullets: [
          "Check for breathing; if absent or abnormal, start CPR — for drowning, rescue breaths matter, so give them if you are trained.",
          "If breathing, place the person in the recovery position on their side to drain water and protect the airway.",
          "Remove wet clothing, cover with dry layers, and keep the person warm and still."
        ]
      }
    ],
    warnings: [
      "Take every rescued person to hospital even if they appear fully recovered — delayed lung complications can follow drowning."
    ]
  },
  {
    id: "child-infant",
    title: "Children and infants — choking and CPR differences",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published pediatric first-aid guidance.",
    summary: "Infants under 1 year get back blows and chest thrusts — never abdominal thrusts; child CPR uses one hand and gentler depth.",
    sections: [
      {
        heading: "Infant choking (under 1 year)",
        bullets: [
          "Support the infant face-down along your forearm, head lower than chest, and give 5 firm back blows between the shoulder blades.",
          "Turn them face-up on your arm and give 5 chest thrusts with two fingers on the breastbone just below the nipple line.",
          "Alternate 5 back blows and 5 chest thrusts until the object clears or the infant becomes unconscious — then call emergency services and start infant CPR.",
          "Never use abdominal thrusts on an infant."
        ]
      },
      {
        heading: "Child CPR differences (1 year to puberty)",
        bullets: [
          "Push with the heel of one hand only, about 5 cm deep, at 100–120 per minute.",
          "If trained, use 30 compressions to 2 rescue breaths; untrained rescuers should do continuous compressions.",
          "Call emergency services after 1 minute of CPR if you are alone with the child."
        ]
      }
    ],
    warnings: [
      "Prevention beats rescue: cut grapes and nuts for small children and keep button batteries and small toys out of reach."
    ]
  },
  {
    id: "animal-bites",
    title: "Animal bites — dogs, monkeys, cats",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published bite-wound and rabies-post-exposure guidance; India-relevant.",
    summary: "Wash an animal bite under running water with soap for at least 15 minutes and go to a hospital the same day — rabies is fatal once symptoms start, but preventable by vaccine.",
    sections: [
      {
        heading: "Immediate care",
        bullets: [
          "Wash the wound under running water with soap for at least 15 minutes, even if it looks small.",
          "Apply an antiseptic if available and cover with a clean dressing.",
          "Press with a clean cloth if the wound is bleeding.",
          "Go to a hospital the same day for rabies vaccine assessment and a tetanus check — start the vaccine course exactly as scheduled."
        ]
      },
      {
        heading: "Know the risk",
        bullets: [
          "Any mammal bite — dog, monkey, cat, bat, rat — can carry rabies; unprovoked or unusual behavior in the animal raises suspicion.",
          "Bites on the face, hands, or near the head are higher risk and need urgent attention.",
          "If the animal can be safely observed, note its behavior for the doctor; never handle or kill it with bare hands."
        ]
      }
    ],
    warnings: [
      "Do not skip vaccine doses once started, and never rely on traditional remedies — rabies has no cure after symptoms appear."
    ]
  },
  {
    id: "fractures-sprains",
    title: "Broken bones, fractures and sprains",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published musculoskeletal first-aid guidance.",
    summary: "Immobilize a suspected broken bone exactly as found, apply cold packs for swelling, and get an X-ray — never try to straighten or set the limb yourself.",
    sections: [
      {
        heading: "First response",
        bullets: [
          "Keep the limb completely still in the position it was found; support it with a cushion, rolled cloth, or a splint tied above and below the injury.",
          "Apply a cold pack or bag of ice wrapped in cloth for 15–20 minutes to reduce swelling.",
          "Call the emergency number if the bone is visible through skin, the limb looks deformed, numb, or bluish, or the injury came from a fall from height or a road accident."
        ]
      },
      {
        heading: "What not to do",
        bullets: [
          "Do not straighten, realign, or force the limb into a normal position.",
          "Do not give the person anything to eat or drink if surgery may be needed.",
          "For a suspected spine or neck injury, do not move the person at all — call for an ambulance."
        ]
      }
    ],
    warnings: [
      "A deformed, numb, or cold limb after injury is an emergency — go to hospital immediately."
    ]
  },
  {
    id: "head-injury",
    title: "Head injury — bump, fall or blow to the head",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published concussion first-aid guidance.",
    summary: "After any head injury, watch closely for vomiting, drowsiness, confusion, or unequal pupils — these mean emergency care, even if the person seemed fine at first.",
    sections: [
      {
        heading: "First response",
        bullets: [
          "Have the person rest quietly and apply a cold pack to the bump for 15–20 minutes.",
          "Call the emergency number if the person was knocked out, even briefly, or fell from height or in a road accident.",
          "Keep checking them for the next 24 hours for worsening symptoms."
        ]
      },
      {
        heading: "Danger signs — call immediately",
        bullets: [
          "Repeated vomiting, increasing drowsiness, confusion, slurred speech, or a seizure.",
          "One pupil larger than the other, blood or clear fluid from the nose or ears, or weakness on one side.",
          "Any head injury in a baby, an elderly person, or someone on blood thinners needs medical assessment."
        ]
      }
    ],
    warnings: [
      "Symptoms of serious head injury can appear hours later — do not leave the person alone and do not let them sleep it off unwatched."
    ]
  },
  {
    id: "fainting",
    title: "Fainting — someone suddenly collapses",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published syncope first-aid guidance.",
    summary: "Lay a fainted person flat and raise their legs, keep the airway open, and treat it as an emergency if recovery is slow, if they are injured, or if there is no clear trigger.",
    sections: [
      {
        heading: "If someone faints",
        bullets: [
          "Lay the person flat on their back and raise their legs about 30 cm to restore blood flow to the brain.",
          "Loosen tight clothing and ensure fresh air; check that they are breathing.",
          "If they do not wake within about one minute, are not breathing normally, or fell and may be injured, call the emergency number."
        ]
      },
      {
        heading: "When waking up",
        bullets: [
          "Let them stay lying down for 10–15 minutes, then sit up slowly; give water only once fully alert.",
          "A quick faint after standing up, heat, or a shock is usually harmless — but any fainting with chest pain, palpitations, confusion, or during exercise needs hospital assessment."
        ]
      }
    ],
    warnings: [
      "Fainting is different from a seizure — jerking, tongue biting, or lasting over a minute means treat as a seizure and call for help."
    ]
  },
  {
    id: "asthma-attack",
    title: "Asthma attack — severe breathing trouble",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published asthma first-aid guidance.",
    summary: "Sit the person upright, help them use their reliever inhaler, and call for an ambulance if speech is broken, lips turn blue, or the inhaler does not help.",
    sections: [
      {
        heading: "What to do",
        bullets: [
          "Keep the person sitting upright — never lay them down — and reassure them calmly.",
          "Help them take their reliever inhaler (usually blue): 1 puff every 30–60 seconds, up to 10 puffs, using a spacer if available.",
          "Loosen tight clothing and move away from smoke, dust, or strong smells if possible."
        ]
      },
      {
        heading: "Call the emergency number if",
        bullets: [
          "The inhaler has no effect, symptoms return quickly, or there is no inhaler available.",
          "The person cannot finish a sentence in one breath, lips or fingertips turn blue, or they are exhausted or confused."
        ]
      }
    ],
    warnings: [
      "A silent chest — very little breath movement — in an asthma attack is life-threatening; call immediately."
    ]
  },
  {
    id: "minor-wounds-nosebleed",
    title: "Minor cuts and nosebleeds",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published wound-care guidance.",
    summary: "Wash small wounds, press for 10 minutes without peeking, and lean forward for a nosebleed — seek help only for deep, gaping, or non-stop bleeding.",
    sections: [
      {
        heading: "Small cuts and grazes",
        bullets: [
          "Wash your hands, then rinse the wound under clean running water; remove dirt around it, do not scrub deep.",
          "Press with a clean cloth for 10 minutes without lifting to peek; cover with a plaster or clean dressing once bleeding stops.",
          "A deep, gaping, gaping or dirty wound — especially from rust, glass, or an animal — needs a doctor for closure, tetanus, and infection risk."
        ]
      },
      {
        heading: "Nosebleed",
        bullets: [
          "Sit down, lean the head FORWARD, and pinch the soft part of the nose firmly for 10 continuous minutes.",
          "Breathe through the mouth, spit out any blood, and do not check too early — repeat the 10 minutes if it restarts.",
          "Go to hospital if bleeding runs past 20–30 minutes, follows a head injury, or keeps recurring."
        ]
      }
    ],
    warnings: [
      "Never tilt the head back for a nosebleed — swallowed blood causes nausea and vomiting."
    ]
  },
  {
    id: "low-blood-sugar",
    title: "Low blood sugar (hypoglycemia) in diabetes",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published hypoglycemia first-aid guidance.",
    summary: "A shaky, sweaty, confused diabetic person needs fast sugar — juice, glucose, or sugar cubes — followed by a snack; unconsciousness means emergency services immediately.",
    sections: [
      {
        heading: "If the person is conscious",
        bullets: [
          "Give fast sugar immediately: 3–4 teaspoons of sugar, glucose tablets, half a glass of juice, or a soft drink (not diet).",
          "Repeat after 10–15 minutes if they do not improve, then follow with a snack like biscuits or bread.",
          "If they carry insulin or medication, remind them — but never inject insulin yourself."
        ]
      },
      {
        heading: "If the person is unconscious or cannot swallow",
        bullets: [
          "Call the emergency number immediately, place nothing in the mouth, and turn them into the recovery position.",
          "Check breathing and start CPR if breathing stops or becomes abnormal."
        ]
      }
    ],
    warnings: [
      "Never give food or drink to a drowsy or unconscious diabetic — choking risk comes first."
    ]
  },
  {
    id: "panic-attack",
    title: "Panic attack — sudden intense fear and fast breathing",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published panic-attack support guidance.",
    summary: "A panic attack feels terrifying but passes: stay with the person, breathe with them slowly, and get medical help only if chest pain or symptoms do not settle.",
    sections: [
      {
        heading: "Helping through it",
        bullets: [
          "Stay calm and stay with them; speak in short, simple sentences and do not say 'calm down'.",
          "Guide slow breathing: in for 4 counts, out for 6, and name five things they can see to ground attention.",
          "Move them to a quiet space, loosen tight clothing, and offer water once breathing settles."
        ]
      },
      {
        heading: "When it is more than panic",
        bullets: [
          "Call the emergency number for chest pain that spreads, fainting, or if symptoms last unusually long or keep returning.",
          "A first-ever 'panic attack' should be checked by a doctor — other causes must be ruled out."
        ]
      }
    ],
    warnings: [
      "Never dismiss repeating panic attacks — recurring episodes deserve proper medical and psychological care."
    ]
  },
  {
    id: "eye-injury",
    title: "Eye injuries — splashes, cuts and embedded objects",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published eye first-aid guidance.",
    summary: "Flush chemical splashes with water for 20 minutes, never rub, and never remove anything stuck in the eye — cover it and go to hospital.",
    sections: [
      {
        heading: "Chemical splash",
        bullets: [
          "Flush the open eye with clean lukewarm water for at least 20 minutes, holding the eyelid open and turning the head so water runs away from the other eye.",
          "Remove contact lenses while flushing if easy, and go to hospital afterwards."
        ]
      },
      {
        heading: "Cut, object stuck, or blow to the eye",
        bullets: [
          "Never rub the eye and never try to remove anything embedded — cover the eye with a paper cup or clean cloth without pressure.",
          "Cover BOTH eyes to stop the injured eye moving, keep the person calm, and go to hospital immediately.",
          "For a black eye from a blow, a cold pack helps — but vision changes need same-day assessment."
        ]
      }
    ],
    warnings: [
      "Do not let the person drive themselves — vision may be affected; arrange transport."
    ]
  },
  {
    id: "embedded-object",
    title: "Embedded objects and penetrating wounds",
    category: "Medical",
    review_date: "2026-11-12",
    source_note: "Aligns with widely published penetrating-injury first-aid guidance.",
    summary: "If a knife, glass, rod, or arrow is stuck in the body, do not remove it — stabilize it in place with padding and call the emergency number.",
    sections: [
      {
        heading: "Stabilize, never remove",
        bullets: [
          "Call the emergency number immediately and keep the person still and calm.",
          "Build padding around the object with clean cloth until it cannot move, then bandage over it without pressing down.",
          "Control bleeding around the object with firm pressure on the surrounding area, not on the object itself."
        ]
      },
      {
        heading: "While waiting for the ambulance",
        bullets: [
          "Keep the person warm, still, and awake if possible; do not give food or water.",
          "If the person becomes unconscious and stops breathing normally, start CPR carefully beside the object."
        ]
      }
    ],
    warnings: [
      "Removing an embedded object can release fatal internal bleeding — only professionals remove it, in an operating room."
    ]
  }
];
