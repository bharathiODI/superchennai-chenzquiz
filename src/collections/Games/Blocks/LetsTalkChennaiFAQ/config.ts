import type { Block } from 'payload'

export const LetsTalkChennaiFAQBlock: Block = {
  slug: 'letsTalkChennaiFaq',
  labels: {
    singular: "Let's Talk Chennai FAQ Block",
    plural: "Let's Talk Chennai FAQ Blocks",
  },
  fields: [
    /* =========================================
       SEO HEADING (HIDDEN H1)
    ========================================= */
    {
      name: 'seoH1',
      type: 'text',
      label: 'SEO Hidden H1 Heading',
      admin: {
        description: 'Purely for SEO H1 ranking purpose (hidden visually).',
        placeholder: "Ex: Let's Talk Chennai - Frequently Asked Questions",
      },
    },

    /* =========================================
       BACKGROUND IMAGE FIELD (NEWLY ADDED)
    ========================================= */
    {
      name: 'bgImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Section Background Image',
      admin: {
        description: 'Optional section background image.',
      },
    },

    /* =========================================
       SECTION HEADER FIELDS
    ========================================= */
    {
      name: 'eyebrow',
      type: 'text',
      defaultValue: 'FAQ',
      label: 'Main Eyebrow / Large Header Text',
      required: true,
    },
    {
      name: 'heading',
      type: 'text',
      defaultValue: 'Frequently Asked Questions',
      label: 'Section Subtitle / Main Heading',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      defaultValue:
        'Find answers to common questions about stories, features, submissions, and events on Let’s Talk Chennai.',
      label: 'Section Description (Optional)',
    },

    /* =========================================
       ACCORDION SETTINGS
    ========================================= */
    {
      name: 'allowMultipleOpen',
      type: 'checkbox',
      defaultValue: false,
      label: 'Allow Multiple FAQs Open Simultaneously',
      admin: {
        description:
          'If checked, multiple FAQ cards can remain open at the same time. Default opens one at a time.',
      },
    },

    /* =========================================
       FAQ ITEMS ARRAY
    ========================================= */
    {
      name: 'faqs',
      type: 'array',
      label: 'FAQ Items List',
      minRows: 1,
      defaultValue: [
        {
          question: 'How do I play the interactive quiz games?',
          answer:
            'Select any quiz from our home or quiz listing page, choose your gameplay mode (MCQ, Wordle, Match the Following, etc.), and follow the onscreen interactive prompts to answer questions.',
        },
        {
          question: 'How is scoring and leaderboard ranking calculated?',
          answer:
            'Points are awarded based on correct answers, response speed, and difficulty level. Bonus points are earned for streak multipliers and completing special challenges without mistakes.',
        },
        {
          question: 'Can I replay a quiz to improve my score?',
          answer:
            'Yes! You can replay any completed quiz or challenge mode as many times as you like to beat your personal best and climb higher on the global Chennai leaderboard.',
        },
        {
          question: 'Are there different game types available?',
          answer:
            'Absolutely! We feature a wide variety of engaging mini-games including MCQ, Dropdowns, Wordle, Word Finder, Match the Following, Spot the Lie, Re-order, and Drag & Drop puzzles.',
        },
        {
          question: 'How can I report an issue or suggest a new question?',
          answer:
            'If you spot any discrepancy in a question or want to suggest new trivia topics about Chennai, feel free to reach out to our team using the contact link below.',
        },
      ],
      fields: [
        {
          name: 'question',
          type: 'text',
          required: true,
          label: 'Question',
        },
        {
          name: 'answer',
          type: 'textarea',
          required: true,
          label: 'Answer',
        },
      ],
    },

    /* =========================================
       BOTTOM CTA BUTTON (OPTIONAL)
    ========================================= */
    {
      name: 'ctaText',
      type: 'text',
      defaultValue: 'Have more questions? Contact our team',
      label: 'Bottom CTA Text',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      label: 'Bottom CTA Target URL',
      admin: {
        placeholder: 'e.g., /contact',
      },
    },
  ],
}
