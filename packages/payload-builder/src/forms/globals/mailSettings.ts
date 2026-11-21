import type { Access, GlobalConfig } from 'payload'

/**
 * Form mail settings.
 *
 * Deliberately NOT an SMTP transport config: transport belongs to the
 * project's Payload email adapter (in our projects, Microsoft Graph over
 * OAuth — see `graphEmailAdapter`), and every secret stays in env. This
 * global only holds the editorial side: whether form mail is on, the
 * default recipients, and a display name.
 */

export interface MailSettingsOptions {
  slug?: string
  canUpdate?: Access
}

const loggedIn: Access = ({ req }) => Boolean(req.user)

export const buildFormMailSettingsGlobal = ({
  canUpdate,
  slug = 'form-mail-settings',
}: MailSettingsOptions = {}): GlobalConfig => ({
  slug,
  access: {
    read: loggedIn, // recipients are internal
    update: canUpdate ?? loggedIn,
  },
  admin: {
    description:
      'Email is sent through the server’s configured mail adapter (Microsoft Graph in our projects). ' +
      'Credentials live in server environment variables, never in the CMS — nothing on this screen holds a password.',
    group: 'Forms',
  },
  fields: [
    {
      name: 'enabled',
      admin: { description: 'Master switch — off means submissions are stored but no email is sent.' },
      defaultValue: true,
      type: 'checkbox',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'fromName',
          admin: { description: 'Display name on outgoing form mail. Default: the adapter’s.' },
          type: 'text',
        },
        {
          name: 'defaultAdminTo',
          admin: {
            description: 'Fallback notification recipient when a form has no “to” addresses of its own.',
          },
          type: 'email',
        },
      ],
    },
  ],
})
