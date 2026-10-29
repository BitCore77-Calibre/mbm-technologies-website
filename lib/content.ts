import { siteConfig } from "./site-config";

export type Project = {
  slug: string;
  name: string;
  eyebrow: string;
  status: string;
  summary: string;
  description: string;
  accent: "blue" | "red" | "green" | "violet" | "gold";
  capabilities: string[];
  principles: string[];
  portalLabel?: string;
  notice?: string;
  image?: string;
  imageAlt?: string;
  imageCaption?: string;
  destinations?: Array<{
    label: string;
    href: string;
    access: "public" | "local";
    note: string;
  }>;
};

export type EcosystemPortal = {
  slug: string;
  shortName: string;
  category: string;
  description: string;
  action: string;
  accent: Project["accent"];
  signal: string;
  access: "mbm" | "public" | "local";
  links: Array<{
    label: string;
    href: string;
    access: "internal" | "public" | "local";
  }>;
};

export type ProjectDetail = {
  challenge: string;
  response: string;
  currentWork: string[];
  evidence: string[];
  audience: string[];
};

type PortalLink = EcosystemPortal["links"][number];
type Destination = NonNullable<Project["destinations"]>[number];

/** Links to the CALIBRE public website, when it has a public address. */
function calibreWebsiteLinks(): PortalLink[] {
  return siteConfig.calibreWebsiteUrl
    ? [{ label: "Visit the CALIBRE website", href: siteConfig.calibreWebsiteUrl, access: "public" }]
    : [];
}

/**
 * Exchange and swap buttons. Public addresses are used once they exist;
 * localhost buttons appear only when VITE_SHOW_LOCAL_PORTALS=true
 * (Docker on your own computer), never on the public website.
 */
function exchangeLinks(): PortalLink[] {
  const links: PortalLink[] = [];
  if (siteConfig.calibreExchangeUrl) links.push({ label: "Open Calibre Exchange", href: siteConfig.calibreExchangeUrl, access: "public" });
  else if (siteConfig.showLocalPortals) links.push({ label: "Open Exchange · local", href: siteConfig.localExchangeUrl, access: "local" });
  if (siteConfig.calibreSwapUrl) links.push({ label: "Open Calibre Swap", href: siteConfig.calibreSwapUrl, access: "public" });
  else if (siteConfig.showLocalPortals) links.push({ label: "Open Swap · local", href: siteConfig.localSwapUrl, access: "local" });
  return links;
}

function exchangeDestinations(): Destination[] {
  return exchangeLinks().map(link => ({
    label: link.label,
    href: link.href,
    access: link.access === "public" ? "public" : "local",
    note: link.access === "public" ? "Public service" : "Development service on this computer only",
  }));
}

function strongestAccess(links: PortalLink[]): EcosystemPortal["access"] {
  if (links.some(link => link.access === "public")) return "public";
  if (links.some(link => link.access === "local")) return "local";
  return "mbm";
}

const calibreNetworkLinks: PortalLink[] = [
  ...calibreWebsiteLinks(),
  { label: "Programme overview", href: "/projects/calibre-blockchain", access: "internal" },
];

const calibreExchangeLinks: PortalLink[] = [
  ...exchangeLinks(),
  { label: "Programme overview", href: "/projects/calibre-exchange", access: "internal" },
];

export const ecosystemPortals: EcosystemPortal[] = [
  {
    slug: "calibre-blockchain",
    shortName: "CALIBRE Network",
    category: "POST-QUANTUM LAYER 1",
    description: "Explore MBM’s own post-quantum blockchain programme: native ML-DSA keys, a laboratory test network and the developer tools that exchanges and wallets will need.",
    action: "Explore CALIBRE",
    accent: "gold",
    signal: "SIGN · VALIDATE · ENDURE",
    access: strongestAccess(calibreNetworkLinks),
    links: calibreNetworkLinks,
  },
  {
    slug: "calibre-tests",
    shortName: "Calibre Tests",
    category: "DISTRIBUTED SYSTEMS LAB",
    description: "Open the dedicated record of Calibre protocol experiments, adversarial tests, evidence packages and verified research milestones.",
    action: "Explore Calibre Tests",
    accent: "blue",
    signal: "TEST · VERIFY · PUBLISH",
    access: "mbm",
    links: [{ label: "Explore Calibre Tests", href: "/projects/calibre-tests", access: "internal" }],
  },
  {
    slug: "calibre-exchange",
    shortName: "Calibre Exchange",
    category: "NON-CUSTODIAL EXCHANGE",
    description: "Enter the exchange programme for transparent multichain routing, user-controlled execution and measurable route intelligence.",
    action: "Visit Calibre Exchange",
    accent: "red",
    signal: "ROUTE · CONTROL · VERIFY",
    access: strongestAccess(calibreExchangeLinks),
    links: calibreExchangeLinks,
  },
  {
    slug: "cyprus-blockchain-association",
    shortName: "Cyprus Blockchain Association",
    category: "EDUCATION & ECOSYSTEM",
    description: "Visit the independent Cyprus Blockchain Association for education, ecosystem activity, professional participation and industry collaboration.",
    action: "Visit the public website",
    accent: "green",
    signal: "EDUCATE · CONNECT · ADVANCE",
    access: "public",
    links: [
      { label: "Visit Association website", href: "https://cyprusblockchainassociation.com.cy/", access: "public" },
      { label: "Association overview", href: "/projects/cyprus-blockchain-association", access: "internal" },
    ],
  },
  {
    slug: "calibre-quantum-ai-trading-lab",
    shortName: "Calibre Quantum AI Trading Lab",
    category: "MARKET INTELLIGENCE R&D",
    description: "Explore controlled research into quantum-inspired optimization, artificial intelligence and evidence-led trading decision systems.",
    action: "Enter the research lab",
    accent: "violet",
    signal: "MODEL · TEST · CONTROL",
    access: "mbm",
    links: [{ label: "Enter the research lab", href: "/projects/calibre-quantum-ai-trading-lab", access: "internal" }],
  },
];

export const capabilities = [
  {
    number: "01",
    title: "Cybersecurity Engineering",
    summary:
      "Security architecture, threat detection, adversarial testing and resilient systems engineered into the platform from day one.",
    tags: ["Zero trust", "Security operations", "Threat intelligence"],
    accent: "blue",
  },
  {
    number: "02",
    title: "Blockchain Protocols",
    summary:
      "Protocol research and engineering across consensus, interoperability, smart contracts, wallets and distributed infrastructure.",
    tags: ["Consensus", "Cross-chain", "Smart contracts"],
    accent: "red",
  },
  {
    number: "03",
    title: "Artificial Intelligence",
    summary:
      "Purpose-built AI agents, decision systems and automation designed for explainability, control and operational reliability.",
    tags: ["AI agents", "Applied intelligence", "Automation"],
    accent: "violet",
  },
  {
    number: "04",
    title: "DeFi Infrastructure",
    summary:
      "Non-custodial exchange infrastructure, liquidity intelligence, route discovery and transparent execution systems.",
    tags: ["DEX infrastructure", "Liquidity routing", "Non-custodial"],
    accent: "green",
  },
  {
    number: "05",
    title: "Cryptography & PQC",
    summary:
      "Applied cryptography and post-quantum readiness research for long-lived systems, identities and digital value networks.",
    tags: ["Applied cryptography", "PQC readiness", "Key architecture"],
    accent: "gold",
  },
  {
    number: "06",
    title: "Cryptoeconomics & Web3",
    summary:
      "Mechanism design, token systems, decentralized governance and incentive models grounded in measurable system behavior.",
    tags: ["Mechanism design", "Governance", "Economic security"],
    accent: "blue",
  },
] as const;

export const projects: Project[] = [
  {
    slug: "calibre-blockchain",
    name: "CALIBRE Post-Quantum Blockchain",
    eyebrow: "POST-QUANTUM LAYER 1",
    status: "Laboratory test network",
    summary:
      "MBM’s own Layer 1 network, engineered for the post-quantum era: every account key uses NIST-standardised ML-DSA signatures, with native transaction, staking and fee modules.",
    description:
      "CALIBRE is built natively rather than as a copy of an existing smart-contract chain, so post-quantum signatures, transaction validation, staking and fees are designed together instead of being added later. The network currently runs as a laboratory test network on MBM-controlled infrastructure, where it is put through a scheduled adversarial test campaign before any public phase. At launch, validators join through an application and approval process.",
    accent: "gold",
    capabilities: [
      "ML-DSA post-quantum signatures for every account",
      "Native UTXO-based transaction model",
      "Zero-knowledge proof verification module",
      "Approved validator onboarding at launch",
    ],
    principles: ["Post-quantum by default", "Test before trust", "Approved validators first"],
    portalLabel: "Explore CALIBRE",
    notice: "CALIBRE is in a test phase. Test-network tokens have no monetary value and cannot be bought or sold. Nothing on this website is an offer of crypto-assets, a prospectus or investment advice.",
    destinations: siteConfig.calibreWebsiteUrl
      ? [{ label: "Visit the CALIBRE website", href: siteConfig.calibreWebsiteUrl, access: "public", note: "Official CALIBRE network website" }]
      : undefined,
  },
  {
    slug: "calibre-exchange",
    name: "Calibre Exchange",
    eyebrow: "MULTICHAIN LIQUIDITY",
    status: "Active development",
    summary:
      "Intelligent non-custodial multichain exchange infrastructure built around transparent routing, user control and verifiable execution.",
    description:
      "Calibre Exchange is an intelligent routing and execution platform for digital-asset journeys across chains. It is designed to compare usable routes across decentralized liquidity sources while preserving non-custodial control and clear execution evidence.",
    accent: "red",
    capabilities: [
      "Cross-chain route intelligence",
      "DEX, bridge and solver aggregation",
      "Quote evidence and expiry control",
      "Non-custodial transaction workflows",
    ],
    principles: ["User control", "Transparent routes", "Measured reliability"],
    portalLabel: "Visit Calibre Exchange",
    destinations: exchangeDestinations(),
  },
  {
    slug: "nucleus-protocol",
    name: "Nucleus Protocol",
    eyebrow: "PROTOCOL R&D",
    status: "Research & development",
    summary:
      "A security-first blockchain protocol research programme exploring resilient consensus, verifiable monetary systems and future-ready cryptography.",
    description:
      "Nucleus is MBM Technologies’ protocol laboratory: a disciplined environment for specifying, modelling and testing distributed-system foundations before production claims are made. Its work combines adversarial threat modelling, cryptoeconomic analysis and cryptographic design.",
    accent: "blue",
    capabilities: [
      "Consensus and finality research",
      "Adversarial protocol modelling",
      "Cryptographic monetary transparency",
      "Post-quantum transition research",
    ],
    principles: ["Specify first", "Model adversaries", "Verify assumptions"],
  },
  {
    slug: "calibre-tests",
    name: "Calibre Distributed Systems Test Lab",
    eyebrow: "PROTOCOL EVIDENCE",
    status: "Active experimental programme",
    summary:
      "The dedicated Calibre Tests portal for distributed protocol experiments, adversarial scenarios, reproducible evidence and verified milestones.",
    description:
      "The Calibre Distributed Systems Test Lab turns protocol ideas into named, repeatable experiments. Each test defines the hypothesis, threat model, environment, expected result and evidence package so that research progress can be inspected instead of merely claimed. The programme includes distributed-validator tests and the newer blockless, ledgerless transition-authority experiments.",
    accent: "blue",
    capabilities: [
      "Distributed validator experiments",
      "Blockless and ledgerless protocol tests",
      "Wallet-clone and double-spend adversarial tests",
      "Reproducible evidence and result certification",
    ],
    principles: ["Name every hypothesis", "Preserve evidence", "Publish limitations"],
    portalLabel: "Explore Calibre Tests",
    notice: "Experimental results describe bounded test conditions. They are research evidence, not a claim that the full protocol is production-ready.",
    image: "/labs/calibre-distributed-systems-test-lab.webp",
    imageAlt: "Engineers testing connected servers, network equipment and distributed-system telemetry in the Calibre laboratory.",
    imageCaption: "DISTRIBUTED-SYSTEMS EXPERIMENT ENVIRONMENT · VALIDATOR, NETWORK AND HARDWARE TESTING",
  },
  {
    slug: "cyprus-blockchain-association",
    name: "Cyprus Blockchain Association",
    eyebrow: "EDUCATION & ECOSYSTEM",
    status: "Independent ecosystem organization",
    summary:
      "A direct gateway to the independent Cyprus Blockchain Association for education, professional collaboration and responsible ecosystem development.",
    description:
      "The Cyprus Blockchain Association brings together professionals, researchers, institutions and people interested in blockchain technology in Cyprus. MBM Technologies provides this gateway as part of its wider ecosystem map; the association remains an independent organization with its own public website and activities.",
    accent: "green",
    capabilities: [
      "Blockchain and digital-asset education",
      "Research and publication programmes",
      "Professional and academic dialogue",
      "Cyprus ecosystem visibility",
    ],
    principles: ["Educate clearly", "Encourage responsibility", "Connect disciplines"],
    portalLabel: "Discover the association",
    destinations: [
      { label: "Visit Cyprus Blockchain Association", href: "https://cyprusblockchainassociation.com.cy/", access: "public", note: "Independent public website" },
    ],
  },
  {
    slug: "calibre-quantum-ai-trading-lab",
    name: "Calibre Quantum AI Trading Lab",
    eyebrow: "MARKET INTELLIGENCE R&D",
    status: "Research prototype",
    summary:
      "A controlled research programme combining artificial intelligence, quantum-inspired optimization and evidence-led market decision support.",
    description:
      "The Calibre Quantum AI Trading Lab investigates whether advanced optimization and artificial intelligence can improve market analysis, scenario ranking and risk-aware decision support. Research begins in simulation and shadow mode, measures performance against simple baselines and preserves human authority over every real-world action.",
    accent: "violet",
    capabilities: [
      "Quantum-inspired optimization research",
      "Artificial intelligence market models",
      "Backtesting, shadow mode and evaluation",
      "Risk limits and human-controlled execution",
    ],
    principles: ["No guaranteed returns", "Evidence before deployment", "Human authority"],
    portalLabel: "Enter the research lab",
    notice: "This is a research and engineering programme, not investment advice, a performance guarantee or a claim of demonstrated quantum advantage.",
  },
  {
    slug: "central-exchange-studio",
    name: "Central Exchange Studio",
    eyebrow: "WHITE-LABEL SYSTEMS",
    status: "Platform development",
    summary:
      "A governed design and configuration system for launching differentiated exchange experiences from reusable, controlled infrastructure.",
    description:
      "Central Exchange Studio brings branding, interface configuration, exchange modules and governed releases into one controlled workflow. The goal is to accelerate high-quality white-label delivery without sacrificing architecture, auditability or operational boundaries.",
    accent: "violet",
    capabilities: [
      "Exchange-specific templates",
      "Brand and experience controls",
      "Reusable wallet and quote modules",
      "Governed configuration releases",
    ],
    principles: ["Modular by design", "Governed releases", "One source of truth"],
  },
  {
    slug: "calibre-cybersecurity-test-lab",
    name: "Calibre Cybersecurity Test Lab",
    eyebrow: "CYBER RANGE & FORENSICS",
    status: "Security research programme",
    summary:
      "A controlled cyber range and digital-forensics environment for attack simulation, defensive monitoring, evidence examination and infrastructure-security testing.",
    description:
      "The Calibre Cybersecurity Test Lab combines a segmented cyber range, defensive monitoring environment, authorized red-team exercises and a dedicated digital-forensics station. It is designed to test how systems behave during realistic incidents while preserving evidence, separating research networks from production systems and measuring whether containment controls actually work.",
    accent: "green",
    capabilities: [
      "Controlled red-team and blue-team exercises",
      "Threat detection and incident containment",
      "Digital-forensics and evidence preservation",
      "Industrial-control security simulation",
    ],
    principles: ["Isolated test boundaries", "Authorized research", "Evidence before action"],
    notice: "All offensive-security activity is confined to authorized laboratory targets and controlled test networks.",
    image: "/labs/calibre-cybersecurity-test-lab.webp",
    imageAlt: "Cybersecurity professionals conducting a controlled incident-response exercise with a cyber range, server racks and digital-forensics equipment.",
    imageCaption: "CONTROLLED CYBER RANGE · DEFENSIVE OPERATIONS, FORENSICS AND INDUSTRIAL-CONTROL SECURITY",
  },
  {
    slug: "calibre-artificial-intelligence-test-lab",
    name: "Calibre Artificial Intelligence Test Lab",
    eyebrow: "AI & HUMANOID ROBOTICS",
    status: "Applied research",
    summary:
      "An applied artificial-intelligence and robotics laboratory for perception, learning, human-machine interaction and controlled autonomous-system testing.",
    description:
      "The Calibre Artificial Intelligence Test Lab connects software intelligence with physical machines. Its programme includes computer vision, sensor fusion, humanoid robotics, cognitive interaction, model evaluation and secure automation. Prototypes remain instrumented and supervised so researchers can measure what the system perceived, why it acted and where human authority must remain.",
    accent: "gold",
    capabilities: [
      "Computer vision and multimodal perception",
      "Humanoid robotics and actuator testing",
      "Artificial-intelligence model evaluation",
      "Human-controlled autonomous systems",
    ],
    principles: ["Measured intelligence", "Human authority", "Safe physical testing"],
    notice: "The laboratory image represents the intended Calibre research environment and programme direction; it is not a claim that every depicted physical system is already operational.",
    image: "/labs/calibre-artificial-intelligence-test-lab.webp",
    imageAlt: "Engineers calibrating an unfinished humanoid robot and a separate wired robotic head in the Calibre artificial-intelligence laboratory.",
    imageCaption: "AI AND HUMANOID ROBOTICS ENVIRONMENT · PERCEPTION, ACTUATION AND COGNITIVE-SYSTEM TESTING",
  },
];

export const projectDetails: Record<string, ProjectDetail> = {
  "calibre-blockchain": {
    challenge: "Most blockchains rely on signature schemes that a large enough quantum computer could break. Keys published on a ledger today may need to stay safe for decades, so migrating later is risky and disruptive.",
    response: "CALIBRE uses post-quantum signatures for every user key from the first block, and treats the network’s own security as something to be attacked and measured before it is trusted. Development, wallet and exchange tooling come first; broader programmability follows once the base layer has been proven.",
    currentWork: ["Laboratory test network with a scheduled attack campaign", "Desktop wallet with post-quantum keys", "Developer API and SDKs for exchanges and wallets", "Validator application and approval process"],
    evidence: ["Attack-campaign reports with clear pass and fail results", "Chained audit logs of network operations", "Versioned releases with published checksums", "Documented known limitations for each release"],
    audience: ["Exchanges and wallet providers", "Prospective validator operators", "Post-quantum cryptography researchers"],
  },
  "nucleus-protocol": {
    challenge: "Distributed systems often combine consensus, accounts, assets, governance and cryptography before their trust assumptions are stated clearly. That makes weaknesses expensive to discover later.",
    response: "Nucleus begins with specifications, explicit state transitions and adversarial models. Protocol behaviour is separated into components that can be reasoned about, implemented and tested before broader production claims are made.",
    currentWork: ["Object and policy-account architecture", "Deterministic execution and effect modelling", "Hybrid classical and post-quantum signature design", "Wallet, node and test-network specifications"],
    evidence: ["Versioned protocol specifications", "Executable test cases and reference implementations", "Threat models and trust-boundary records", "Reproducible test-network evidence"],
    audience: ["Protocol researchers", "Distributed-systems engineers", "Wallet and infrastructure developers"],
  },
  "calibre-exchange": {
    challenge: "A cross-chain swap can depend on several independent networks, liquidity venues, bridges and solvers. A visually attractive quote is not enough; users need to understand route quality, expiry, fees and execution risk.",
    response: "Calibre Exchange is designed around non-custodial control, synchronized quote comparison and explicit route evidence. Providers remain modular so unhealthy or unsuitable routes can be excluded without rebuilding the exchange.",
    currentWork: ["Multichain quote normalization", "Route scoring and provider-health signals", "Wallet and transaction preparation flows", "Fee, expiry and execution-evidence controls"],
    evidence: ["Comparable quote snapshots", "Route decision and provider records", "Transaction simulation and expiry checks", "Post-execution reconciliation results"],
    audience: ["Digital-asset users", "Wallet and exchange operators", "Liquidity and infrastructure partners"],
  },
  "calibre-tests": {
    challenge: "New monetary and distributed-system claims are easy to describe but difficult to prove. Calibre needs experiments that isolate one claim at a time, reproduce failure conditions and preserve the resulting evidence.",
    response: "Every Calibre test receives a defined hypothesis, threat model, environment, expected boundary and evidence package. The programme separates validator-based experiments from the newer blockless and ledgerless transition-authority research.",
    currentWork: ["Transition-authority unicity", "Hardware-bound write-once authorization", "Rollback and state-recreation resistance", "Distributed validator and network-boundary experiments"],
    evidence: ["Named and versioned test protocols", "Terminal transcripts and machine-readable results", "Cryptographic checksums and sealed archives", "Clear PASS, FAIL and expected-failure interpretation"],
    audience: ["Cryptography researchers", "Protocol engineers", "Independent technical reviewers"],
  },
  "cyprus-blockchain-association": {
    challenge: "Blockchain discussion is often divided between highly technical research, commercial promotion and public misunderstanding. Cyprus benefits from a professional bridge between education, responsible innovation and industry participation.",
    response: "MBM Technologies links visitors directly to the independent Cyprus Blockchain Association and presents its place in the national ecosystem without implying ownership or operational control.",
    currentWork: ["Direct public-website access", "Education and ecosystem visibility", "Professional participation pathways", "Clear separation of organizational ownership"],
    evidence: ["Independent public organization website", "Published association information", "Visible external-link disclosure", "Accurate organizational status"],
    audience: ["Students and educators", "Researchers and professionals", "Cyprus organizations and public stakeholders"],
  },
  "calibre-quantum-ai-trading-lab": {
    challenge: "Market models can look impressive in hindsight while failing under live uncertainty, costs and regime changes. Advanced optimization creates value only when it outperforms transparent baselines under controlled evaluation.",
    response: "The lab begins with data quality, backtesting discipline and shadow operation. Quantum-inspired methods and artificial intelligence models are compared with simpler benchmarks while risk limits and human approval remain outside model control.",
    currentWork: ["Bitcoin, Ether, Solana and foreign-exchange horizons", "Feature, regime and uncertainty modelling", "Walk-forward backtesting and shadow evaluation", "Risk limits and decision-evidence interfaces"],
    evidence: ["Timestamped out-of-sample forecasts", "Benchmark and cost-adjusted comparisons", "Model cards and data-lineage records", "Drawdown, error and regime-failure analysis"],
    audience: ["Quantitative researchers", "Risk and market analysts", "Controlled trading-system engineers"],
  },
  "central-exchange-studio": {
    challenge: "White-label platforms often become disconnected copies with inconsistent security, branding and releases. Fast customization can create long-term operational risk.",
    response: "Central Exchange Studio treats variation as governed configuration. Shared exchange modules, design tokens and controlled releases create differentiated experiences while preserving a reviewable technical core.",
    currentWork: ["Component and token registries", "Exchange-specific configuration controls", "Reusable wallet and quote modules", "Approval and release workflows"],
    evidence: ["Versioned configuration manifests", "Component ownership and change history", "Release-validation reports", "Environment and dependency inventories"],
    audience: ["Exchange product teams", "Brand and design operators", "Governed platform administrators"],
  },
  "calibre-cybersecurity-test-lab": {
    challenge: "Security controls cannot be trusted only because they are configured. Teams need controlled environments where attacks, detection, containment and forensic procedures can be exercised without exposing production systems.",
    response: "The Calibre Cybersecurity Test Lab combines segmented cyber ranges, defensive monitoring, authorized adversarial testing and digital-forensics workflows. Cyber-physical scenarios extend testing beyond ordinary web and office systems.",
    currentWork: ["Attack-and-defence exercise design", "Detection and containment engineering", "Digital-forensics evidence workflows", "Industrial-control security simulation"],
    evidence: ["Exercise plans and authorization boundaries", "Detection coverage and response timelines", "Forensic chain-of-custody records", "Remediation and retest reports"],
    audience: ["Security engineering teams", "Incident responders and forensic analysts", "Critical-infrastructure researchers"],
  },
  "calibre-artificial-intelligence-test-lab": {
    challenge: "Artificial intelligence becomes harder to evaluate when perception, physical movement and human interaction are combined. A successful demonstration may still hide unsafe failure modes or weak reasoning evidence.",
    response: "The Calibre Artificial Intelligence Test Lab instruments the complete path from sensor input to model decision and physical action. Robots and agents remain supervised while perception, latency, uncertainty and override behaviour are measured.",
    currentWork: ["Computer vision and facial-expression perception", "Multimodal sensor fusion", "Humanoid head and actuator control", "Local artificial-intelligence agents and evaluation"],
    evidence: ["Sensor and model evaluation datasets", "Decision traces and uncertainty records", "Safety-stop and human-override tests", "Repeatable physical calibration results"],
    audience: ["Artificial-intelligence engineers", "Robotics and control researchers", "Human-machine interaction specialists"],
  },
};

export const roles = [
  {
    title: "Senior Blockchain Protocol Engineer",
    team: "CALIBRE Network",
    location: "Remote · Global",
    type: "Talent network",
    skills: ["Distributed systems", "Rust / Go", "Consensus"],
  },
  {
    title: "Protocol Security Engineer",
    team: "CALIBRE & Cybersecurity",
    location: "Remote · Global",
    type: "Talent network",
    skills: ["Rust", "Formal methods", "Adversarial testing"],
  },
  {
    title: "AI Systems Engineer",
    team: "Calibre Artificial Intelligence Test Lab",
    location: "Remote · Global",
    type: "Talent network",
    skills: ["Python", "Agents", "Evaluation"],
  },
  {
    title: "DeFi / Routing Engineer",
    team: "Calibre Exchange",
    location: "Remote · Global",
    type: "Talent network",
    skills: ["TypeScript", "DEX APIs", "Cross-chain systems"],
  },
  {
    title: "Security Operations Engineer",
    team: "Calibre Cybersecurity Test Lab",
    location: "Cyprus / Remote",
    type: "Talent network",
    skills: ["SIEM", "Detection engineering", "Incident response"],
  },
  {
    title: "Product Designer — Complex Systems",
    team: "Product Engineering",
    location: "Remote · Global",
    type: "Talent network",
    skills: ["Design systems", "Data UX", "Prototyping"],
  },
];
