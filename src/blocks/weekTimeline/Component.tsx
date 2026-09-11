import React from 'react'

export const WeekTimelineComponent = ({ heading, weeks }: any) => {
  return (
    <section className="py-20 bg-black text-white px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold mb-12">{heading}</h2>

        <div className="space-y-8">
          {weeks?.map((week: any, index: number) => (
            <div key={index} className="border-l-2 pl-6 border-white">
              <h3 className="text-2xl font-semibold mb-2">
                {week.weekTitle}
              </h3>

              <p className="text-gray-300">
                {week.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}