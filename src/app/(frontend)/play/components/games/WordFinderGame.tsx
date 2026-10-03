'use client'

import { useRef, useState } from 'react'

export function WordFinderGame({
  data,
  onComplete,
}: {
  data: any
  onComplete: (res: any) => void
}) {
  const targetWords = data?.wordFinderGroup?.wordsToFind || []
  const gridRows = data?.wordFinderGroup?.gridRows || []
  const maxPoints = Number(data?.points ?? 10)

  // Preserved state management
  const [foundWords, setFoundWords] = useState<string[]>([])

  // Interactive Selection States
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([])
  const [foundWordCoordinates, setFoundWordCoordinates] = useState<
    { start: { row: number; col: number }; end: { row: number; col: number }; color: string }[]
  >([])

  const gridRef = useRef<HTMLDivElement>(null)

  const totalTarget = targetWords.length
  const foundCount = foundWords.length
  const progressPercent = totalTarget > 0 ? (foundCount / totalTarget) * 100 : 0

  // 1. Grid Data Parsing (Converts string rows to 2D Array)
  const gridMatrix: string[][] = gridRows.map((r: any) => (r.rowString || '').split(''))

  // 2. Drag & Selection Handlers
  const handleMouseDown = (row: number, col: number) => {
    setIsSelecting(true)
    setSelectedCells([{ row, col }])
  }

  const handleMouseEnter = (row: number, col: number) => {
    if (!isSelecting) return
    const startCell = selectedCells[0]
    if (!startCell) return

    // Allow Horizontal, Vertical, and Diagonal Straight Lines
    const rowDiff = Math.abs(row - startCell.row)
    const colDiff = Math.abs(col - startCell.col)

    if (rowDiff === 0 || colDiff === 0 || rowDiff === colDiff) {
      const lineCells = getLineCells(startCell.row, startCell.col, row, col)
      setSelectedCells(lineCells)
    }
  }

  const handleMouseUp = () => {
    if (!isSelecting) return
    setIsSelecting(false)

    // Form selected word string
    const formedWord = selectedCells
      .map((cell) => gridMatrix[cell.row]?.[cell.col] || '')
      .join('')
      .toUpperCase()

    const reverseWord = formedWord.split('').reverse().join('')

    // Check against target words
    const matchedTarget = targetWords.find((tw: any) => {
      const targetStr = tw.word.toUpperCase()
      return targetStr === formedWord || targetStr === reverseWord
    })

    // if (matchedTarget) {
    //   const wordStr = matchedTarget.word.toUpperCase()
    //   if (!foundWords.includes(wordStr)) {
    //     setFoundWords((prev) => [...prev, wordStr])

    //     // Save coordinate pattern for line highlight drawing
    //     const start = selectedCells[0]
    //     const end = selectedCells[selectedCells.length - 1]
    //     setFoundWordCoordinates((prev) => [...prev, { start, end, color: '#E83E9F' }])
    //   }
    // }
    
    if (matchedTarget) {
      const wordStr = matchedTarget.word.toUpperCase()
      if (!foundWords.includes(wordStr)) {
        setFoundWords((prev) => [...prev, wordStr])

        // 🎯 1. start & end பாதுகாப்பாக எடுக்கப்படுகிறது
        const start = selectedCells[0]
        const end = selectedCells[selectedCells.length - 1]

        // 🎯 2. start & end இரண்டும் undefined இல்லை என்பதை உறுதிசெய்கிறோம்
        if (start && end) {
          setFoundWordCoordinates((prev) => [
            ...prev,
            { start, end, color: '#E83E9F' },
          ])
        }
      }
    }

    setSelectedCells([])
  }

  // Calculate straight line path between start and end cells
  const getLineCells = (r1: number, c1: number, r2: number, c2: number) => {
    const cells = []
    const rowStep = r2 === r1 ? 0 : r2 > r1 ? 1 : -1
    const colStep = c2 === c1 ? 0 : c2 > c1 ? 1 : -1

    let currR = r1
    let currC = c1

    const steps = Math.max(Math.abs(r2 - r1), Math.abs(c2 - c1))
    for (let i = 0; i <= steps; i++) {
      cells.push({ row: currR, col: currC })
      currR += rowStep
      currC += colStep
    }
    return cells
  }

  // Fallback direct list click handler (Preserved compatibility)
  const handleWordClick = (wordObj: { id: string; word: string }) => {
    const word = wordObj.word.toUpperCase()
    if (foundWords.includes(word)) {
      setFoundWords(foundWords.filter((w) => w !== word))
    } else {
      setFoundWords([...foundWords, word])
    }
  }

  // Score calculation & completion submit
  const handleManualSubmit = () => {
    const allFound = foundCount === totalTarget && totalTarget > 0
    const pointsEarned = allFound ? maxPoints : Math.round((foundCount / totalTarget) * maxPoints)

    onComplete({
      isCorrect: allFound,
      pointsEarned: pointsEarned,
      answerDetail: `${foundCount}/${totalTarget} words found`,
    })
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-950/5 border border-purple-100 text-[#24204A]">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 mb-8 border-b border-purple-100/80">
        {/* TIMER DISPLAY */}
        <div className="flex items-center gap-3 bg-[#F8F8FC] px-5 py-3 rounded-2xl border border-purple-100/60 w-full md:w-auto">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-[#6C2BD9]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <span className="text-xs font-semibold text-[#77738A] block uppercase tracking-wider">
              Time Left
            </span>
            <span className="text-xl font-extrabold text-[#24204A]">
              {data?.timeLimit ? `${data.timeLimit}s` : '60s'}
            </span>
          </div>
        </div>

        {/* PROGRESS DISPLAY */}
        <div className="flex-1 w-full max-w-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-[#24204A] tracking-wider">WORDS FOUND</span>
            <span className="text-sm font-extrabold text-[#6C2BD9]">
              {foundCount}/{totalTarget}
            </span>
          </div>
          <div className="w-full h-3 bg-[#F3E8FF] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#6C2BD9] to-[#E83E9F] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. MAIN CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: INTERACTIVE LETTER GRID (PATTERN SELECTION) */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-center">
          <div
            ref={gridRef}
            onMouseLeave={handleMouseUp}
            className="relative w-full bg-[#F8F8FC] p-4 md:p-6 rounded-3xl border border-purple-100/80 shadow-inner overflow-x-auto select-none"
          >
            <div className="flex flex-col items-center justify-center gap-1.5 md:gap-2 min-w-max mx-auto font-mono text-sm md:text-base font-bold text-[#24204A]">
              {gridMatrix.map((rowArr, rIdx) => (
                <div key={rIdx} className="flex gap-1.5 md:gap-2">
                  {rowArr.map((char, cIdx) => {
                    // Check if current cell is highlighted during drag
                    const isSelected = selectedCells.some((c) => c.row === rIdx && c.col === cIdx)

                    // Check if cell belongs to an already found word
                    const isFoundCell = foundWordCoordinates.some((coord) => {
                      const line = getLineCells(
                        coord.start.row,
                        coord.start.col,
                        coord.end.row,
                        coord.end.col,
                      )
                      return line.some((c) => c.row === rIdx && c.col === cIdx)
                    })

                    return (
                      <div
                        key={cIdx}
                        onMouseDown={() => handleMouseDown(rIdx, cIdx)}
                        onMouseEnter={() => handleMouseEnter(rIdx, cIdx)}
                        onMouseUp={handleMouseUp}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center border transition-all cursor-pointer uppercase ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#6C2BD9] to-[#E83E9F] text-white border-transparent shadow-md scale-105 z-10'
                            : isFoundCell
                              ? 'bg-purple-100/80 text-[#6C2BD9] border-[#E83E9F] font-black shadow-xs'
                              : 'bg-white text-[#24204A] border-purple-100/70 shadow-xs hover:border-[#6C2BD9] hover:bg-purple-50'
                        }`}
                      >
                        {char}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WORDS TO FIND PANEL */}
        <div className="lg:col-span-5 xl:col-span-4 bg-[#FCE7F3]/40 border border-[#FCE7F3] rounded-3xl p-5 md:p-6">
          <h3 className="text-xs font-black text-[#6C2BD9] tracking-widest uppercase mb-4">
            WORDS TO FIND
          </h3>

          <div className="flex flex-col gap-2.5 max-h-[380px] overflow-y-auto pr-1">
            {targetWords.map((w: any) => {
              const wordStr = w.word.toUpperCase()
              const isFound = foundWords.includes(wordStr)

              return (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => handleWordClick(w)}
                  className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between font-bold text-sm transition-all duration-200 border ${
                    isFound
                      ? 'bg-gradient-to-r from-[#6C2BD9] to-[#E83E9F] text-white border-transparent shadow-md shadow-purple-500/10'
                      : 'bg-white text-[#24204A] border-purple-100 hover:border-[#E83E9F] hover:bg-purple-50/50 shadow-xs'
                  }`}
                >
                  <span className={isFound ? 'line-through opacity-90' : ''}>{w.word}</span>
                  {isFound && (
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          <button
            onClick={handleManualSubmit}
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#6C2BD9] to-[#E83E9F] hover:opacity-95 active:scale-[0.99] text-white font-extrabold text-sm rounded-2xl transition shadow-lg shadow-purple-600/20"
          >
            {foundWords.length === targetWords.length ? '🎉 Complete Challenge' : 'Submit Progress'}
          </button>
        </div>
      </div>

      {/* 3. BOTTOM HOW TO PLAY SECTION */}
      <div className="mt-8 pt-6 border-t border-purple-100/80 flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-[#F8F8FC] p-4 md:p-5 rounded-2xl">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#E83E9F]">
            💡
          </div>
          <span className="font-bold text-sm text-[#24204A]">How to Play</span>
        </div>
        <p className="text-xs text-[#77738A] leading-relaxed">
          {data?.wordFinderGroup?.instruction ||
            'Find the hidden words in the grid. Drag from the first letter to the last (Horizontal, Vertical, or Diagonal) to highlight words.'}
        </p>
      </div>
    </div>
  )
}
