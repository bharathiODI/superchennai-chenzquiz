import type { Access, Field, GlobalConfig } from 'payload'
import { L } from '../i18n/localized'

/**
 * Site Settings — the WordPress "General Settings" equivalent, generalised
 * so any project inherits it.
 *
 * Tabs: General · Branding · Contact · Social · SEO · Scripts · Advanced.
 */

export interface SiteSettingsOptions {
  slug?: string
  mediaSlug?: string
  canUpdate?: Access
  /** Extra tabs specific to the project. */
  extraTabs?: { description?: string; fields: Field[]; label: string }[]
}

export const buildSiteSettingsGlobal = ({
  canUpdate,
  extraTabs = [],
  mediaSlug = 'media',
  slug = 'site-settings',
}: SiteSettingsOptions = {}): GlobalConfig => ({
  slug,
  access: { read: () => true, ...(canUpdate ? { update: canUpdate } : {}) },
  admin: {
    description: 'Site identity, contact details, SEO defaults, analytics and advanced options.',
    group: 'Settings',
  },
  fields: [
    {
      tabs: [
        {
          fields: [
            L({ name: 'siteName', required: true, type: 'text' }),
            L({ name: 'tagline', type: 'text' }),
            L({
              name: 'description',
              admin: { description: 'Used as the default meta description.' },
              type: 'textarea',
            }),
            {
              type: 'row',
              fields: [
                {
                  name: 'siteUrl',
                  admin: { description: 'No trailing slash.', placeholder: 'https://example.gov.ae' },
                  type: 'text',
                },
                {
                  name: 'maintenanceMode',
                  admin: { description: 'Shows a holding page to visitors. Admins still see the site.' },
                  defaultValue: false,
                  type: 'checkbox',
                },
              ],
            },
            L({
              name: 'maintenanceMessage',
              admin: { condition: (data) => Boolean(data?.maintenanceMode) },
              type: 'textarea',
            }),
            L({
              name: 'copyright',
              admin: { description: 'Use {year} for the current year.' },
              defaultValue: '© {year} All rights reserved.',
              type: 'text',
            }),
          ],
          label: 'General',
        },

        {
          fields: [
            { name: 'logo', relationTo: mediaSlug as never, type: 'upload' },
            { name: 'logoDark', label: 'Logo (dark backgrounds)', relationTo: mediaSlug as never, type: 'upload' },
            { name: 'favicon', relationTo: mediaSlug as never, type: 'upload' },
            {
              type: 'row',
              fields: [
                { name: 'brandColor', admin: { placeholder: '#0E4C45' }, type: 'text' },
                { name: 'accentColor', admin: { placeholder: '#3B82F6' }, type: 'text' },
              ],
            },
            {
              name: 'containerWidth',
              admin: { description: 'Max width of contained sections.', placeholder: '1200px' },
              type: 'text',
            },
          ],
          label: 'Branding',
        },

        {
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email' },
                { name: 'phone', type: 'text' },
              ],
            },
            L({ name: 'address', type: 'textarea' }),
            { name: 'mapEmbedUrl', label: 'Map embed URL', type: 'text' },
            L({ name: 'officeHours', type: 'text' }),
          ],
          label: 'Contact',
          name: 'contact',
        },

        {
          fields: [
            {
              name: 'socialLinks',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      options: [
                        'LinkedIn',
                        'X',
                        'Facebook',
                        'Instagram',
                        'YouTube',
                        'WhatsApp',
                        'TikTok',
                      ].map((v) => ({ label: v, value: v.toLowerCase() })),
                      type: 'select',
                    },
                    { name: 'url', required: true, type: 'text' },
                  ],
                },
                L({ name: 'label', admin: { description: 'Accessible label.' }, type: 'text' }),
              ],
              labels: { plural: 'Social links', singular: 'Social link' },
              type: 'array',
            },
          ],
          label: 'Social',
        },

        {
          description: 'Defaults used when a page does not set its own values.',
          fields: [
            L({ name: 'metaTitleSuffix', admin: { placeholder: ' — Site Name' }, type: 'text' }),
            L({ name: 'metaDescription', type: 'textarea' }),
            { name: 'ogImage', label: 'Default share image', relationTo: mediaSlug as never, type: 'upload' },
            {
              type: 'row',
              fields: [
                {
                  name: 'noindex',
                  admin: { description: 'Blocks search engines site-wide. Use on staging only.' },
                  defaultValue: false,
                  label: 'Discourage search engines',
                  type: 'checkbox',
                },
                { name: 'twitterHandle', admin: { placeholder: '@handle' }, type: 'text' },
              ],
            },
            {
              name: 'robotsTxt',
              admin: { description: 'Leave blank for sensible defaults.' },
              label: 'robots.txt additions',
              type: 'textarea',
            },
            {
              name: 'organizationSchema',
              admin: { description: 'Adds Organization JSON-LD to every page.' },
              defaultValue: true,
              label: 'Output Organization structured data',
              type: 'checkbox',
            },
          ],
          label: 'SEO',
          name: 'seo',
        },

        {
          description:
            'Injected site-wide. Only administrators can edit these — treat them as code.',
          fields: [
            { name: 'gtmId', admin: { placeholder: 'GTM-XXXXXXX' }, label: 'Google Tag Manager ID', type: 'text' },
            { name: 'gaId', admin: { placeholder: 'G-XXXXXXXXXX' }, label: 'Google Analytics ID', type: 'text' },
            {
              name: 'recaptchaSiteKey',
              admin: { description: 'The secret key belongs in an environment variable, not here.' },
              label: 'reCAPTCHA site key',
              type: 'text',
            },
            { name: 'headScripts', label: 'Custom <head> scripts', type: 'code' },
            { name: 'bodyScripts', label: 'Custom end-of-body scripts', type: 'code' },
          ],
          label: 'Scripts & Analytics',
          name: 'scripts',
        },

        ...extraTabs,
      ],
      type: 'tabs',
    },
  ],
  label: 'Site Settings',
})

/* ------------------------------------------------------------------ */
/* Per-document SEO fields                                             */
/* ------------------------------------------------------------------ */

/**
 * Drop into any collection to give it a WordPress/Yoast-style SEO tab.
 * Values here override the site defaults above.
 */
export const seoFields = (mediaSlug = 'media'): Field => ({
  name: 'seo',
  admin: { description: 'Leave blank to inherit the site defaults.' },
  fields: [
    L({ name: 'title', admin: { description: 'Around 60 characters.' }, type: 'text' }),
    L({ name: 'description', admin: { description: 'Around 155 characters.' }, type: 'textarea' }),
    { name: 'image', label: 'Share image', relationTo: mediaSlug as never, type: 'upload' },
    {
      type: 'row',
      fields: [
        { name: 'noindex', defaultValue: false, label: 'Hide from search engines', type: 'checkbox' },
        { name: 'canonical', label: 'Canonical URL', type: 'text' },
      ],
    },
    L({
      name: 'keywords',
      admin: { description: 'Rarely used by search engines. Optional.' },
      type: 'text',
    }),
  ],
  label: 'SEO',
  type: 'group',
})
