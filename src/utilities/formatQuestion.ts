// Shapes a Payload question doc into the props the game components expect.

export function extractRichText(content: any): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  try {
    const root = content.root || content
    if (!root || !root.children) return ''
    return root.children
      .map((paragraph: any) =>
        paragraph.children ? paragraph.children.map((c: any) => c.text || '').join('') : '',
      )
      .filter(Boolean)
      .join('\n')
  } catch {
    return ''
  }
}

export function resolveImageUrl(imageField: any): string | null {
  if (!imageField) return null
  if (typeof imageField === 'string') return imageField
  if (typeof imageField === 'object' && imageField.url) return imageField.url
  return null
}

export function formatQuestion(q: any, timeLimit?: number, isSponsored = false) {
  return {
    id: q.id,
    title: q.title,
    questionTitle: q.questionTitle || q.title,
    gameType: q.gameType,
    category: q.category,
    questionNumber: q.questionNumber,
    isSponsored,

    heroImage: resolveImageUrl(q.heroImage),
    mobileImage: resolveImageUrl(q.mobileImage),
    content: extractRichText(q.content),

    timeLimit: timeLimit || q.timeLimit || 60,
    points: q.points || 10,
    negativePoints: q.negativePoints || 0,
    difficulty: q.difficulty || 'Medium',
    enableDoubleUp: Boolean(q.enableDoubleUp),
    explanation: extractRichText(q.explanation) || q.explanation,

    mcqGroup: q.mcqGroup
      ? {
          questionText: extractRichText(q.mcqGroup.questionText),
          questionImage: resolveImageUrl(q.mcqGroup.questionImage),
          correctOptionIndex: q.mcqGroup.correctOptionIndex,
          options: (q.mcqGroup.options || []).map((opt: any) => ({
            id: opt.id,
            optionText: opt.optionText,
            optionImage: resolveImageUrl(opt.optionImage),
          })),
        }
      : null,
    dropdownGroup: q.dropdownGroup
      ? {
          sentenceText: extractRichText(q.dropdownGroup.sentenceText),
          dropdownLabel: q.dropdownGroup.dropdownLabel,
          options: q.dropdownGroup.options || [],
          correctAnswer: q.dropdownGroup.correctAnswer,
        }
      : null,
    wordleGroup: q.wordleGroup
      ? {
          clueText: extractRichText(q.wordleGroup.clueText) || q.wordleGroup.clueText,
          answerWord: q.wordleGroup.answerWord,
          attempts: q.wordleGroup.attempts || 6,
          hint: q.wordleGroup.hint,
          hintImage: resolveImageUrl(q.wordleGroup.hintImage),
        }
      : null,
    wordFinderGroup: q.wordFinderGroup
      ? {
          instruction: q.wordFinderGroup.instruction,
          gridRows: q.wordFinderGroup.gridRows || [],
          wordsToFind: q.wordFinderGroup.wordsToFind || [],
        }
      : null,
    matchGroup: q.matchGroup
      ? { instruction: q.matchGroup.instruction, pairs: q.matchGroup.pairs || [] }
      : null,
    spotLieGroup: q.spotLieGroup ? { statements: q.spotLieGroup.statements || [] } : null,
    reorderGroup: q.reorderGroup
      ? {
          instruction: q.reorderGroup.instruction,
          itemsInCorrectOrder: q.reorderGroup.itemsInCorrectOrder || [],
        }
      : null,
    dragDropGroup: q.dragDropGroup
      ? {
          instruction: q.dragDropGroup.instruction,
          dragMode: q.dragDropGroup.dragMode,
          sentenceWordsOrder: q.dragDropGroup.sentenceWordsOrder || [],
          dropZones: q.dragDropGroup.dropZones || [],
        }
      : null,
  }
}
