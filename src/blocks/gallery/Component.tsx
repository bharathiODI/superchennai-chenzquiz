/* eslint-disable @next/next/no-img-element */
import React from 'react'

export const GalleryBlockComponent = ({ heading, images }: any) => {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold mb-10">{heading}</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {images?.map((image: any, index: number) => (
            <img
              key={index}
              src={image?.url}
              alt="Gallery"
              className="rounded-3xl h-80 w-full object-cover"
            />
          ))}
        </div>
      </div>
    </section>
  )
}