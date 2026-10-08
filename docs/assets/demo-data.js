/* ============================================================================
   DEMO DATA — derived from a real IsotopeAI backup snapshot
   ============================================================================
   PROVENANCE. Every value below was computed from
   `isotope-backup-2026-10-08.json`, a genuine IsotopeAI export (1.8 MB,
   195 sessions, 32 tasks, 3 subjects, 92 daily logs), taken 2026-10-08 from the
   demo workspace that ships with the app. This file is the derivative: 9.6 KB
   carrying the aggregates, the real syllabus, the real task titles and the last
   fortnight of sessions. It is NOT the backup, and it is not a live account.

   WHY A .js FILE RATHER THAN .json. The page loads it with a plain <script>
   before dashboard.js, so the demo works from `file://`, from a stale cache
   and offline — which matters for a docs page, and which a fetch() of a
   sibling JSON cannot promise. It also means no network request and no CORS
   question on GitHub Pages.

   ── What was deliberately NOT carried over ─────────────────────────────────
   A backup export is a whole user profile, so most of it does not belong on a
   public page. Dropped at the point of extraction:

     profile.name / profile.username  the persona is "Arnav Demo" /
                                     "jee-ranker-demo". Even though this is a
                                     shipped demo persona rather than a private
                                     person, the page renders a generic
                                     "Sample user" instead — a public page has
                                     no business printing a name.
     profile.id                       "demo-jee-ranker" — internal identifier.
     profile.avatar, settings, onboarding, swot, preferences
                                     account configuration, not study content.
     sessions[].notes                 195 identical boilerplate strings
                                     ("Solved targeted Physics questions and
                                     tagged weak spots for revision.").
                                     Free-text fields are where a real person's
                                     writing would leak, so the field is not
                                     carried even though this corpus happens to
                                     be machine-generated and harmless.
     sessions[].description           53 distinct free-text strings.
     dailyLogs[].notes, mood, sleepHours, sleepQuality
                                     per-day journaling — personal, and
                                     uninteresting here.
     habits, tests, exams, mockTests   not shown in the demo.
     ids                              every uuid and slug.

   VERIFIED: the export contains no email address anywhere (regex sweep over
   all 1.8 MB returned zero matches), and `profile` has no email field at all.

   ── Units ─────────────────────────────────────────────────────────────────
   `sessions[].duration` is MINUTES in the export, matching
   study_sessions_log.duration_minutes (numeric) and focus_sessions.duration
   (integer, seconds at the app boundary). Everything below has been converted
   to seconds on the way in, because every column the demo displays —
   total_study_seconds, seconds_studied, weekly_hours — is in seconds.
   ========================================================================= */

window.ISOTOPE_DEMO =   {
    "snapshot": "2026-10-08",
    "appVersion": "0.9.0",
    "source": "isotopeai",
    "streak": 92,
    "totalMinutes": 25721,
    "sessionCount": 195,
    "weekMinutes": 1938,
    "fortnightMinutes": 3837,
    "series": [
      [
        "2026-09-25",
        9.25
      ],
      [
        "2026-09-26",
        3.35
      ],
      [
        "2026-09-27",
        5.58
      ],
      [
        "2026-09-28",
        4.8
      ],
      [
        "2026-09-29",
        0.0
      ],
      [
        "2026-09-30",
        3.23
      ],
      [
        "2026-10-01",
        5.47
      ],
      [
        "2026-10-02",
        4.68
      ],
      [
        "2026-10-03",
        3.9
      ],
      [
        "2026-10-04",
        3.12
      ],
      [
        "2026-10-05",
        5.35
      ],
      [
        "2026-10-06",
        0.0
      ],
      [
        "2026-10-07",
        3.78
      ],
      [
        "2026-10-08",
        11.5
      ]
    ],
    "subjects": [
      {
        "name": "Physics",
        "exam": "JEE",
        "studyMinutes": 28747,
        "chapters": [
          {
            "title": "Mathematics in Physics",
            "topics": [
              "Fundamentals of Vectors",
              "Addition and Subtraction of Vectors",
              "Multiplication of Vectors",
              "Lami's Theorem",
              "Errors of Measurement"
            ],
            "done": 20
          },
          {
            "title": "Units and Dimensions",
            "topics": [
              "Units",
              "Dimensions"
            ],
            "done": 0
          },
          {
            "title": "Motion In One Dimension",
            "topics": [
              "Rest and Motion",
              "Uniform Motion",
              "Graphs of motion in one dimension",
              "Non-uniform Motion",
              "Relative Motion",
              "Motion Under Gravity"
            ],
            "done": 67
          }
        ]
      },
      {
        "name": "Chemistry",
        "exam": "JEE",
        "studyMinutes": 33022,
        "chapters": [
          {
            "title": "Some Basic Concepts of Chemistry",
            "topics": [
              "Laws of chemical combination",
              "Mole concept",
              "Quantitative measures in chemical equations",
              "Concentration terms",
              "Significant Figures"
            ],
            "done": 60
          },
          {
            "title": "Structure of Atom",
            "topics": [
              "Atomic Models",
              "Atomic Mass and Atomic Size",
              "Bohr's model",
              "Hydrogen spectrum",
              "Dual Behaviour of Matter and Heisenberg Uncertainty Principle",
              "Quantum mechanical model"
            ],
            "done": 71
          },
          {
            "title": "States of Matter",
            "topics": [
              "Gas laws and Ideal Gas Equation",
              "Mixture of gases",
              "Kinetic theory of gases",
              "Real Gases and Van der Waal's Equation",
              "Critical phenomena and liquefaction",
              "Liquid State"
            ],
            "done": 100
          }
        ]
      },
      {
        "name": "Mathematics",
        "exam": "JEE",
        "studyMinutes": 34551,
        "chapters": [
          {
            "title": "Basic of Mathematics",
            "topics": [
              "Logarithm",
              "Inequalities"
            ],
            "done": 100
          },
          {
            "title": "Quadratic Equation",
            "topics": [
              "Relation between Roots and Coefficients",
              "Graph and Sign of Quadratic",
              "Range of Quadratic Function",
              "Common Roots",
              "Location of Roots",
              "N degree equation"
            ],
            "done": 100
          },
          {
            "title": "Complex Number",
            "topics": [
              "Power of iota",
              "Algebra of complex numbers",
              "Conjugate, modulus and argument",
              "Euler Form and De Moivres Theorem",
              "Cube Root of Unity",
              "Locus Based on Distance Formula"
            ],
            "done": 100
          }
        ]
      }
    ],
    "tasks": [
      {
        "title": "Revise error notebook for Mechanical Properties of Solids",
        "subject": "Physics",
        "status": "backlog",
        "priority": "p1"
      },
      {
        "title": "Complete PYQ set from Classification of Elements and Periodicity in Properties",
        "subject": "Chemistry",
        "status": "todo",
        "priority": "p2"
      },
      {
        "title": "Make formula sheet for Differentiation",
        "subject": "Mathematics",
        "status": "in-progress",
        "priority": "p3"
      },
      {
        "title": "Retest weak topic in Current Electricity",
        "subject": "Physics",
        "status": "review",
        "priority": "p4"
      },
      {
        "title": "Watch final concept recap for Practical Chemistry",
        "subject": "Chemistry",
        "status": "done",
        "priority": "p1"
      },
      {
        "title": "Solve timed drill on Ellipse",
        "subject": "Mathematics",
        "status": "backlog",
        "priority": "p2"
      },
      {
        "title": "Convert mistakes into flashcards for Nuclear Physics",
        "subject": "Physics",
        "status": "todo",
        "priority": "p3"
      },
      {
        "title": "Finish NCERT quick scan for Biomolecules",
        "subject": "Chemistry",
        "status": "in-progress",
        "priority": "p4"
      },
      {
        "title": "Revise error notebook for Basic of Mathematics",
        "subject": "Mathematics",
        "status": "review",
        "priority": "p1"
      },
      {
        "title": "Complete PYQ set from Laws of Motion",
        "subject": "Physics",
        "status": "done",
        "priority": "p2"
      },
      {
        "title": "Make formula sheet for Redox Reactions",
        "subject": "Chemistry",
        "status": "backlog",
        "priority": "p3"
      },
      {
        "title": "Retest weak topic in Determinants",
        "subject": "Mathematics",
        "status": "todo",
        "priority": "p4"
      },
      {
        "title": "Watch final concept recap for Thermal Properties of Matter",
        "subject": "Physics",
        "status": "in-progress",
        "priority": "p1"
      },
      {
        "title": "Solve timed drill on s Block Elements",
        "subject": "Chemistry",
        "status": "review",
        "priority": "p2"
      },
      {
        "title": "Convert mistakes into flashcards for Definite Integration",
        "subject": "Mathematics",
        "status": "done",
        "priority": "p3"
      },
      {
        "title": "Finish NCERT quick scan for Alternating Current",
        "subject": "Physics",
        "status": "backlog",
        "priority": "p4"
      },
      {
        "title": "Revise error notebook for Environmental Chemistry",
        "subject": "Chemistry",
        "status": "todo",
        "priority": "p1"
      },
      {
        "title": "Complete PYQ set from Trigonometric Equations",
        "subject": "Mathematics",
        "status": "in-progress",
        "priority": "p2"
      },
      {
        "title": "Make formula sheet for Experimental Physics",
        "subject": "Physics",
        "status": "review",
        "priority": "p3"
      },
      {
        "title": "Retest weak topic in Some Basic Concepts of Chemistry",
        "subject": "Chemistry",
        "status": "done",
        "priority": "p4"
      },
      {
        "title": "Watch final concept recap for Sequences and Series",
        "subject": "Mathematics",
        "status": "backlog",
        "priority": "p1"
      },
      {
        "title": "Solve timed drill on Gravitation",
        "subject": "Physics",
        "status": "todo",
        "priority": "p2"
      },
      {
        "title": "Convert mistakes into flashcards for Electrochemistry",
        "subject": "Chemistry",
        "status": "in-progress",
        "priority": "p3"
      },
      {
        "title": "Finish NCERT quick scan for Functions",
        "subject": "Mathematics",
        "status": "review",
        "priority": "p4"
      },
      {
        "title": "Revise error notebook for Capacitance",
        "subject": "Physics",
        "status": "done",
        "priority": "p1"
      },
      {
        "title": "Complete PYQ set from p Block Elements (Group 15, 16, 17 & 18)",
        "subject": "Chemistry",
        "status": "backlog",
        "priority": "p2"
      },
      {
        "title": "Make formula sheet for Straight Lines",
        "subject": "Mathematics",
        "status": "todo",
        "priority": "p3"
      },
      {
        "title": "Retest weak topic in Atomic Physics",
        "subject": "Physics",
        "status": "in-progress",
        "priority": "p4"
      },
      {
        "title": "Watch final concept recap for Aldehydes and Ketones",
        "subject": "Chemistry",
        "status": "review",
        "priority": "p1"
      },
      {
        "title": "Solve timed drill on Properties of Triangles",
        "subject": "Mathematics",
        "status": "done",
        "priority": "p2"
      },
      {
        "title": "Convert mistakes into flashcards for Motion In Two Dimensions",
        "subject": "Physics",
        "status": "backlog",
        "priority": "p3"
      },
      {
        "title": "Finish NCERT quick scan for Thermodynamics",
        "subject": "Chemistry",
        "status": "todo",
        "priority": "p4"
      }
    ],
    "recent": [
      {
        "date": "2026-10-08",
        "subject": "Physics",
        "minutes": 158,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-08",
        "subject": "Chemistry",
        "minutes": 184,
        "type": "Concept build",
        "completed": true
      },
      {
        "date": "2026-10-08",
        "subject": "Mathematics",
        "minutes": 164,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-08",
        "subject": "Physics",
        "minutes": 184,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-07",
        "subject": "Chemistry",
        "minutes": 102,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-07",
        "subject": "Chemistry",
        "minutes": 125,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-05",
        "subject": "Chemistry",
        "minutes": 149,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-05",
        "subject": "Physics",
        "minutes": 172,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-04",
        "subject": "Mathematics",
        "minutes": 82,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-04",
        "subject": "Chemistry",
        "minutes": 105,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-03",
        "subject": "Physics",
        "minutes": 105,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-03",
        "subject": "Mathematics",
        "minutes": 129,
        "type": "PYQ practice",
        "completed": true
      },
      {
        "date": "2026-10-02",
        "subject": "Chemistry",
        "minutes": 129,
        "type": "Formula revision",
        "completed": true
      },
      {
        "date": "2026-10-02",
        "subject": "Physics",
        "minutes": 152,
        "type": "PYQ practice",
        "completed": true
      }
    ]
  };
