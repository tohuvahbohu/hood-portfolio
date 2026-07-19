/**
 * Single source of truth for public metrics.
 * Reference these IDs from pages rather than duplicating figures.
 */

export type Metric = {
  id: string;
  value: string;
  label: string;
  context?: string;
  group: "healthcare" | "delivery" | "retail" | "legacy";
  /** USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION */
  verifyBeforePublication: true;
  approximate: boolean;
  publicSafe: boolean;
};

export const healthcareEstateNarrative =
  "The healthcare SaaS estate spans 530 repositories, including approximately 500 component repositories, 40 priority services, 83 APIs, approximately 2,000 endpoints, and 11 customer-facing applications.";

export const metrics: Metric[] = [
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "repos-mapped",
    value: "530",
    label: "repositories mapped within a healthcare SaaS estate",
    context: healthcareEstateNarrative,
    group: "healthcare",
    verifyBeforePublication: true,
    approximate: false,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "apis-assessed",
    value: "83",
    label: "APIs and approximately 2,000 endpoints assessed",
    context: healthcareEstateNarrative,
    group: "healthcare",
    verifyBeforePublication: true,
    approximate: true,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "customer-apps",
    value: "11",
    label: "customer-facing applications represented",
    context: healthcareEstateNarrative,
    group: "healthcare",
    verifyBeforePublication: true,
    approximate: false,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "client-contexts",
    value: "72",
    label: "healthcare client integration contexts supported",
    group: "healthcare",
    verifyBeforePublication: true,
    approximate: false,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "client-prep-time",
    value: "1 week → hours",
    label: "client architecture preparation reduced from approximately one week to hours",
    group: "delivery",
    verifyBeforePublication: true,
    approximate: true,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "onboarding-time",
    value: "2 weeks → 1 day",
    label: "role-focused onboarding reduced from approximately two weeks to one day",
    group: "delivery",
    verifyBeforePublication: true,
    approximate: true,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "architecture-refresh",
    value: "annual → ~4 hours",
    label:
      "architecture refresh cycles reduced from annual manual work to approximately four hours",
    group: "delivery",
    verifyBeforePublication: true,
    approximate: true,
    publicSafe: true,
  },
  {
    // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
    id: "retail-install",
    value: "months → ~1 hour",
    label: "retail software installation reduced from several months to approximately one hour",
    group: "retail",
    verifyBeforePublication: true,
    approximate: true,
    publicSafe: true,
  },
];

/** Homepage outcome grid — high-signal subset. */
export const homepageMetricIds = [
  "repos-mapped",
  "apis-assessed",
  "customer-apps",
  "client-contexts",
  "client-prep-time",
  "onboarding-time",
  "architecture-refresh",
  "retail-install",
] as const;

export function getMetric(id: string): Metric | undefined {
  return metrics.find((m) => m.id === id);
}

export function getHomepageMetrics(): Metric[] {
  return homepageMetricIds.map((id) => getMetric(id)).filter((m): m is Metric => Boolean(m));
}

/** Supporting estate figures (not all shown as hero counters). */
export const estateDetails = {
  // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION
  repositories: 530,
  componentRepositoriesApprox: 500,
  priorityServices: 40,
  apis: 83,
  endpointsApprox: 2000,
  customerFacingApps: 11,
  clientContexts: 72,
  teamsInfluenced: 15,
  // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION (IBM retail footprint)
  ibmRetailStoresApprox: 100_000,
  // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION (AppRiver)
  appRiverCompanies: 60_000,
  appRiverMailboxes: 10_000_000,
  secureSurfCompaniesApprox: 1500,
  // USER-PROVIDED METRIC — VERIFY BEFORE PUBLICATION (Werner)
  wernerRepositoriesApprox: 20,
  wernerComponentsApprox: 20,
  wernerEndpointsApprox: 200,
  wernerServicesApprox: 340,
  wernerTeams: 2,
} as const;
