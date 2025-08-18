"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, EffectFade, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface SliderImage {
  _id: string;
  imageUrl: string;
  alt: string;
  title: string;
  description?: string;
  link?: string;
  ctaText?: string;
}

const HomeSlider = () => {
  const [slides, setSlides] = useState<SliderImage[]>([]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMAGES_API_URL}/all-images`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (res.ok) {
          setSlides(data.images || []);
        }
      } catch (err) {
        console.error("Failed to fetch slider images", err);
      }
    };
    fetchSlides();
  }, []);

  if (slides.length === 0) {
    return null;
  }

  return (
    <>
      <Swiper
        modules={[Navigation, EffectFade, Pagination, Autoplay]}
        navigation={{
          prevEl: "#prev",
          nextEl: "#next",
        }}
        autoplay={{ delay: 10000 }}
        loop
        effect="fade"
        fadeEffect={{ crossFade: true }}
        speed={1000}
        className="w-full h-[500px] mySwiper"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide._id}>
            <div className="relative w-full h-[500px]">
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6">
                <h2 className="text-white text-3xl font-bold mb-2">
                  {slide.title}
                </h2>
                {slide.description && (
                  <p className="text-white max-w-2xl mb-4">
                    {slide.description}
                  </p>
                )}
                {slide.ctaText && slide.link && (
                  <a
                    href={slide.link}
                    className="px-6 py-3 bg-yellow-500 text-black font-semibold rounded hover:bg-yellow-400 transition"
                  >
                    {slide.ctaText}
                  </a>
                )}
              </div>
            </div>
          </SwiperSlide>
        ))}
        <FaChevronCircleLeft
          id="prev"
          className="absolute top-1/2 left-5 z-10 -translate-y-1/2 text-white/80 hover:text-white w-10 h-10 cursor-pointer transition"
        />
        <FaChevronCircleRight
          id="next"
          className="absolute top-1/2 right-5 z-10 -translate-y-1/2 text-white/80 hover:text-white w-10 h-10 cursor-pointer transition"
        />
      </Swiper>
    </>
  );
};

export default HomeSlider;
