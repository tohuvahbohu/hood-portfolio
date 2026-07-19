export type CapabilityGroup = {
  id: string;
  title: string;
  items: string[];
};

export const capabilities: CapabilityGroup[] = [
  {
    id: "enterprise-architecture",
    title: "Enterprise architecture and estate visibility",
    items: [
      "Estate-wide architecture modeling",
      "Product and platform boundary definition",
      "Application portfolio assessment",
      "Dependency and integration mapping",
      "Architecture governance",
      "Technical risk identification",
      "Modernization sequencing",
    ],
  },
  {
    id: "saas-client-integration",
    title: "SaaS and client integration architecture",
    items: [
      "Client integration reference architectures",
      "Reusable implementation patterns",
      "Component, sequence, flow, and data-movement diagrams",
      "Data-transfer agreement documentation",
      "Productization of client delivery",
      "Integration repeatability",
      "Customization-boundary strategy",
    ],
  },
  {
    id: "dotnet-cloud",
    title: ".NET and cloud modernization",
    items: [
      "Legacy .NET estate assessment",
      "Modern .NET migration strategy",
      "Monolith decomposition",
      "Strangler-pattern modernization",
      "Service-layer extraction",
      "API modernization",
      "Azure architecture",
      "CI/CD and delivery modernization",
    ],
  },
  {
    id: "ai-enabled-sdlc",
    title: "AI-enabled SDLC and architecture automation",
    items: [
      "Repository and context ingestion",
      "Codebase analysis",
      "Architecture assessment automation",
      "Code-derived architecture documentation",
      "Jira and Confluence ingestion",
      "Human-reviewed architecture generation",
      "Developer workflow modernization",
      "AI modernization readiness",
    ],
  },
  {
    id: "production-systems",
    title: "Production systems and integration",
    items: [
      "Transactional commerce workflows",
      "Payments, refunds, and cancellation systems",
      "Event-driven integration",
      "MuleSoft integrations",
      "Azure Event Hub",
      "SQL Server transactional systems",
      "Production troubleshooting",
      "Reliability and data consistency",
    ],
  },
];

export const architectureStatement = {
  headline: "Architecture is useful only when it changes decisions.",
  paragraphs: [
    "I use architecture models, reference patterns, implementation standards, and code-level understanding to help organizations sequence modernization, reduce implementation risk, improve engineering adoption, and scale product delivery.",
    "Architecture documentation is not the end product. It is a mechanism for creating shared understanding, exposing dependencies, evaluating tradeoffs, accelerating onboarding, standardizing integrations, and aligning technical change with business direction.",
  ],
} as const;

export type Principle = {
  id: string;
  title: string;
  body: string;
};

export const principles: Principle[] = [
  {
    id: "decision-system",
    title: "Architecture is a decision system",
    body: "The purpose of architecture is not to produce diagrams. It is to improve the quality, speed, and consistency of decisions across product, engineering, implementation, and leadership.",
  },
  {
    id: "sequencing",
    title: "Modernization is sequencing, not rewriting",
    body: "Large estates cannot be modernized responsibly through indiscriminate replacement. Modernization requires dependency awareness, risk prioritization, incremental boundaries, and a credible transition architecture.",
  },
  {
    id: "product-boundaries",
    title: "Product boundaries are part of the architecture",
    body: "When a SaaS company accepts unlimited client-specific behavior, technical complexity becomes a business-model problem. Architecture should help define what belongs in the product, what belongs in configuration, and what should not be supported.",
  },
  {
    id: "connected-to-code",
    title: "Architecture should remain connected to code",
    body: "Static documentation becomes stale. Architecture should increasingly be derived from repositories, interfaces, deployment metadata, and runtime evidence, while preserving human review of intent and correctness.",
  },
  {
    id: "ai-context",
    title: "AI requires context and governance",
    body: "AI-assisted modernization depends on accessible organizational context, evaluation, traceability, human approval, and clear boundaries. Context ingestion is an architecture capability, not merely a prompt-engineering task.",
  },
  {
    id: "close-to-delivery",
    title: "Principal architects stay close to delivery",
    body: "Architecture judgment improves when it remains grounded in APIs, data movement, production constraints, deployment systems, integration behavior, and the consequences of implementation decisions.",
  },
];
