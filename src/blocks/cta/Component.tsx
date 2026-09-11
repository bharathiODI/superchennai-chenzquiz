import React from 'react'

export const CTABlockComponent = ({
  heading,
  buttonText,
  buttonLink,
}: any) => {
  return (
    <section className="py-32 bg-black text-white text-center px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold mb-8">
          {heading}
        </h2>

        <a
          href={buttonLink}
          className="inline-flex px-8 py-4 bg-white text-black rounded-full font-semibold"
        >
          {buttonText}
        </a>
      </div>
    </section>
  )
}