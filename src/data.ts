import { Project, SkillNode, CreativeInterest, WorkflowStep } from "./types";

export const PROJECTS: Project[] = [
  {
    id: "railrouting",
    number: "01",
    title: "Advanced Rail Routing and Ticketing System",
    subtitle: "Transit Networks, Route Optimization, and Secure Ticket Processing",
    description: "A comprehensive transit platform engineered to manage complex rail infrastructure networks, compute optimal paths, and handle heavy parallel ticket purchase booking queues safely.",
    highlights: [
      "Algorithm / Routing: High-efficiency Dijkstra-based route finder computing shortest or fastest multi-transit lines instantly.",
      "Database / Concurrency: Distributed lock handling and transaction validation to guarantee zero seat double-booking under extreme parallel booking peaks.",
      "Payment / Ticketing Generation: Real-time generation of encrypted mobile QR tickets complete with authentic signed visual indicators.",
      "User Interface Highlight: Interactive schematic multi-route rail overlay and live seat selection console inside the device emulator."
    ],
    challenges: [
      "Solving sub-millisecond Dijkstra path calculations across sprawling multi-station dense topological networks.",
      "Coordinating Redis transaction rollbacks and locks to enforce database consistency under 15,000+ simultaneous requests.",
      "Structuring unique secure QR codes with offline public key signatures that guard against ticket duplication."
    ],
    technologies: ["React", "FastAPI Core", "PostgreSQL", "Redis Locks", "D3.js Topology", "WebSockets"],
    accentColor: "rgba(59, 130, 246, 0.65)" // Electric Blue for system network
  },
  {
    id: "activityapp2",
    number: "02",
    title: "ActivityApp v2: Academic Attendance Suite",
    subtitle: "Enterprise Student Metrics, Attendance Safeguards, & Localized PDF Ledgers",
    description: "An enterprise mobile application designed to coordinate timetable logging, record precise student attendance, enforce threshold rules, and compile localized academic reports.",
    highlights: [
      "Offline-First SQLite Cache: Automatically caches attendance locally when network coverage is lost and synchronizes seamlessly on reconnection.",
      "75% Safe Threshold Guardian: Standard-compliant real-time automated safety alarms triggered if attendance drops below the critical 75% limit.",
      "PDF Report Compiler: Packages dynamically generated charts and exports encrypted PDF sheets directly to storage on user demand.",
      "Multi-Language Runtime: Integrated English and Telugu localized switch adjustments for seamless regional layout rendering."
    ],
    challenges: [
      "Implementing custom cache reconciliation algorithms that merge offline writes with high-throughput Firestore queues.",
      "Enforcing robust security rules to ensure secure and compliant access to student identity parameters.",
      "Rendering dynamic pixel-perfect tables and graphics in generated documents without dragging app frame rates."
    ],
    technologies: ["React Native", "Expo Router", "Firebase Auth", "Firestore DB", "SQLite", "TypeScript", "Runtime i18n"],
    accentColor: "rgba(16, 185, 129, 0.65)" // Safe Emerald Green aura
  }
];

export const SKILL_NODES: SkillNode[] = [
  // Mobile Category
  { name: "React Native", category: "mobile", angle: 0, radius: 180, y: -40, size: 10, speed: 0.005 },
  { name: "Expo Mobile", category: "mobile", angle: 1.2, radius: 190, y: -10, size: 9, speed: 0.006 },
  { name: "Expo Router", category: "mobile", angle: 2.4, radius: 170, y: 30, size: 8, speed: 0.004 },
  { name: "EAS Pipelines", category: "mobile", angle: 3.6, radius: 210, y: -60, size: 8, speed: 0.007 },
  { name: "Android SDK", category: "mobile", angle: 4.8, radius: 190, y: 15, size: 10, speed: 0.005 },
  
  // Backend & Cloud
  { name: "Firebase Auth", category: "backend", angle: 0.5, radius: 240, y: 80, size: 9, speed: -0.004 },
  { name: "Firestore DB", category: "backend", angle: 1.8, radius: 250, y: -20, size: 10, speed: -0.005 },
  { name: "Realtime DB", category: "backend", angle: 3.1, radius: 230, y: 40, size: 9, speed: -0.003 },
  { name: "Secure DB Rules", category: "backend", angle: 4.4, radius: 260, y: -80, size: 8, speed: -0.006 },
  
  // Languages
  { name: "TypeScript", category: "workflow", angle: 1.0, radius: 150, y: -120, size: 10, speed: 0.008 },
  { name: "JavaScript", category: "workflow", angle: 2.2, radius: 160, y: 100, size: 9, speed: 0.007 },
  
  // Development Workflow
  { name: "Git Versioning", category: "workflow", angle: 3.4, radius: 200, y: -100, size: 8, speed: -0.005 },
  { name: "APK Compilation", category: "workflow", angle: 4.6, radius: 220, y: 110, size: 9, speed: 0.006 },
  { name: "OTA Live Deploy", category: "workflow", angle: 5.8, radius: 210, y: -30, size: 8, speed: -0.004 },
  
  // Localization
  { name: "Runtime i18n", category: "localization", angle: 1.5, radius: 280, y: 60, size: 9, speed: 0.003 },
  { name: "Telugu UX Setup", category: "localization", angle: 3.5, radius: 270, y: -70, size: 10, speed: -0.004 },
  { name: "Regional Optimization", category: "localization", angle: 5.2, radius: 290, y: 20, size: 8, speed: 0.005 }
];

export const CREATIVE_INTERESTS: CreativeInterest[] = [
  {
    title: "Hardware Adaptive Interfaces",
    subtitle: "Orchestrating Physical Mechanics with Pixels",
    description: "Form matches mechanical function. I focus on building dynamic experiences that treat device cutouts (pinholes, camera islands, sensor notches) as central UI engines, shifting layout flows dynamically based on device hardware state.",
    details: ["Adaptive responsive safe areas", "Interactive Dynamic Island state listeners", "Notch-integrated contextual micro-overlays"],
    icon: "Smartphone",
    color: "#3B82F6"
  },
  {
    title: "Glassmorphic Architecture",
    subtitle: "Depth, Frosted Materials and Layered Interfaces",
    description: "Creating premium digital spaces focused on layered physical depth. By implementing heavy backdrop filters, saturated colors, and dynamic light reflections, mobile apps feel luxurious, multi-tiered, and organized.",
    details: ["Multi-layer composition trees", "Dynamic edge-highlight rendering", "Material saturation & contrast balances"],
    icon: "Layers",
    color: "#FFFFFF"
  },
  {
    title: "Organic Motion Design",
    subtitle: "Fluid Transitions Driven by Physical Simulation",
    description: "Interfaces shouldn't just warp; they should breathe. I engineer high-speed micro-interactions and transitions driven by physical springs, damping parameters, and velocity preservation, making touch inputs feel incredibly tactile.",
    details: ["Interruptible gestures & spring loops", "Staggered compositional orchestrations", "Physics-driven visual momentum tracking"],
    icon: "Activity",
    color: "#10B981"
  },
  {
    title: "Cinematic Digital Aesthetics",
    subtitle: "Subtle Smoky Atmosphere & Atmospheric Storytelling",
    description: "Capturing the dark mood of modern science fiction, gaming interfaces, and comic illustrations. Harnessing deep black canvases, red light smoke emitters, soft ambient glow, and high-spec lighting rigs to pull visitors into cohesive, expensive-feeling digital worlds.",
    details: ["High-spec dark environments", "Chamber atmosphere glows & smoky effects", "Rich cyber-punk UI accent mechanics"],
    icon: "Flame",
    color: "#EF4444"
  },
  {
    title: "Experiential Storytelling",
    subtitle: "Interactive Narratives Layered into UX flows",
    description: "Translating application functions into memorable, educational narratives. I construct highly illustrative on-boarding animations, gamified visual accomplishments, and cute interactive stories that turn standard mobile tasking into a delightful process.",
    details: ["Concept illustration translation", "Visual micro-victories and milestones", "Intuitive gamification heuristics"],
    icon: "BookOpen",
    color: "#F59E0B"
  }
];

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Client Requirement Analysis",
    subtitle: "Translating Needs to Epics",
    description: "Extracting critical business logic, goals, and localization preferences into precise technical requirements.",
    icon: "FileText"
  },
  {
    title: "Comprehensive Planning",
    subtitle: "Timeline & Technical Spec",
    description: "Drafting complete UI mockups, scheduling component development priorities, and defining schema shapes.",
    icon: "Calendar"
  },
  {
    title: "Scalable Architecture Design",
    subtitle: "The Structural Backbone",
    description: "Configuring robust state management libraries, offline SQLite frameworks, and navigation layouts.",
    icon: "Cpu"
  },
  {
    title: "Cloud & Firebase Integration",
    subtitle: "Secure Real-time Synchronization",
    description: "Connecting Firestore, Auth rules, offline syncing mechanisms, and setting up high-performance database indexing.",
    icon: "Cloud"
  },
  {
    title: "Dynamic Runtime Localization",
    subtitle: "Breaking Down Language Walls",
    description: "Wiring up contextual state dictionaries (English, Telugu) and adjusting glyph measurements for regional layout sizing.",
    icon: "Languages"
  },
  {
    title: "Continuous Verification & Testing",
    subtitle: "Hardening Stability",
    description: "Running rigorous unit, UI flow, and physical hardware device trials to verify peak 60fps performance.",
    icon: "ShieldCheck"
  },
  {
    title: "APK Compilation & Pipeline Automation",
    subtitle: "EAS Build Procedures",
    description: "Compiling optimized Android bundle files, running size audits, and structuring localized manifest configurations.",
    icon: "Hammer"
  },
  {
    title: "Live OTA Deployment",
    subtitle: "Instant Upgrades",
    description: "Publishing localized packages directly to the Play Store or pushing instant Over-The-Air EAS updates to users.",
    icon: "Send"
  }
];

export const APPROACH_PRINCIPLES = [
  {
    title: "Agile Mobile Sprints",
    desc: "Rapid incremental progress with persistent testing cycles to match immediate project revisions perfectly."
  },
  {
    title: "Rapid Micro-Prototyping",
    desc: "Envisioning and stress-testing gestures, hardware cutouts, and spring animations on physical screens immediately."
  },
  {
    title: "Cooperative Client Loop",
    desc: "Unlocking direct developmental previews, transparency channels, and rapid feedback integration."
  },
  {
    title: "Strict Performance Budgets",
    desc: "Limiting render threads, image assets, and database reads so animations lock to a continuous 60 FPS on mid-range devices."
  },
  {
    title: "EAS Continuous Deployment",
    desc: "Automating builds so stakeholders can test APK releases remotely inside minutes of pull request approvals."
  }
];
