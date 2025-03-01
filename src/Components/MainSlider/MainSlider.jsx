/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import axios from "axios";

export default function MainSlider() {
  const [sliderData, setSliderData] = useState({});

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/ads`)
      .then((res) => {
        setSliderData(res.data.ad);
      })
      .catch((err) => {
        console.log("error", err);
        return err;
      });
  }, []);

  return (
    <>
      <p className="text-start text-2xl font-bold">{sliderData.title}</p>
      <div className="w-full relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          // autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-2xl"
        >
          {sliderData.images?.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_BASE_URL}${image.photo}`}
                  className="rounded-2xl w-full lg:h-[300px] h-[200px] object-cover"
                  alt={`slide-${index}`}
                />
                <a
                  href={image.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-3xl bg-black opacity-50 p-2 rounded-full"
                >
                  <i className="fas fa-link"></i>
                </a>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
}
