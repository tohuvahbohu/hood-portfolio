/**
 * Centralized case-study content.
 * Keep public-safe; do not invent technical details not provided by the author.
 */

export type CaseStudyPanel = {
  heading: string;
  body: string | string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  shortTitle: string;
  eyebrow: string;
  summary: string;
  keyMetric?: string;
  context: string | string[];
  challenge: string;
  scope?: string[];
  role: string;
  approach: string[];
  decisions?: string[];
  tradeoffs?: string[];
  outcomes: string[];
  learned: string[];
  principalFraming?: string;
  relatedCapabilities: string[];
  diagram:
    | "layered-estate"
    | "client-integration"
    | "context-ingestion"
    | "code-derived"
    | "commerce-flow"
    | "deployment-transform";
  sticky: boolean;
  featured: boolean;
  order: number;
  /** Placeholder questions for later refinement — shown only if present. */
  openQuestions?: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "healthcare-enterprise-architecture",
    title: "From fragmented system knowledge to an actionable enterprise architecture model",
    shortTitle: "Healthcare enterprise architecture",
    eyebrow: "Healthcare SaaS · Estate visibility",
    summary:
      "Built a multi-level enterprise architecture model that made a large healthcare SaaS estate understandable for modernization, onboarding, product decisions, and delivery.",
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    keyMetric: "Onboarding reduced from ~2 weeks to 1 day",
    context: [
      "A healthcare SaaS company was transitioning from startup-style custom client delivery toward a scalable product operating model following a private-equity acquisition.",
      "The application estate had grown across 530 repositories, approximately 500 component repositories, 40 priority services, 83 APIs, approximately 2,000 endpoints, 11 customer-facing applications, and 15 engineering or delivery teams.",
    ],
    challenge:
      "System knowledge was distributed across code, documents, teams, Jira, Confluence, diagrams, and tribal knowledge. Leadership and engineering needed a consistent way to understand product boundaries, integration dependencies, modernization risk, and delivery impact.",
    role: "Lead the creation of a multi-level enterprise architecture model and connect it to modernization planning, product decisions, onboarding, client delivery, and engineering execution.",
    approach: [
      "Created estate-wide architecture views.",
      "Created per-product views.",
      "Mapped integrations and data movement.",
      "Created workflow-level views for critical processes.",
      "Connected higher-level architecture to code and repository context.",
      "Created views appropriate for executives, product teams, architects, engineers, and onboarding.",
      "Used architecture artifacts as inputs to modernization sequencing and risk assessment.",
    ],
    outcomes: [
      "Established a shared model of the application estate.",
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Improved role-focused onboarding from approximately two weeks to one day.",
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Reduced architecture and high-level-design refresh cycles from annual manual work to approximately four hours.",
      "Supported modernization planning across the full estate.",
      "Improved visibility into product boundaries, integrations, dependencies, and client-delivery concerns.",
      "Influenced architecture and modernization practices across 15 teams.",
    ],
    learned: [
      "Shared models create decision leverage only when they map to real delivery work.",
      "Audience-specific views matter as much as technical completeness.",
    ],
    principalFraming:
      "The result was not merely better documentation. It was an architectural operating model that enabled more consistent modernization, delivery, onboarding, and product decisions.",
    relatedCapabilities: [
      "Enterprise architecture and estate visibility",
      "Architecture governance",
      "Modernization sequencing",
    ],
    diagram: "layered-estate",
    sticky: true,
    featured: true,
    order: 1,
  },
  {
    slug: "client-integration-reference-architecture",
    title: "Turning one-off client architecture into repeatable integration patterns",
    shortTitle: "Client integration reference architecture",
    eyebrow: "Healthcare SaaS · Client delivery",
    summary:
      "Designed reusable client integration reference architectures that reduced preparation time and made data movement and assumptions visible earlier.",
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    keyMetric: "Client architecture prep: ~1 week → hours",
    context:
      "The company supported healthcare delivery across 72 client contexts. Client architecture work risked becoming repetitive, slow, and overly dependent on custom interpretation.",
    challenge:
      "Client-facing teams, product, architects, engineering, and implementation stakeholders needed a reusable language for discussing systems, workflows, data movement, dependencies, and delivery risks.",
    role: "Design reusable client integration reference architectures and standardize the artifacts needed to move from discovery into implementation.",
    approach: [
      "Developed reusable component diagrams.",
      "Developed sequence diagrams.",
      "Developed flow diagrams.",
      "Created workflow models.",
      "Created data-transfer agreement documentation.",
      "Distinguished product capabilities from client-specific configuration.",
      "Moved architecture earlier into product and client conversations.",
      "Established patterns that could be reused and adapted rather than recreated.",
    ],
    outcomes: [
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Reduced client architecture preparation from approximately one week to hours.",
      "Improved consistency across client discussions.",
      "Made integration assumptions and data movement visible earlier.",
      "Reduced downstream ambiguity and implementation risk.",
      "Supported the transition from custom client delivery toward repeatable SaaS implementation models.",
    ],
    learned: [
      "Productization of integration patterns is as important as individual solution quality.",
      "Clear customization boundaries reduce long-term estate complexity.",
    ],
    relatedCapabilities: [
      "SaaS and client integration architecture",
      "Customization-boundary strategy",
      "Integration repeatability",
    ],
    diagram: "client-integration",
    sticky: true,
    featured: true,
    order: 2,
  },
  {
    slug: "ai-ready-context-ingestion",
    title: "Building the context foundation for AI-enabled architecture and SDLC",
    shortTitle: "AI-ready context ingestion",
    eyebrow: "AI-enabled SDLC · Context architecture",
    summary:
      "Created the initial context-ingestion architecture and repository automation needed for future AI-assisted analysis — foundation, not autonomous platform.",
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    keyMetric: "~500 component repositories in scope",
    context:
      "The organization wanted to move toward AI-enabled modernization, but the information needed for trustworthy architecture assessment was fragmented across source code and delivery systems.",
    challenge:
      "AI could not meaningfully assist architecture and modernization without current access to repositories, documentation, tickets, workflows, and system context.",
    role: "Create the initial context-ingestion architecture and repository automation needed for future AI-assisted analysis.",
    approach: [
      "Created scripts that clone or update organizational repositories to a controlled local environment.",
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Covered approximately 500 component repositories within the broader 530-repository estate.",
      "Began creating ingestion paths for source code, PDFs, images, documents, Jira tickets, Confluence pages, and architecture artifacts.",
      "Organized context to support codebase analysis, architecture assessment, modernization planning, onboarding, and future AI-enabled SDLC workflows.",
      "Preserved human review as the authority for correctness and architectural intent.",
    ],
    outcomes: [
      "Created a foundation for AI-assisted architecture assessment and modernization.",
      "Reduced dependence on disconnected tribal knowledge.",
      "Connected code and delivery artifacts into a common context model.",
      "Established a safer and more practical path toward AI-enabled engineering workflows.",
    ],
    learned: [
      "Context ingestion is an architecture capability, not merely prompt engineering.",
      "Human review remains essential for intent and correctness.",
    ],
    principalFraming:
      "This work is positioned as the architecture and implementation foundation for AI-enabled modernization — not a fully deployed autonomous AI platform.",
    relatedCapabilities: [
      "AI-enabled SDLC and architecture automation",
      "Repository and context ingestion",
      "Human-reviewed architecture generation",
    ],
    diagram: "context-ingestion",
    sticky: false,
    featured: true,
    order: 3,
  },
  {
    slug: "code-derived-architecture",
    title: "Moving architecture documentation closer to the code lifecycle",
    shortTitle: "Code-derived architecture",
    eyebrow: "Architecture automation · Documentation lifecycle",
    summary:
      "Designed an approach that derives structural architecture facts from code while routing intent and correctness through architect review.",
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    keyMetric: "Architecture refresh: annual → ~4 hours",
    context:
      "Manually created architecture diagrams immediately began becoming stale as code and integrations changed.",
    challenge:
      "The organization needed architecture documentation that could be refreshed efficiently without allowing automatic tooling to misrepresent system intent.",
    role: "Design an architecture-documentation approach that derives structural information from source code and routes the result through architect review.",
    approach: [
      "Identify architecture facts that can be derived from code.",
      "Generate diagrams or diagram source from repository changes.",
      "Separate discovered structure from human-authored intent.",
      "Create review and approval steps for architects.",
      "Standardize visual style and notation.",
      "Make architecture updates part of the engineering lifecycle.",
      "Preserve the ability to override or annotate generated views.",
    ],
    outcomes: [
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Reduced current organizational architecture and high-level-design refresh effort from annual manual work to approximately four hours.",
      "Created the direction for code-derived diagrams that remain closer to the current system state.",
      "Preserved human approval for correctness, style, and intent.",
      "Improved the potential usefulness of architecture documentation for onboarding, design review, and modernization planning.",
    ],
    learned: [
      "Separate discoverable structure from human intent.",
      "Automation without review risks false precision.",
    ],
    principalFraming:
      "The broader code-derived architecture system is a current initiative. Completed improvements (refresh-cycle reduction) are distinct from planned or in-progress capabilities.",
    relatedCapabilities: [
      "Code-derived architecture documentation",
      "Architecture assessment automation",
      "Developer workflow modernization",
    ],
    diagram: "code-derived",
    sticky: false,
    featured: true,
    order: 4,
    openQuestions: [
      // PLACEHOLDER — refine with author before overstating maturity
      "Which parts of the code-derived pipeline are in production vs. pilot?",
    ],
  },
  {
    slug: "commerce-platform-modernization",
    title: "Modernizing business-critical commerce workflows without losing production reliability",
    shortTitle: "Commerce platform modernization",
    eyebrow: "Vail Resorts · Production systems",
    summary:
      "Hands-on work across APIs, payments, refunds, cancellations, integrations, and modernization — architecture grounded in production consequences.",
    context:
      "The platform supported guest commerce workflows across reservations, payments, refunds, cancellations, rentals, lift access, lesson management, scanning, food and beverage, and mobile and backend integrations.",
    challenge:
      "Changes had to preserve transactional correctness, data consistency, integration behavior, and operational continuity across production systems.",
    role: "Work hands-on across APIs, database behavior, integrations, modernization, testing, deployment, and production support.",
    approach: [
      "Built and maintained C#/.NET REST APIs.",
      "Implemented refund and cancellation workflows.",
      "Worked with payment authorization and credit-card gateway integrations.",
      "Used SQL Server, T-SQL, Dapper, ADO.NET, and transaction tables.",
      "Migrated legacy .NET Framework functionality toward modern .NET.",
      "Extracted service-layer behavior from stored procedures.",
      "Ported unit tests.",
      "Converted endpoints to asynchronous implementations.",
      "Integrated with MuleSoft APIs.",
      "Integrated with Azure Event Hub.",
      "Supported push notifications, SSRS reports, SQL Agent jobs, and mobile/backend contracts.",
      "Worked across deployment and production-support concerns.",
    ],
    outcomes: [
      "Evolved business-critical commerce capabilities while maintaining operational continuity.",
      "Preserved hands-on production credibility alongside architecture leadership.",
      "Gained direct experience with the consequences of architecture decisions in transactional and integration-heavy systems.",
    ],
    learned: [
      "Architecture judgment improves when it remains grounded in production failure modes.",
      "Transactional boundaries and integration contracts constrain modernization sequencing.",
    ],
    principalFraming:
      "This case study demonstrates that architecture decisions remain grounded in production systems, transactional behavior, integration failure modes, and implementation realities.",
    relatedCapabilities: [
      "Production systems and integration",
      "Transactional commerce workflows",
      ".NET and cloud modernization",
    ],
    diagram: "commerce-flow",
    sticky: false,
    featured: true,
    order: 5,
  },
  {
    slug: "retail-deployment-transformation",
    title: "Reducing a multi-month retail installation process to approximately one hour",
    shortTitle: "Retail deployment transformation",
    eyebrow: "IBM · Retail deployment",
    summary:
      "Led architecture and automation that reduced retail storefront installation from several months to approximately one hour.",
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    keyMetric: "Installation: months → ~1 hour",
    context: [
      "At IBM, retail storefront installation was slow, complex, and difficult to scale across a large retail footprint.",
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "The technology supported a retail environment of approximately 100,000 stores.",
    ],
    challenge: "The existing installation and delivery process could take several months.",
    role: "Lead architecture definition, client-facing solution design, automation direction, implementation coordination, and stakeholder alignment across three teams.",
    approach: [
      "Assessed the existing installation workflow.",
      "Identified architectural and operational bottlenecks.",
      "Redesigned the installation model.",
      "Introduced automation.",
      "Coordinated architecture and implementation across multiple teams.",
      "Worked with IBM stakeholders, client stakeholders, designers, sponsor users, engineers, and product owners.",
      "Used proof-of-concept work to reduce uncertainty.",
      "Supported hybrid-cloud environments across Azure, GCP, and on-premises systems.",
    ],
    outcomes: [
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "Reduced installation time from several months to approximately one hour.",
      "Improved deployment scalability.",
      "Reduced operational friction.",
      "Created a repeatable installation approach.",
      "Demonstrated architecture impact on the operating model rather than only the software structure.",
    ],
    learned: [
      "Architecture that changes operating models creates measurable business value.",
      "Proof-of-concept work reduces modernization uncertainty with stakeholders.",
    ],
    relatedCapabilities: [
      "CI/CD and delivery modernization",
      "Azure architecture",
      "Modernization sequencing",
    ],
    diagram: "deployment-transform",
    sticky: false,
    featured: true,
    order: 6,
  },
  {
    slug: "werner-enterprises-modernization",
    title: "Defining modernization patterns across a distributed .NET estate",
    shortTitle: "Werner Enterprises modernization",
    eyebrow: "Werner Enterprises · .NET modernization",
    summary:
      "Application architecture and platform modernization across mobile, web, internal platforms, external applications, .NET APIs, monolith decomposition, Azure, and CI/CD.",
    context:
      "Engagement under TEKsystems supporting modernization across a distributed .NET estate for a logistics organization.",
    challenge:
      "Modernize a multi-platform estate while improving boundaries, delivery systems, and implementation patterns without stopping product delivery.",
    scope: [
      // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
      "approximately 20 repositories",
      "approximately 20 components",
      "approximately 200 endpoints",
      "approximately 340 services",
      "two teams",
    ],
    role: "Application architecture and platform modernization across client platforms and services.",
    approach: [
      "iOS, Android, web, and internal platform architecture support.",
      "External customer-facing application work.",
      "CI/CD architecture improvements.",
      "Legacy .NET API modernization.",
      "Greenfield application delivery.",
      "Monolithic API decomposition.",
      "Lift-and-shift migrations.",
      "Strangler-pattern modernization.",
      "Infrastructure and CI/CD improvements.",
      "Application-boundary definition.",
      "Implementation patterns.",
      "AI/ML experimentation for data analysis and chatbots.",
    ],
    outcomes: [
      "Defined modernization patterns across a distributed estate.",
      "Improved application boundaries and delivery practices.",
      "Supported concurrent modernization and feature delivery approaches.",
    ],
    learned: [
      "Strangler patterns enable incremental modernization without a big-bang rewrite.",
      "Boundary definition is a prerequisite for safe decomposition.",
    ],
    relatedCapabilities: [
      ".NET and cloud modernization",
      "Monolith decomposition",
      "Strangler-pattern modernization",
    ],
    diagram: "code-derived",
    sticky: false,
    featured: false,
    order: 7,
    openQuestions: [
      // PLACEHOLDER — refine metrics and outcomes with author
      "Which modernization outcomes are strongest to highlight publicly vs. interviews only?",
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

export function getFeaturedCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => c.featured).sort((a, b) => a.order - b.order);
}

export function getAllCaseStudies(): CaseStudy[] {
  return [...caseStudies].sort((a, b) => a.order - b.order);
}

export function getStickyCaseStudies(): CaseStudy[] {
  return caseStudies.filter((c) => c.sticky).sort((a, b) => a.order - b.order);
}
