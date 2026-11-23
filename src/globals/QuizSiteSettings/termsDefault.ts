/**
 * The ChenZ – Daily Trivia Terms & Conditions as supplied for launch (22 Nov 2026).
 * Used as the default for Quiz Site Settings > Terms & Conditions, and whenever that field is
 * left empty. Editors change the live text in the CMS; this file only seeds it.
 */

const INTRO =
  'ChenZ – Daily Trivia is an online trivia contest organised by Super Chennai. By participating in ChenZ – Daily Trivia, participants agree to abide by the following Terms & Conditions.'

const SECTIONS: { heading: string; points: string[] }[] = [
  {
    heading: '1. Contest Format',
    points: [
      'Three trivia questions will be published every day at 12:30 AM.',
      'Each question will have a time limit of 20 seconds.',
      'Participants must submit their answers within the allotted time.',
      'The quiz will be conducted through the ChenZ – Daily Trivia platform on the Super Chennai website or other designated digital platforms.',
      'The organisers reserve the right to determine the format, content and schedule of the contest.',
    ],
  },
  {
    heading: '2. Scoring',
    points: [
      'Points will be awarded based on the correctness of answers and response time.',
      'Participants who answer correctly in the shortest time will earn higher points.',
      'Incorrect or unanswered questions will receive zero points.',
      'Scores from all three questions will contribute to the participant’s daily score.',
      'Daily scores will also contribute towards the cumulative 90-day leaderboard.',
      'The scoring system implemented on the platform will determine the points awarded.',
      'Platform-recorded scores, subject to verification, will be considered for winner* determination and leaderboard rankings.',
    ],
  },
  {
    heading: '3. Daily Winners & Gift Vouchers',
    points: [
      'Every day, participants who answer all three questions correctly in the fastest time will be eligible to win* daily gift vouchers.',
      'The three participants who complete all three questions correctly with the fastest overall response times will be declared the daily winners.',
      'Winners will be determined based on the time taken to correctly answer all three questions, subject to verification.',
      'Participants who do not answer all three questions correctly will not be eligible for the daily gift vouchers.',
      'In the event of a tie, the organisers may consider individual response times, overall performance or other appropriate tie-breaking criteria.',
      'Daily winners may be required to undergo verification before prizes are awarded.',
      'If a winner is found ineligible, fails verification or cannot be contacted within the stipulated time, the organisers reserve the right to select an alternate winner.',
    ],
  },
  {
    heading: '4. 90-Day Contest & Leaderboard',
    points: [
      'ChenZ – Daily Trivia will run for a period of 90 days, subject to the schedule announced by the organisers.',
      'Participants will accumulate points based on their performance across the daily quizzes throughout the contest period.',
      'Points earned from all three questions each day will contribute to the cumulative 90-day leaderboard.',
      'The leaderboard will reflect the cumulative scores of participants throughout the contest period.',
      'The participant with the highest cumulative score at the end of the 90-day contest will be declared the overall winner, subject to verification.',
      'Only valid scores recorded by the quiz platform during the contest period will be considered.',
      'The organisers reserve the right to review, verify or correct scores in the event of technical errors, suspected manipulation or discrepancies.',
    ],
  },
  {
    heading: '5. Grand Prize',
    points: [
      'The participant who tops the final cumulative leaderboard at the end of the 90-day contest will win* an Apple Watch.',
      'The grand prize will be awarded after verification of the participant’s eligibility and final score.',
      'In the event of a tie, the organisers may use response time, overall performance or other appropriate criteria to determine the winner.',
      'The prize is non-transferable and cannot be exchanged for cash or any other alternative.',
      'The organisers reserve the right to substitute the prize with another of comparable value in circumstances beyond their control.',
    ],
  },
  {
    heading: '6. Eligibility',
    points: [
      'ChenZ – Daily Trivia is open to participants of all age groups. There is no age restriction.',
      'Participants must provide accurate information wherever requested.',
      'Each participant must use their own registered account to participate.',
      'Participation must be individual and independent.',
      'Multiple accounts, impersonation or participation on behalf of another individual may result in disqualification.',
      'Employees, representatives, contractors or individuals directly involved in organising or administering the contest may be excluded at the organisers’ discretion.',
    ],
  },
  {
    heading: '7. Fair Participation & Disqualification',
    points: [
      'Participants are expected to compete fairly and independently.',
      'Use of bots, scripts, automated tools, AI tools, external assistance, multiple accounts, response-time manipulation, technical exploits or any other means intended to gain an unfair advantage is prohibited.',
      'The organisers reserve the right to disqualify participants, invalidate scores, remove entries from the leaderboard or withhold prizes if they reasonably believe a participant has breached these Terms & Conditions, manipulated the contest or compromised its fairness or integrity.',
    ],
  },
  {
    heading: '8. Prize Distribution & Verification',
    points: [
      'Daily gift voucher winners and the grand prize winner will be contacted using the details provided during registration or participation.',
      'Winners may be required to provide proof of identity or other reasonably necessary information for verification.',
      'Prizes will be distributed only after successful verification.',
      'If a winner fails to respond within the stipulated period, fails verification or is found ineligible, the organisers reserve the right to select an alternate winner.',
      'Taxes, duties or other statutory deductions, if applicable, will be handled in accordance with applicable law.',
    ],
  },
  {
    heading: '9. Technical Issues & Platform Availability',
    points: [
      'The organisers shall not be responsible for entries not received, recorded or processed due to internet connectivity issues, device malfunction, network delays, server downtime, technical errors or circumstances beyond their reasonable control.',
      'The organisers reserve the right to suspend, reschedule, modify or cancel the contest in the event of technical issues, suspected manipulation, security concerns or any circumstance that may affect the fairness or integrity of the contest.',
    ],
  },
  {
    heading: '10. Personal Data & Privacy',
    points: [
      'Participant information may be collected and used for administering the quiz, recording scores, maintaining leaderboards, determining winners, verifying eligibility, contacting participants and distributing prizes.',
      'Personal information will be handled in accordance with applicable laws and the Super Chennai Privacy Policy.',
      'Participants are advised to review the Privacy Policy available on the Super Chennai website before participating.',
    ],
  },
  {
    heading: '11. Publicity & Winner Announcements',
    points: [
      'The organisers may publish the names, usernames, rankings or limited details of winners on the Super Chennai website, social media platforms and other official communication channels for the purpose of announcing results.',
      'Any additional use of a winner’s photograph, video, testimonial or promotional content will be subject to consent where required.',
    ],
  },
  {
    heading: '12. Contest Modification, Suspension or Cancellation',
    points: [
      'The organisers reserve the right to amend, suspend, extend, postpone, modify or discontinue the contest or these Terms & Conditions where necessary due to technical issues, fraud, misuse, operational requirements, legal obligations or circumstances beyond their reasonable control.',
      'Any material changes will be communicated through the Super Chennai website or official communication channels.',
    ],
  },
  {
    heading: '13. Organisers’ Decision',
    points: [
      'Decisions of the organisers regarding eligibility, scoring, score validation, leaderboard rankings, winner determination, tie-breaking, prize distribution and disqualification shall be final and binding, subject to applicable law.',
    ],
  },
  {
    heading: '14. Limitation of Liability',
    points: [
      'The organisers shall not be held liable for any loss, damage, injury, claim or expense arising out of participation in the contest, acceptance or use of prizes, technical interruptions, platform failures or circumstances beyond their reasonable control, except where such liability cannot be excluded under applicable law.',
    ],
  },
  {
    heading: '15. Governing Law & Jurisdiction',
    points: [
      'These Terms & Conditions shall be governed by the laws of India.',
      'Any disputes arising in connection with the contest shall be subject to the jurisdiction of the competent courts in Chennai, Tamil Nadu, India.',
    ],
  },
  {
    heading: '16. Acceptance of Terms',
    points: [
      'By participating in ChenZ – Daily Trivia, participants acknowledge that they have read, understood and agreed to these Terms & Conditions.',
      'Participants who do not agree to these Terms & Conditions should refrain from participating.',
    ],
  },
]

/* ---------- plain text -> Lexical rich text (what the CMS editor stores) ---------- */

const text = (t: string) => ({ type: 'text', text: t, format: 0, style: '', mode: 'normal', detail: 0, version: 1 })
const block = { direction: 'ltr', format: '', indent: 0, version: 1 }
const paragraph = (t: string) => ({ ...block, type: 'paragraph', textFormat: 0, textStyle: '', children: [text(t)] })
const heading = (t: string) => ({ ...block, type: 'heading', tag: 'h3', children: [text(t)] })
const bullets = (items: string[]) => ({
  ...block,
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map((t, i) => ({ ...block, type: 'listitem', value: i + 1, children: [text(t)] })),
})

export const DEFAULT_TERMS_CONTENT = {
  root: {
    ...block,
    type: 'root',
    children: [paragraph(INTRO), ...SECTIONS.flatMap((s) => [heading(s.heading), bullets(s.points)])],
  },
}

/** True when a rich-text value has any visible text (an emptied editor still saves a blank paragraph). */
export function hasRichText(value: unknown): boolean {
  const walk = (node: unknown): boolean => {
    if (!node || typeof node !== 'object') return false
    const n = node as { text?: unknown; children?: unknown[] }
    if (typeof n.text === 'string' && n.text.trim()) return true
    return Array.isArray(n.children) && n.children.some(walk)
  }
  return walk((value as { root?: unknown } | null)?.root)
}
