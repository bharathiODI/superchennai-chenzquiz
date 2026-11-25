import type { ServerProps } from 'payload'
import React from 'react'

import { REPORT_READERS, cmsRole, userHas } from '@/access/roles'

import { type MenuItem, WpMenuClient } from './client'

/**
 * WordPress-style admin menu (payload-builder playbook): Dashboard, Quiz Dashboard, Quiz,
 * Players & Scores, Posts, Media, Pages, Appearance, Users, Settings - in that order, each with
 * its submenu ("All ...", "Add New"). An entry shows only if the user's role can open it, using
 * Payload's own permissions, so the menu and the access rules can't disagree. Anything new that
 * isn't listed here still appears under "More". Replaces Payload's grouped list (hidden in CSS).
 */
type Kind = 'collection' | 'global'
type Ref = { kind: Kind; slug: string; label?: string; add?: string }

const SPEC: { id: string; label: string; icon: MenuItem['icon']; refs: Ref[] }[] = [
  {
    id: 'quiz',
    label: 'Quiz',
    icon: 'puzzle',
    refs: [
      { kind: 'collection', slug: 'questions', label: 'All Questions', add: 'Add New Question' },
      { kind: 'collection', slug: 'quizzes', label: 'Quizzes' },
    ],
  },
  {
    id: 'players',
    label: 'Players & Scores',
    icon: 'trophy',
    refs: [
      { kind: 'collection', slug: 'quiz-users', label: 'Players' },
      { kind: 'collection', slug: 'quiz-rounds', label: 'Quiz Rounds' },
      { kind: 'collection', slug: 'quiz-answers', label: 'Answers' },
      { kind: 'collection', slug: 'quiz-attempts', label: 'Quiz Attempts' },
      { kind: 'collection', slug: 'user-submissions', label: 'User Submissions' },
    ],
  },
  { id: 'posts', label: 'Posts', icon: 'pin', refs: [{ kind: 'collection', slug: 'posts', label: 'All Posts', add: 'Add New Post' }] },
  { id: 'media', label: 'Media', icon: 'image', refs: [{ kind: 'collection', slug: 'media', label: 'Library', add: 'Add New Media File' }] },
  { id: 'pages', label: 'Pages', icon: 'page', refs: [{ kind: 'collection', slug: 'pages', label: 'All Pages', add: 'Add New Page' }] },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: 'brush',
    refs: [
      { kind: 'global', slug: 'header', label: 'Header' },
      { kind: 'global', slug: 'footer', label: 'Footer' },
    ],
  },
  { id: 'users', label: 'Users', icon: 'users', refs: [{ kind: 'collection', slug: 'users', label: 'All Users', add: 'Add New User' }] },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'sliders',
    refs: [
      { kind: 'global', slug: 'quiz-settings', label: 'Quiz Settings' },
      { kind: 'global', slug: 'quiz-site-settings', label: 'Quiz Site Settings' },
    ],
  },
]

const labelOf = (entity: any): string => {
  const l = entity?.labels?.plural ?? entity?.label ?? entity?.slug
  return typeof l === 'string' ? l : (l?.en ?? entity?.slug)
}

export function WpMenu({ payload, permissions, user }: ServerProps) {
  if (!payload?.config) return null
  const cfg = payload.config
  const A = cfg.routes.admin
  const role = cmsRole(user)

  const entity = (kind: Kind, slug: string): any =>
    kind === 'collection' ? cfg.collections.find((c) => c.slug === slug) : cfg.globals.find((g) => g.slug === slug)
  const visible = (kind: Kind, slug: string) => {
    const e = entity(kind, slug)
    if (!e) return false
    const hidden = e.admin?.hidden
    if (typeof hidden === 'function' ? hidden({ user }) : hidden) return false
    return Boolean((permissions as any)?.[kind === 'collection' ? 'collections' : 'globals']?.[slug]?.read)
  }
  const canCreate = (slug: string) => Boolean((permissions as any)?.collections?.[slug]?.create)
  const url = (kind: Kind, slug: string) => `${A}/${kind === 'collection' ? 'collections' : 'globals'}/${slug}`

  const items: MenuItem[] = []
  if (role && role !== 'viewer') items.push({ id: 'dashboard', label: 'Dashboard', icon: 'home', href: A, exact: true, children: [] })
  if (userHas(user, REPORT_READERS)) {
    items.push({ id: 'quiz-dashboard', label: 'Quiz Dashboard', icon: 'chart', href: `${A}/quiz-dashboard`, children: [] })
  }

  const listed = new Set<string>()
  for (const s of SPEC) {
    const children: MenuItem['children'] = []
    for (const r of s.refs) {
      listed.add(`${r.kind}:${r.slug}`)
      if (!visible(r.kind, r.slug)) continue
      children.push({ label: r.label ?? labelOf(entity(r.kind, r.slug)), href: url(r.kind, r.slug) })
      if (r.add && r.kind === 'collection' && canCreate(r.slug)) children.push({ label: r.add, href: `${url(r.kind, r.slug)}/create` })
    }
    if (s.id === 'users' && role) children.push({ label: 'Profile', href: `${A}/account` }) // everyone's own profile
    if (children.length) items.push({ id: s.id, label: s.label, icon: s.icon, href: children[0]!.href, children })
  }

  // Anything visible that the list above doesn't know about (a new collection or plugin)
  const more: MenuItem['children'] = []
  for (const c of cfg.collections) {
    if (!listed.has(`collection:${c.slug}`) && visible('collection', c.slug)) more.push({ label: labelOf(c), href: url('collection', c.slug) })
  }
  for (const g of cfg.globals) {
    if (!listed.has(`global:${g.slug}`) && visible('global', g.slug)) more.push({ label: labelOf(g), href: url('global', g.slug) })
  }
  if (more.length) items.push({ id: 'more', label: 'More', icon: 'dots', href: more[0]!.href, children: more })

  return <WpMenuClient items={items} />
}
