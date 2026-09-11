import React from 'react'

export const StatsBlockComponent = ({ stats }: any) => {
  return (
    <section className="py-20 bg-orange-500 text-white px-4">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10 text-center">
        {stats?.map((item: any, index: number) => (
          <div key={index}>
            <h3 className="text-6xl font-bold mb-3">{item.number}</h3>

            <p className="text-xl">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
