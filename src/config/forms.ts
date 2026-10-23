/**
 * Form delivery for the static site. Submissions go straight from the browser
 * to the Google Apps Script web apps the live Abu Dhabi site already uses. Both
 * scripts allow cross-site requests, so the browser can read the reply and only
 * shows success once delivery is confirmed.
 *
 * Delivery is off unless NEXT_PUBLIC_FORMS_LIVE=true at build time, so local
 * builds never write test rows into the production sheets. When it is off, the
 * visitor is told so and given a direct email address. Nothing is discarded silently.
 */
const LEGACY_PARTNER_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbxCein8YAxx6l-8GIMHE4p9Ntp2vVQW_v5JSI1a_25zkP56UAoOPISTrhQBFA5fVt1WTQ/exec';
const LEGACY_GENERAL_WEBHOOK =
  'https://script.google.com/macros/s/AKfycbyRCYtXJlce4zQefZbpZJ6MWfMVCgKaf0rvXv7cbiMt-UjQwT1-61sgfx33m9gy0sUbGQ/exec';

const live = process.env.NEXT_PUBLIC_FORMS_LIVE === 'true';

export const formWebhooks = {
  /** Partnership enquiries and speaker nominations (same sheet as Abu Dhabi). */
  partner: process.env.NEXT_PUBLIC_AF_PARTNER_WEBHOOK_URL || (live ? LEGACY_PARTNER_WEBHOOK : undefined),
  /** Contact, press and attendance enquiries. */
  general: process.env.NEXT_PUBLIC_AF_GENERAL_WEBHOOK_URL || (live ? LEGACY_GENERAL_WEBHOOK : undefined),
};
