export type NavItem = {
  label: string;
  href: string;
  external?: boolean;
};

/** Primary site navigation — homepage section anchors + key routes. */
export const primaryNav: NavItem[] = [
  { label: "Overview", href: "/#overview" },
  { label: "Outcomes", href: "/#outcomes" },
  { label: "Work", href: "/work/" },
  { label: "Experience", href: "/#experience" },
  { label: "Approach", href: "/#approach" },
  { label: "Résumé", href: "/resume/" },
  { label: "Contact", href: "/contact/" },
];

export const footerNav: NavItem[] = [
  { label: "Work", href: "/work/" },
  { label: "About", href: "/about/" },
  { label: "Résumé", href: "/resume/" },
  { label: "Contact", href: "/contact/" },
];
