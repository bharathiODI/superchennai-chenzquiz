import type { Access, GlobalConfig } from 'payload'

/**
 * Form security settings — reCAPTCHA v3 + rate limits, editor-tunable.
 * The reCAPTCHA SECRET comes from env (`RECAPTCHA_SECRET_KEY`) only; the
 * site key here is the single security value allowed to reach the browser.
 */

export interface SecuritySettingsOptions {
  slug?: string
  canUpdate?: Access
}

const loggedIn: Access = ({ req }) => Boolean(req.user)

export const buildFormSecuritySettingsGlobal = ({
  canUpdate,
  slug = 'form-security-settings',
}: SecuritySettingsOptions = {}): GlobalConfig => ({
  slug,
  access: {
    read: () => true, // the client needs the site key + enabled flag; nothing here is secret
    update: canUpdate ?? loggedIn,
  },
  admin: {
    description:
      'Bot protection for the public forms. The reCAPTCHA secret key lives in the server environment ' +
      '(RECAPTCHA_SECRET_KEY) — with no secret configured, verification is skipped so local development still works.',
    group: 'Forms',
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'recaptchaEnabled', defaultValue: false, type: 'checkbox' },
        // Always visible (no admin.condition): hiding these behind the
        // checkbox confused key rotation — the Site Key field only appeared
        // after save + reload (TII staging review, 2026-09-03).
        {
          name: 'recaptchaSiteKey',
          admin: { description: 'Public v3 site key. The SECRET lives only in env (RECAPTCHA_SECRET_KEY).' },
          type: 'text',
        },
        {
          name: 'recaptchaMinScore',
          admin: {
            description: 'Start at 0.5. Raise to 0.7 if spam persists; lower to 0.3 if real people are blocked.',
          },
          defaultValue: 0.5,
          max: 1,
          min: 0,
          type: 'number',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'rateLimitEnabled', defaultValue: true, type: 'checkbox' },
        {
          name: 'rateLimitMax',
          admin: { description: 'Submissions allowed per window, per visitor IP.' },
          defaultValue: 8,
          min: 1,
          type: 'number',
        },
        {
          name: 'rateLimitWindowMinutes',
          defaultValue: 10,
          min: 1,
          type: 'number',
        },
        {
          name: 'uploadLimitMax',
          admin: { description: 'File uploads allowed per window, per visitor IP.' },
          defaultValue: 20,
          min: 1,
          type: 'number',
        },
      ],
    },
  ],
})
