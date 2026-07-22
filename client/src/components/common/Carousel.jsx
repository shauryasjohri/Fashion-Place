import { useState } from 'react'
import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'react-feather'
import Button from './Button'

export default function Carousel({slides}) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => setSlide(currentSlide === slides.length - 1 ? 0 : currentSlide + 1)
  const prevSlide = () => setSlide(currentSlide === 0 ? slides.length - 1 : currentSlide - 1)

  const setSlide = (index) => {
    const slideEl = document.getElementById("carousel-slide-"+index)
    if (!slideEl) return
    slideEl.scrollIntoView({behavior: 'smooth'})
    setCurrentSlide(index)
  }

  return (
    <div className='relative' role="region" aria-label="Featured promotions carousel" aria-roledescription="carousel">
      <ul className="flex overflow-x-auto scrollbar-hide snap">
        {slides.map((slide, idx) => (
          <li
            key={slide.id}
            id={"carousel-slide-"+idx}
            className="relative min-w-screen h-[80vh] snap-center"
            role="group"
            aria-roledescription="slide"
            aria-label={`Slide ${idx + 1} of ${slides.length}: ${slide.title}`}
            aria-hidden={idx !== currentSlide}
          >
            <img
              src={slide.image}
              className='w-full h-full object-cover object-top'
              alt={slide.title}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
            <div className={clsx(
              "absolute left-0 top-0 px-10",
              "max-w-xl h-full flex flex-col justify-center items-center text-center",
              "text-white bg-gradient-to-r from-gray-800/90 to-transparent",
              "sm:(items-start text-left)"
            )}>
              <h2 className="text-4xl sm:text-6xl font-bold mb-10">{slide.title}</h2>
              <p className="text-xl mb-10">{slide.desc}</p>
              <Button className="text-xl w-1/2" light>Shop now</Button>
            </div>
          </li>
        ))}
      </ul>
      <ul className='w-full absolute bottom-8 flex justify-center space-x-4 items-center' role="tablist" aria-label="Slide indicators">
        {slides.map((slide, idx) => (
          <li
            key={slide.id}
            onClick={e => { e.preventDefault(); setSlide(idx) }}
            role="tab"
            aria-selected={idx === currentSlide}
            aria-label={`Go to slide ${idx + 1}`}
            className={clsx(
              "rounded-full bg-white cursor-pointer",
              "transition-all h-4 shadow-md",
              idx === currentSlide ? "w-8" : "w-4 hover:(w-6)",
            )}
          />
        ))}
      </ul>
      <button
        className="absolute rounded-full bg-gray-800/40 flex justify-center items-center bottom-6 left-6 z-10 cursor-pointer text-white p-2 hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft width={48} height={48} />
      </button>
      <button
        className="absolute rounded-full bg-gray-800/40 flex justify-center items-center bottom-6 right-6 z-10 cursor-pointer text-white p-2 hover:bg-gray-800/60 focus:outline-none focus:ring-2 focus:ring-white"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight width={48} height={48} />
      </button>
    </div>
  )
}
