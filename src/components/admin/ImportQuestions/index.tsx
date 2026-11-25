import type { AdminViewServerProps } from 'payload'
import { DefaultTemplate } from '@payloadcms/next/templates'
import { Gutter } from '@payloadcms/ui'
import { redirect } from 'next/navigation'
import React from 'react'

import { EDITORS, userHas } from '@/access/roles'
import { ImportQuestionsClient } from './client'

/** Import Questions (/admin/import-questions): Editors, Administrators and Super Admins. */
export async function ImportQuestionsView({ initPageResult, params, searchParams }: AdminViewServerProps) {
  const { req, permissions, visibleEntities, locale } = initPageResult
  const user = req.user
  if (!user) redirect('/admin/login?redirect=%2Fadmin%2Fimport-questions')
  const allowed = userHas(user, EDITORS)
  const quizzes = allowed
    ? (
        await req.payload.find({
          collection: 'quizzes',
          sort: '-quizDate',
          depth: 0,
          pagination: false,
          overrideAccess: true,
          select: { quizTitle: true, status: true },
        } as any)
      ).docs.map((q: any) => ({ id: q.id, title: q.quizTitle, live: q.status === 'active' }))
    : []
  return (
    <DefaultTemplate
      i18n={req.i18n}
      locale={locale}
      params={params}
      payload={req.payload}
      permissions={permissions}
      searchParams={searchParams}
      user={user || undefined}
      visibleEntities={visibleEntities}
    >
      <Gutter>
        <div className="qd">
          <div className="qd-card qd-head">
            <div>
              <div className="qd-eyebrow">Quiz</div>
              <h1 className="qd-title">Import questions</h1>
              <p className="qd-sub">
                Add many MCQ questions at once from Excel or CSV. Download the sample, fill one row per question, then check
                and import. Nothing is saved until you click Import.
              </p>
            </div>
          </div>
          {allowed ? (
            <ImportQuestionsClient quizzes={quizzes} />
          ) : (
            <div className="qd-card">
              <p>Importing is for Editors, Administrators and Super Admins. Add questions one at a time instead.</p>
            </div>
          )}
        </div>
      </Gutter>
    </DefaultTemplate>
  )
}
