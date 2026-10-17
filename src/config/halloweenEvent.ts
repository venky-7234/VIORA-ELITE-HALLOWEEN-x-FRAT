 const env = import.meta.env;

export const halloweenEvent = {
  dateTime: env.VITE_HALLOWEEN_EVENT_DATETIME?.trim() || "",
  timeZone: env.VITE_HALLOWEEN_EVENT_TIMEZONE?.trim() || "",
  location: env.VITE_HALLOWEEN_EVENT_LOCATION?.trim() || "",
  venue: env.VITE_HALLOWEEN_EVENT_VENUE?.trim() || "",
  contactEmail: env.VITE_HALLOWEEN_CONTACT_EMAIL?.trim() || "",
  instagram:
    env.VITE_HALLOWEEN_SOCIAL_INSTAGRAM?.trim() ||
    "https://www.instagram.com/viora.elite?dlrf=enc3anpzN2UwNmty",
  websiteUrl:
    env.VITE_HALLOWEEN_WEBSITE_URL?.trim() ||
    "https://www.vioraelite.com",
  privacyUrl: env.VITE_HALLOWEEN_PRIVACY_URL?.trim() || "",
  termsUrl: env.VITE_HALLOWEEN_TERMS_URL?.trim() || "",
  googleSheetsWebhookUrl:
    env.VITE_GOOGLE_SHEETS_WEBHOOK_URL?.trim() ||
    "https://script.google.com/macros/s/AKfycbyOzTaCSBuUHj0k_n4OxkGaipXTf8VZIfMYqKZHMPbHPHKcsMIfSGGvuXlgtR7UKM3FXw/exec",
};

export const halloweenEventTimestamp = halloweenEvent.dateTime
  ? Date.parse(halloweenEvent.dateTime)
  : Number.NaN;
