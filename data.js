(() => {
  const defaultProtocols = [
    {
      id: 'card-10',
      name: 'Card 10: Chest Pain (Non-Traumatic)',
      summary: 'Investigate cardiac red flags, aspirin, and transport priority.',
      entry: 'card-10.entry',
      category: 'Medical'
    },
    {
      id: 'card-69',
      name: 'Card 69: Structure Fire',
      summary: 'Size-up smoke, entrapment, and hazards prior to dispatch.',
      entry: 'card-69.entry',
      category: 'Fire'
    },
    {
      id: 'card-traffic',
      name: 'Card 29: Motor Vehicle Accident',
      summary: 'Determine injuries, entrapment, hazards, and traffic safety needs.',
      entry: 'card-traffic.entry',
      category: 'Police / EMS'
    },
    {
      id: 'card-wires',
      name: 'Card 55: Wires Down',
      summary: 'Downed wires, arcing, and scene safety for public and responders.',
      entry: 'card-wires.entry',
      category: 'Fire / Utilities'
    },
    {
      id: 'card-industrial',
      name: 'Card 77: Workplace Industrial Accident',
      summary: 'Serious injuries, machinery entrapment, and hazardous materials.',
      entry: 'card-industrial.entry',
      category: 'Rescue / EMS'
    }
  ];

  const baseQuestions = {
    'card-10.entry': {
      prompt: 'Tell me exactly what happened.',
      detail: 'Capture chief complaint to confirm chest pain and screen for trauma.',
      answers: [
        { label: 'Adult with chest tightness, no injury', next: 'card-10.abcs', aliases: ['medical', 'non trauma', 'nt'] },
        { label: 'Chest pain after fall or trauma', next: 'card-10.trauma', aliases: ['trauma', 'injury'] },
        { label: 'Unconscious or not breathing effectively', next: 'card-10.cpr', aliases: ['cpr', 'unconscious'] }
      ]
    },
    'card-10.abcs': {
      prompt: 'Is the patient breathing normally?',
      detail: 'Check for effective respirations to rule out respiratory arrest.',
      answers: [
        { label: 'Yes, breathing normally', next: 'card-10.color', aliases: ['yes', 'normal'] },
        { label: 'No / barely breathing', next: 'card-10.cpr', aliases: ['no', 'poor', 'apnea'] }
      ],
      action: 'If breathing is abnormal, prepare to coach assisted ventilations or CPR.'
    },
    'card-10.color': {
      prompt: 'Is the patient awake and able to speak?',
      detail: 'Assess perfusion and mental status for priority symptoms.',
      answers: [
        { label: 'Awake and speaking', next: 'card-10.onset', aliases: ['awake', 'alert'] },
        { label: 'Faint / difficult to wake', next: 'card-10.priority', aliases: ['faint', 'unresponsive'] }
      ]
    },
    'card-10.onset': {
      prompt: 'When did the pain start and is it getting worse?',
      detail: 'Establish onset for potential STEMI and transport decisions.',
      answers: [
        { label: 'Sudden onset within 2 hours', next: 'card-10.aspirin' },
        { label: 'Gradual or intermittent', next: 'card-10.aspirin' }
      ]
    },
    'card-10.aspirin': {
      prompt: 'Has the patient taken aspirin today?',
      detail: 'Follow agency protocol for aspirin administration if allowed.',
      answers: [
        { label: 'No or unknown', next: 'card-10.give-aspirin' },
        { label: 'Yes, already took', next: 'card-10.nitro' }
      ]
    },
    'card-10.give-aspirin': {
      prompt: 'Is the patient allergic to aspirin or under 16 years old?',
      detail: 'Contraindications for aspirin administration.',
      answers: [
        { label: 'No allergy and age 16+', next: 'card-10.nitro' },
        { label: 'Allergy / under 16 / unsure', next: 'card-10.nitro' }
      ],
      action: 'If agency approved, have patient chew 325mg aspirin unless contraindicated.'
    },
    'card-10.nitro': {
      prompt: 'Does the patient have prescribed nitroglycerin?',
      detail: 'Check for self-administered meds and contraindications.',
      answers: [
        { label: 'Yes, and blood pressure adequate', next: 'card-10.history' },
        { label: 'No or low blood pressure/dizziness', next: 'card-10.history' }
      ],
      action: 'Advise to follow prescribing guidance, seated position, and wait for responders.'
    },
    'card-10.history': {
      prompt: 'Any cardiac history or implanted devices?',
      detail: 'Collect history for responders (stents, pacemaker, prior MI).',
      textEntry: {
        label: 'Describe cardiac history',
        placeholder: 'E.g., prior MI, stents, pacemaker, meds',
        next: 'card-10.priority'
      },
      answers: [
        { label: 'History provided', next: 'card-10.priority' },
        { label: 'No history / unknown', next: 'card-10.priority' }
      ],
      action: 'Reassure caller, keep patient calm, limit exertion, and prepare for transport.'
    },
    'card-10.priority': {
      prompt: 'Dispatch priority',
      answers: [],
      outcome: 'Send closest ALS. Monitor airway and prepare for CPR instructions if condition worsens.'
    },
    'card-10.cpr': {
      prompt: 'Begin CPR instructions immediately',
      answers: [],
      outcome: 'Start compressions, 100-120/min. Continue until responders take over.'
    },
    'card-10.trauma': {
      prompt: 'Redirect to trauma protocol',
      answers: [],
      outcome: 'Switch to appropriate trauma card and request additional resources.'
    },

    'card-69.entry': {
      prompt: 'What exactly is burning?',
      detail: 'Determine structure type and hazards.',
      answers: [
        { label: 'House or apartment', next: 'card-69.occupancy' },
        { label: 'Commercial / industrial', next: 'card-69.hazmat' },
        { label: 'Vegetation / wildland', next: 'card-69.wildland' }
      ]
    },
    'card-69.occupancy': {
      prompt: 'Is anyone trapped or unable to evacuate?',
      detail: 'Identify entrapment for rescue assignment.',
      answers: [
        { label: 'Yes, people trapped', next: 'card-69.rescue' },
        { label: 'No, everyone outside', next: 'card-69.exposures' },
        { label: 'Unknown', next: 'card-69.exposures' }
      ]
    },
    'card-69.rescue': {
      prompt: 'Number of people trapped and location?',
      detail: 'Gather critical information for first-arriving companies.',
      answers: [
        { label: 'Provide details', next: 'card-69.smoke' },
        { label: 'Information unavailable', next: 'card-69.smoke' }
      ],
      action: 'Advise occupants to close doors, stay low, and await rescue if trapped.'
    },
    'card-69.smoke': {
      prompt: 'What color and amount of smoke?',
      detail: 'Dark pressurized smoke indicates advanced fire conditions.',
      answers: [
        { label: 'Heavy dark smoke', next: 'card-69.exposures' },
        { label: 'Light or white smoke', next: 'card-69.exposures' }
      ]
    },
    'card-69.exposures': {
      prompt: 'Any hazards like gas leaks, weapons, or downed wires?',
      detail: 'Safety concerns that change staging distance and PPE.',
      answers: [
        { label: 'Hazards present', next: 'card-69.water' },
        { label: 'No hazards reported', next: 'card-69.water' }
      ]
    },
    'card-69.water': {
      prompt: 'Is there a hydrant or water supply nearby?',
      detail: 'Supports water-on-wheels vs hydrant operations.',
      answers: [
        { label: 'Hydrant located', next: 'card-69.priority' },
        { label: 'No hydrant / unsure', next: 'card-69.priority' }
      ]
    },
    'card-69.hazmat': {
      prompt: 'Is this a known chemical or hazmat facility?',
      detail: 'Flags for hazmat response level and isolation distance.',
      answers: [
        { label: 'Yes / suspected', next: 'card-69.evacuations' },
        { label: 'No', next: 'card-69.evacuations' }
      ],
      action: 'Keep caller at a safe distance; avoid attempting to extinguish industrial fires.'
    },
    'card-69.evacuations': {
      prompt: 'Has anyone started evacuations or shelter-in-place?',
      detail: 'Triggers alerts for multi-company response and notifications.',
      answers: [
        { label: 'Evacuations in progress', next: 'card-69.priority' },
        { label: 'No evacuations yet', next: 'card-69.priority' }
      ]
    },
    'card-69.wildland': {
      prompt: 'How close is the fire to structures or people?',
      detail: 'Evaluates threat to life and property for evacuations.',
      answers: [
        { label: '< 1/4 mile or impacting structures', next: 'card-69.winds' },
        { label: 'Distant from structures', next: 'card-69.winds' }
      ],
      action: 'Advise caller to move upwind and prepare to evacuate if conditions change.'
    },
    'card-69.winds': {
      prompt: 'What are the winds like?',
      detail: 'Wind shifts inform spread potential and staging.',
      answers: [
        { label: 'Windy or shifting', next: 'card-69.priority' },
        { label: 'Calm / light breeze', next: 'card-69.priority' }
      ]
    },
    'card-69.priority': {
      prompt: 'Dispatch priority',
      answers: [],
      outcome: 'Send full first-alarm assignment. Provide staging location and confirm hydrant availability.'
    },

    'card-traffic.entry': {
      prompt: 'Tell me exactly what happened and how many vehicles are involved.',
      detail: 'Determine collision type and scale.',
      answers: [
        { label: 'Single vehicle', next: 'card-traffic.hazards' },
        { label: 'Multiple vehicles', next: 'card-traffic.injuries' },
        { label: 'Rollover or ejection reported', next: 'card-traffic.extrication' }
      ]
    },
    'card-traffic.injuries': {
      prompt: 'How many people are injured?',
      detail: 'Prioritize EMS resources.',
      answers: [
        { label: 'No obvious injuries', next: 'card-traffic.hazards' },
        { label: '1-2 injured', next: 'card-traffic.hazards' },
        { label: '3 or more injured', next: 'card-traffic.mci' }
      ]
    },
    'card-traffic.hazards': {
      prompt: 'Any hazards like fuel leaks, fire, or power lines down?',
      detail: 'Flags for fire response and scene safety.',
      answers: [
        { label: 'Fuel leak or fire', next: 'card-traffic.fire' },
        { label: 'Power lines down', next: 'card-wires.entry' },
        { label: 'No hazards reported', next: 'card-traffic.priority' }
      ]
    },
    'card-traffic.extrication': {
      prompt: 'Is anyone trapped or unable to get out?',
      detail: 'Determines need for rescue companies.',
      answers: [
        { label: 'Yes, people trapped', next: 'card-traffic.mci' },
        { label: 'No entrapment', next: 'card-traffic.hazards' }
      ],
      action: 'Advise patients to remain still unless unsafe. Keep caller at a safe distance from traffic.'
    },
    'card-traffic.mci': {
      prompt: 'Declare mass casualty and stage additional resources.',
      answers: [],
      outcome: 'Dispatch multiple EMS units, rescue, and traffic control. Establish triage and staging areas.'
    },
    'card-traffic.fire': {
      prompt: 'Is the fire threatening occupants or spreading?',
      answers: [
        { label: 'Fire near occupants', next: 'card-traffic.priority' },
        { label: 'Fire contained / small', next: 'card-traffic.priority' }
      ],
      action: 'Keep everyone away from the vehicles. Do not attempt to extinguish if unsafe.'
    },
    'card-traffic.priority': {
      prompt: 'Dispatch priority',
      answers: [],
      outcome: 'Send law enforcement for traffic control and EMS/fire as indicated. Provide blocking instructions to callers if safe.'
    },

    'card-wires.entry': {
      prompt: 'What is down and where is it located?',
      detail: 'Identify utility hazards and exposure risks.',
      answers: [
        { label: 'Power line across roadway', next: 'card-wires.traffic' },
        { label: 'Wire on building or vehicle', next: 'card-wires.contact' },
        { label: 'Lines arcing or sparking', next: 'card-wires.arcing' }
      ]
    },
    'card-wires.traffic': {
      prompt: 'Is traffic able to avoid the wires safely?',
      detail: 'Determine need for immediate road closure.',
      answers: [
        { label: 'Traffic blocked / unsafe', next: 'card-wires.priority' },
        { label: 'Caller providing warning', next: 'card-wires.priority' }
      ],
      action: 'Keep callers and bystanders back at least 30 feet. Do not touch fences or guardrails connected to wires.'
    },
    'card-wires.contact': {
      prompt: 'Is anyone touching or inside something in contact with the wire?',
      detail: 'Life safety guidance for energized contacts.',
      answers: [
        { label: 'Person/vehicle in contact', next: 'card-wires.stay' },
        { label: 'No contact', next: 'card-wires.priority' }
      ]
    },
    'card-wires.stay': {
      prompt: 'Keep them inside the vehicle/building until responders arrive.',
      answers: [],
      outcome: 'Advise to avoid touching metal surfaces and await responders. Keep others away from scene.'
    },
    'card-wires.arcing': {
      prompt: 'Describe the arcing or fire activity.',
      detail: 'Informs fire response and utility notification.',
      answers: [
        { label: 'Active fire', next: 'card-wires.priority' },
        { label: 'Sparks only', next: 'card-wires.priority' }
      ],
      action: 'Keep everyone well clear. Do not spray water or attempt to move wires.'
    },
    'card-wires.priority': {
      prompt: 'Dispatch priority',
      answers: [],
      outcome: 'Notify utility, dispatch fire/police for scene safety and road control.'
    },

    'card-industrial.entry': {
      prompt: 'What happened and what type of machinery or materials are involved?',
      detail: 'Establish mechanism and potential hazards.',
      answers: [
        { label: 'Machinery entrapment', next: 'card-industrial.entrapment' },
        { label: 'Fall or blunt trauma', next: 'card-industrial.injuries' },
        { label: 'Chemical exposure', next: 'card-industrial.hazmat' }
      ]
    },
    'card-industrial.entrapment': {
      prompt: 'Is the patient trapped or pinned?',
      detail: 'Determine rescue resources needed.',
      answers: [
        { label: 'Yes, trapped', next: 'card-industrial.rescue' },
        { label: 'No entrapment', next: 'card-industrial.injuries' }
      ],
      action: 'Do not attempt to dismantle machinery. Shut down power if safe and wait for responders.'
    },
    'card-industrial.rescue': {
      prompt: 'What part of the body is trapped and for how long?',
      detail: 'Guides extrication and potential crush injury treatment.',
      answers: [
        { label: 'Limb trapped', next: 'card-industrial.priority' },
        { label: 'Torso/head trapped', next: 'card-industrial.priority' }
      ],
      action: 'Keep patient calm, stop machinery, and avoid moving heavy components without responders.'
    },
    'card-industrial.injuries': {
      prompt: 'Describe the injuries and bleeding.',
      detail: 'Identify life threats requiring tourniquet or airway support.',
      answers: [
        { label: 'Severe bleeding', next: 'card-industrial.bleeding' },
        { label: 'No severe bleeding', next: 'card-industrial.priority' }
      ]
    },
    'card-industrial.bleeding': {
      prompt: 'Can someone apply direct pressure or a tourniquet?',
      detail: 'Provide immediate hemorrhage control instructions.',
      answers: [
        { label: 'Pressure/tourniquet applied', next: 'card-industrial.priority' },
        { label: 'Unable to control bleeding', next: 'card-industrial.priority' }
      ],
      action: 'Use clean cloth for firm pressure. Apply tourniquet 2-3 inches above wound if trained.'
    },
    'card-industrial.hazmat': {
      prompt: 'What chemical or substance is involved and is anyone exposed?',
      detail: 'Inform decontamination and hazmat response level.',
      answers: [
        { label: 'Known substance', next: 'card-industrial.priority' },
        { label: 'Unknown substance', next: 'card-industrial.priority' }
      ],
      action: 'Isolate area, avoid inhalation, and remove to fresh air if safe.'
    },
    'card-industrial.priority': {
      prompt: 'Dispatch priority',
      answers: [],
      outcome: 'Send rescue, fire, and EMS. Provide entry instructions and ensure lockout/tagout if possible.'
    }
  };

  function withCopyDefaults(rawQuestions = {}) {
    const hydrated = {};
    Object.entries(rawQuestions).forEach(([id, question]) => {
      const copy = { ...question };
      copy.copyPrompt = question.copyPrompt || question.prompt || '';
      copy.links = Array.isArray(question.links) ? question.links : [];
      if (question.textEntry) {
        copy.textEntry = { ...question.textEntry };
      }
      copy.answers = (question.answers || []).map((answer) => ({
        ...answer,
        aliases: Array.isArray(answer.aliases) ? answer.aliases : [],
        copyText: answer.copyText || answer.label || ''
      }));
      hydrated[id] = copy;
    });
    return hydrated;
  }

  const defaultQuestions = withCopyDefaults(baseQuestions);

  function cloneDefaults() {
    return {
      protocols: JSON.parse(JSON.stringify(defaultProtocols)),
      questions: JSON.parse(JSON.stringify(defaultQuestions))
    };
  }

  function loadData() {
    const { protocols, questions } = cloneDefaults();
    try {
      const storedProtocols = localStorage.getItem('protocols');
      const storedQuestions = localStorage.getItem('questions');
      return {
        protocols: storedProtocols ? JSON.parse(storedProtocols) : protocols,
        questions: storedQuestions ? withCopyDefaults(JSON.parse(storedQuestions)) : questions
      };
    } catch (err) {
      console.warn('Failed to parse stored data, using defaults', err);
      return { protocols, questions };
    }
  }

  function saveData(protocols, questions) {
    localStorage.setItem('protocols', JSON.stringify(protocols));
    localStorage.setItem('questions', JSON.stringify(questions));
  }

  function resetData() {
    const { protocols, questions } = cloneDefaults();
    saveData(protocols, questions);
    return { protocols, questions };
  }

  window.dataStore = {
    defaultProtocols,
    defaultQuestions,
    withCopyDefaults,
    cloneDefaults,
    loadData,
    saveData,
    resetData
  };
})();
