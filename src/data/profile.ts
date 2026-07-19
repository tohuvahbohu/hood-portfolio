/**
 * Central configuration for public site identity and privacy toggles.
 * Update values here rather than editing multiple pages.
 */
export const profile = {
  name: "Michael Andrew Hood",
  shortName: "Michael",
  headline:
    "Principal Software Architect | Enterprise Architecture | SaaS Modernization | .NET / Azure | AI-Enabled SDLC",
  eyebrow: "Michael Andrew Hood — Principal Software Architect",
  roleTargets: [
    "Principal Software Architect",
    "Principal Application Architect",
    "Enterprise Modernization Architect",
    "AI Modernization Architect",
    "Principal Platform Architect",
    "Technical Fellow",
    "Director of Architecture",
    "Principal Solutions Architect",
  ],
  domain: "michaelandrewhood.com",
  siteUrl: "https://michaelandrewhood.com",
  email: "michael.andrew.hood@gmail.com",
  linkedIn: "https://linkedin.com/in/michael-andrew-hood",
  location: "Pensacola, Florida",
  workMode: "Remote-first",
  travel: "Available for occasional travel",

  /**
   * Current employer display controls.
   * Set showCurrentEmployerName to true and update currentEmployerName
   * to disclose the employer without editing multiple pages.
   */
  currentEmployerDisplayName:
    "Healthcare SaaS Company — Software Architect, Enterprise Architecture & AI Modernization",
  currentEmployerName: "", // set when disclosure is authorized
  showCurrentEmployerName: false,

  /**
   * Phone is intentionally disabled for the public site.
   * Populate phone and set showPhone to true only when needed for private materials.
   */
  phone: "",
  showPhone: false,

  /**
   * When false, metric cards still render but exact figures may be softened
   * via metrics.ts showExactMetrics usage on pages that care.
   */
  showExactMetrics: true,

  /**
   * Availability claim is opt-in so the public site never implies active job search
   * unless you enable it.
   */
  showAvailability: false,
  availabilityLabel: "Open to principal architecture conversations",

  résumé: {
    printEnabled: true,
    downloadLabel: "Print / Save as PDF",
  },

  hero: {
    primaryHeadline: "Enterprise architecture for systems that have to scale.",
    supportingCopy:
      "I help SaaS organizations understand complex application estates, modernize .NET platforms, standardize client integrations, and prepare engineering workflows for AI-enabled delivery.",
    supportingLine:
      "Enterprise architecture, modernization strategy, production engineering, and platform governance across healthcare SaaS, travel, logistics, retail, security, payments, and cloud environments.",
    primaryCta: { label: "Explore architecture outcomes", href: "#outcomes" },
    secondaryCta: { label: "View printable résumé", href: "/resume/" },
    tertiaryCta: { label: "Start a conversation", href: "/contact/" },
  },

  about: {
    paragraphs: [
      "I am a software architect and hands-on engineering leader focused on helping organizations understand and evolve complex software systems.",
      "My work sits at the intersection of enterprise architecture, production engineering, modernization strategy, product boundaries, client integration, developer experience, and AI-enabled delivery.",
      "I have worked across healthcare SaaS, travel, logistics, retail, security, payments, and cloud platforms. My strongest work typically begins where an organization has accumulated complexity faster than it has accumulated shared understanding.",
      "I create the models, reference patterns, implementation approaches, and modernization sequences that help teams make better decisions. I remain close to code, APIs, data movement, CI/CD, and production behavior because architecture should be informed by the systems teams actually have to build and operate.",
      "My current focus is helping SaaS organizations prepare for AI-enabled modernization without treating AI as a substitute for engineering judgment, architecture context, evaluation, governance, or human approval.",
    ],
  },

  contact: {
    heading: "Let’s talk about the systems behind the roadmap.",
    body: "I am interested in conversations about enterprise architecture, SaaS modernization, .NET platform strategy, client integration architecture, developer experience, and AI-enabled engineering transformation.",
  },

  resumeSummary: [
    "Principal-level software architect and hands-on engineering leader with 10+ years of experience modernizing enterprise software platforms across healthcare SaaS, travel, logistics, retail, security, payments, and cloud environments. Specializes in enterprise architecture, .NET modernization, SaaS product scalability, client integration strategy, API and event-driven architecture, architecture governance, developer-experience modernization, and AI-enabled SDLC.",
    "Known for turning complex application estates into understandable, governable, and scalable platforms that support modernization planning, delivery acceleration, technical risk reduction, client integration repeatability, and engineering adoption.",
  ],

  seo: {
    homeTitle: "Michael Andrew Hood | Principal Software Architect",
    homeDescription:
      "Principal software architect specializing in enterprise architecture, SaaS modernization, .NET and Azure platforms, client integration architecture, developer experience, and AI-enabled SDLC.",
    knowsAbout: [
      "Enterprise Architecture",
      "SaaS Modernization",
      ".NET",
      "Azure",
      "Client Integration Architecture",
      "API Architecture",
      "Event-Driven Architecture",
      "Developer Experience",
      "AI-Enabled SDLC",
      "Architecture Governance",
      "Platform Modernization",
    ],
  },

  /**
   * Portrait used across hero, header, about, and contact.
   * Prefer the optimized public asset; keep source files out of git if desired.
   */
  photo: {
    src: "/images/michael-andrew-hood.png",
    alt: "Portrait of Michael Andrew Hood",
    width: 640,
    height: 800,
  },

  social: {
    ogImage: "/og-image.svg",
    twitterHandle: "",
  },
} as const;

export type Profile = typeof profile;

/** Resolved public employer label based on disclosure toggle. */
export function getEmployerDisplayName(): string {
  if (profile.showCurrentEmployerName && profile.currentEmployerName) {
    return profile.currentEmployerName;
  }
  return profile.currentEmployerDisplayName;
}

/** Email parts for light obfuscation in HTML without harming accessibility. */
export function getEmailParts(): { user: string; domain: string } {
  const [user, domain] = profile.email.split("@");
  return { user, domain };
}
