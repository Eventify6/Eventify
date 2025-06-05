import React from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper 
import 'swiper/css';
import 'swiper/css/pagination';

import './EventsSlider.css';

import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { Input } from '@mui/material';
import { Button } from '@mui/material';
import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EventsSlider() {
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
            <div className="events-slider-header">
                <h1>Events</h1>
                <div className="events-slider-header-buttons">
                    <span>Joining a Private Event ?</span>
                    <Input placeholder="Enter Event Code" value={eventCode} onChange={(e) => { setEventCode(e.target.value); }} />
                    <Button variant="contained" color="primary" onClick={handleJoin} disabled={!eventCode.trim()}>Join</Button>
                </div>
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
                modules={[Autoplay]}
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
