import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper 
import 'swiper/css';
import 'swiper/css/pagination';

import './EventSliderhome.css';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Input } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EventsSliderhome() {
    const [eventCode, setEventCode] = useState('');

    const handleJoin = () => {
        if (!eventCode.trim()) {
            toast.error('Event code cannot be empty.');
            return;
        }

        toast.success('Joined event successfully!');
    };

    return (
        <div className="events-slider-container">
            <div className="events-slider-home-header">
                <h1>Get Excited! Don't miss out on these hot events</h1>
            </div>
            <Swiper
                pagination={{
                    dynamicBullets: true,
                }}
                slidesPerView={3}
                loop={true}
                speed={2500}
                navigation={true}
                freeMode={true}
                allowTouchMove={false}
                spaceBetween={36}
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{
                    delay: false,
                    disableOnInteraction: false,
                }}
                className="mySwiper"
            >
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
                <SwiperSlide><img src="/assets/image/masarEgbary.png" alt="" /></SwiperSlide>
            </Swiper>
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}