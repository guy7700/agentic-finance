/**
 * Form definitions shared by the client (inline validation) and the
 * /api/enquiry route (authoritative validation before delivery).
 */

export type FormKind = 'speaker-nomination' | 'partnership' | 'contact';

export type FieldRule = {
  label: string;
  required?: boolean;
  max: number;
  type?: 'text' | 'email' | 'url' | 'list' | 'boolean';
  /** Allowed values for selects. */
  options?: readonly string[];
};

export const enquiryTypes = [
  { value: 'attendance', label: 'Attendance and invitations' },
  { value: 'partnership', label: 'Partnerships' },
  { value: 'speaking', label: 'Speaking' },
  { value: 'press', label: 'Press and media' },
  { value: 'general', label: 'Something else' },
] as const;

export const partnershipLevels = [
  'Ecosystem presence',
  'Stage and activation',
  'Category lead',
  'Custom activation',
  'Not sure yet',
] as const;

export const sectors = [
  'Institutional finance',
  'Crypto infrastructure',
  'Payments & card networks',
  'AI / ML',
  'Exchange / trading venue',
  'Protocol / DeFi',
  'Data / analytics',
  'VC / investment',
  'Other',
] as const;

export const partnershipInterests = [
  'Speak on stage',
  'Own a category',
  'BD meetings with attendees',
  'Brand exposure & PR',
  'VIP Gala',
  'Host a workshop or private session',
  'Custom activation',
] as const;

export const NOT_SURE = 'Not sure yet - help me choose';

const S = 200;
const M = 500;
const L = 2000;

export const schemas: Record<FormKind, Record<string, FieldRule>> = {
  'speaker-nomination': {
    nominatorName: { label: 'Your name', required: true, max: S },
    nominatorEmail: { label: 'Your email', required: true, max: S, type: 'email' },
    nominatorCompany: { label: 'Your company', required: true, max: S },
    nominatorTelegram: { label: 'Telegram', max: S },
    nominatingSelf: { label: 'Nominating yourself', max: 5, type: 'boolean' },
    speakerName: { label: 'Speaker name', required: true, max: S },
    speakerRole: { label: 'Role or title', required: true, max: S },
    speakerCompany: { label: 'Company or institution', required: true, max: S },
    speakerEmail: { label: 'Speaker email', max: S, type: 'email' },
    speakerLinkedin: { label: 'LinkedIn', max: M, type: 'url' },
    speakerX: { label: 'X (Twitter)', max: M },
    speakerWebsite: { label: 'Website', max: M, type: 'url' },
    edition: { label: 'Edition', max: S },
    topic: { label: 'Proposed topic', max: M },
    reason: { label: 'Why this speaker', max: L },
  },
  partnership: {
    contactName: { label: 'Your name', required: true, max: S },
    email: { label: 'Work email', required: true, max: S, type: 'email' },
    companyName: { label: 'Company', required: true, max: S },
    role: { label: 'Role', max: S },
    website: { label: 'Company website', max: M, type: 'url' },
    handle: { label: 'Telegram or Discord', max: S },
    sector: { label: 'Sector', max: S, options: sectors },
    category: { label: 'Category', max: S },
    tier: { label: 'Level of involvement', max: S, options: partnershipLevels },
    interests: { label: 'Interests', max: M, type: 'list' },
    about: { label: 'What your company does', max: M },
    goals: { label: 'Anything else', max: L },
    agreeUpdates: { label: 'Consent to be contacted', required: true, max: 5, type: 'boolean' },
  },
  contact: {
    name: { label: 'Your name', required: true, max: S },
    email: { label: 'Email', required: true, max: S, type: 'email' },
    organization: { label: 'Organisation', max: S },
    role: { label: 'Role', max: S },
    enquiryType: { label: 'Enquiry type', required: true, max: S, options: enquiryTypes.map((e) => e.value) },
    edition: { label: 'Edition', max: S },
    message: { label: 'Message', required: true, max: L },
  },
};

const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export function isUrl(value: string) {
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Remove control and markup characters, trim, and enforce the max length. */
export function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value
    .replace(/[<>`\\]/g, '')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .slice(0, max)
    .trim();
}

export type ValidationResult = { ok: true; data: Record<string, string | string[] | boolean> } | { ok: false; errors: Record<string, string> };

export function validate(kind: FormKind, input: Record<string, unknown>): ValidationResult {
  const schema = schemas[kind];
  const errors: Record<string, string> = {};
  const data: Record<string, string | string[] | boolean> = {};

  for (const [key, rule] of Object.entries(schema)) {
    const raw = input[key];
    if (rule.type === 'boolean') {
      const v = raw === true || raw === 'true' || raw === 'on' || raw === 'yes';
      if (rule.required && !v) errors[key] = 'Please tick this box to continue.';
      data[key] = v;
      continue;
    }
    if (rule.type === 'list') {
      const arr = Array.isArray(raw) ? raw.map((x) => clean(x, S)).filter(Boolean).slice(0, 20) : [];
      data[key] = arr;
      continue;
    }
    const v = clean(raw, rule.max);
    if (rule.required && !v) {
      errors[key] = `${rule.label} is required.`;
      continue;
    }
    if (v && rule.type === 'email' && !EMAIL.test(v)) errors[key] = 'Please enter a valid email address.';
    if (v && rule.type === 'url' && !isUrl(v)) errors[key] = 'Please enter a full URL, starting with https://';
    if (v && rule.options && !rule.options.includes(v)) errors[key] = `Please choose a valid ${rule.label.toLowerCase()}.`;
    data[key] = v;
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}
