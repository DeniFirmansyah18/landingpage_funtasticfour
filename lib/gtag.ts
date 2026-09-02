export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-FUNTASTIC4";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export interface GTagEvent {
  action: string;
  category?: string;
  label?: string;
  value?: number;
}

export const event = ({ action, category, label, value }: GTagEvent) => {
  if (typeof window !== "undefined" && (window as unknown as { gtag?: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom Helper Events
export const trackWhatsAppClick = (source = "contact_section") => {
  event({
    action: "click_whatsapp",
    category: "lead_generation",
    label: source,
  });
};

export const trackFormSubmit = (serviceName?: string) => {
  event({
    action: "submit_contact_form",
    category: "lead_generation",
    label: serviceName || "general_inquiry",
  });
};

export const trackCTAClick = (ctaName: string) => {
  event({
    action: "click_cta",
    category: "engagement",
    label: ctaName,
  });
};
