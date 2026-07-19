import { getEmployerDisplayName } from "./profile";
import { estateDetails } from "./metrics";

export type ExperienceEntry = {
  id: string;
  organization: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  selectedScope?: string[];
  keyOutcome?: string;
  clients?: {
    name: string;
    summary: string;
  }[];
  isCurrent?: boolean;
};

/**
 * Executive timeline entries. Client engagements under TEKsystems stay nested
 * so the timeline does not look like simultaneous full-time positions.
 */
export function getExperience(): ExperienceEntry[] {
  const currentOrg = getEmployerDisplayName().includes("—")
    ? getEmployerDisplayName().split("—")[0].trim()
    : getEmployerDisplayName();

  return [
    {
      id: "healthcare-saas",
      organization: currentOrg,
      title: "Software Architect, Enterprise Architecture & AI Modernization",
      period: "2025–Present",
      location: "Remote",
      isCurrent: true,
      summary:
        "Leading enterprise architecture, client integration standardization, .NET estate modernization, architecture automation, developer-experience improvement, and AI-enabled SDLC readiness for a post-acquisition healthcare SaaS company.",
      selectedScope: [
        // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
        `${estateDetails.repositories} repositories`,
        `${estateDetails.priorityServices} priority services`,
        `${estateDetails.apis} APIs`,
        `approximately ${estateDetails.endpointsApprox.toLocaleString()} endpoints`,
        `${estateDetails.customerFacingApps} customer-facing applications`,
        `${estateDetails.clientContexts} client contexts`,
        `${estateDetails.teamsInfluenced} teams influenced`,
      ],
    },
    {
      id: "teksystems",
      organization: "TEKsystems",
      title: "Application Architect / Senior Software Engineer, Client Engagements",
      period: "2021–2026",
      location: "Remote",
      summary:
        "Client engagements spanning enterprise commerce, payments, integrations, API modernization, and distributed .NET platform modernization.",
      clients: [
        {
          name: "Vail Resorts",
          summary:
            "Enterprise commerce, payment, integration, API modernization, and production systems across guest reservations, refunds, cancellations, rentals, lift access, lessons, scanning, and food-and-beverage workflows.",
        },
        {
          name: "Werner Enterprises",
          summary:
            "Application architecture and platform modernization across mobile, web, internal platforms, external applications, .NET APIs, monolith decomposition, Azure, and CI/CD.",
        },
      ],
    },
    {
      id: "ibm",
      organization: "IBM",
      title: "Application Architect, Azure Cloud Microservices, Product Owner & Team Manager",
      period: "2018–2021",
      location: "",
      summary:
        "Led client-facing architecture and delivery across three teams for retail point-of-sale, tax and accounting applications, internal tools, storefront installations, hybrid cloud, and back-office systems.",
      keyOutcome:
        // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
        "Reduced retail storefront installation time from several months to approximately one hour.",
    },
    {
      id: "appriver",
      organization: "AppRiver",
      title: "Associate Software Developer",
      period: "2015–2018",
      location: "",
      summary:
        // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
        `Built and supported SaaS applications, internal tooling, Windows applications, eventing systems, installers, drivers, and cloud services serving ${estateDetails.appRiverCompanies.toLocaleString()} companies and ${estateDetails.appRiverMailboxes.toLocaleString()} mailboxes.`,
      keyOutcome:
        // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
        `Led a critical SecureSurf Desktop Agent initiative that prevented a major outage and preserved use across approximately ${estateDetails.secureSurfCompaniesApprox.toLocaleString()} companies.`,
    },
  ];
}

export const skills = {
  architecture: [
    "Enterprise architecture modeling",
    "Modernization sequencing",
    "Reference architectures",
    "Service boundary definition",
    "Architecture governance",
    "Code-derived documentation",
  ],
  platforms: [".NET / C#", "Azure", "SQL Server", "REST APIs", "Event-driven integration", "CI/CD"],
  domains: [
    "Healthcare SaaS",
    "Travel & hospitality commerce",
    "Logistics",
    "Retail",
    "Security / SaaS email",
    "Payments",
  ],
  aiEnabledSdlc: [
    "Context ingestion",
    "Codebase analysis",
    "Architecture assessment automation",
    "Human-reviewed architecture generation",
    "Developer workflow modernization",
    "Modernization readiness",
  ],
} as const;
