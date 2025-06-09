import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EventDetails.css';
import { FaInstagram, FaFacebook, FaTwitter } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getCookie } from '../../utils/cookieUtils';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import Swiper 
import 'swiper/css';
import 'swiper/css/pagination';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Tabs, Tab, TextField, Snackbar, Typography, Box } from '@mui/material';
import { Pagination, Navigation, Autoplay } from 'swiper/modules';
import { SocialMediaBoostPrices } from '../../Data/Enums';
import CommentSection from '../../Components/CommentSection/CommentSection';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [tab, setTab] = useState(0);
    const user = getCookie('userData');
    const [cardDetails, setCardDetails] = useState({
        name: '',
        number: '',
        expiry: '',
        cvv: ''
    });
    const [paymentSuccessOpen, setPaymentSuccessOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    useEffect(() => {
        if (getCookie('isLoggedIN') !== 'true') {
            navigate('/');
            setTimeout(() => {
                window.dispatchEvent(new Event('open-login-modal'));
            }, 100);
            return;
        }

        const fetchEventDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/events/get/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch event details');
                }
                const data = await response.json();
                setEvent(data.event);
            } catch (error) {
                toast.error(error.message || 'Error fetching event details');
                console.error('Error fetching event:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [id, navigate]);

    const handleModalOpen = () => {
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        setTab(0);
        setCardDetails({ name: '', number: '', expiry: '', cvv: '' });
    };

    const handleTabChange = (e, newValue) => {
        setTab(newValue);
    };

    const handleCardInput = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePayNow = async () => {
        try {
            const userData = typeof user === 'string' ? JSON.parse(user) : user;
            const userId = userData.id;
            console.log(userId);
            
            const response = await fetch('http://localhost:5000/api/events/ticket/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    event_id: id,
                    price: event.isCharged ? (event.price * 1.1).toFixed(2) : 0,
                    transaction_type: tab === 0 ? 'Credit Card' : 'Instapay'
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                
                toast.error(errorData.error);
                return;
            }

            setOpen(false);
            setPaymentSuccessOpen(true);
        } catch (error) {
            toast.error(error.message || 'Error creating ticket');
            console.error('Error creating ticket:', error);
        }
    };

    const handleAddToCalendar = () => {
        setSnackbarOpen(true);
        handlePayNow()
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const dialogStyles = {
        title: { background: '#1c4f33', color: 'white' },
        content: { display: 'flex', flexDirection: 'column', justifyContent: 'center', p: 3 },
        orderSummary: { mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' },
        orderSummaryTitle: { mb: 1, fontWeight: 'bold' },
        siteServices: { mt: 1 },
        totalPrice: { mt: 1, fontWeight: 'bold', color: '#1c4f33' },
        tabs: { marginBottom: 2 },
        creditCardForm: { display: 'flex', flexDirection: 'column', gap: 2, mt: 2 },
        creditCardFields: { display: 'flex', gap: 2 },
        instapaySection: { display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 },
        actions: { justifyContent: 'center', pb: 2 },
        payButton: { background: '#1c4f33', color: 'white', borderRadius: 2, px: 4, py: 1.5, fontWeight: 600, fontSize: 16 }
    };

    if (loading) {
        return (
            <div className='event-details-page-container'>
                <h2>Loading...</h2>
            </div>
        );
    }
    console.log(event.previousImages);
    
    if (!event) {
        return (
            <div className='event-details-page-container'>
                <h2>Event Not Found</h2>
                <p>No event found with ID: {id}</p>
            </div>
        );
    }
    const previousImages = typeof event.previousImages === "string"
  ? JSON.parse(event.previousImages)
  : event.previousImages;

    return (
        <div className='event-details-page-container'>
            <ToastContainer position="top-center" autoClose={3000} />
            <div className='event-details-page-container-header'>
                <div className='imgContainer'>
                    <img src={event.eventImage} alt={event.eventName} />
                </div>
                <div className='event-details-page-container-header-info'>
                    <div className="event-details-page-container-header-info-title-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ margin: 0 }}>{event.eventName}</h2>
                        <p className="event-category" style={{ color: 'white' }}>{event.category}</p>
                    </div>
                    <span className='event-details-page-container-header-info-description'>{event.description}</span>

                    <div>
                        <p><strong>Location:</strong> {event.location}</p>

                        <h4 className="hours-section-title">Hours</h4>
                        <div className="hours-section-details">
                            <span><strong>From:</strong> {new Date(event.startDate).toLocaleDateString()} {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            <span><strong>To:</strong> {new Date(event.endDate).toLocaleDateString()} {new Date(event.endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                    </div>

                    <div className='event-social-links'>
                        {event.instagramLink && <a href={event.instagramLink} target="_blank" rel="noopener noreferrer"><FaInstagram style={{ color: '#E4405F', fontSize: '24px' }} /></a>}
                        {event.facebookLink && <a href={event.facebookLink} target="_blank" rel="noopener noreferrer"><FaFacebook style={{ color: '#1877F2', fontSize: '24px' }} /></a>}
                        {event.twitterLink && <a href={event.twitterLink} target="_blank" rel="noopener noreferrer"><FaTwitter style={{ color: '#1DA1F2', fontSize: '24px' }} /></a>}
                    </div>
                    <p><strong>Price:</strong> {event.isCharged ? `${event.price} EGP` : 'FREE!'}</p>
                    {event.isCharged ? (
                        <Button onClick={handleModalOpen} style={{ backgroundColor: '#1c4f33', color: '#fff' }}>Pay Now</Button>
                    ) : (
                        <Button onClick={handleAddToCalendar} style={{ backgroundColor: '#1c4f33', color: '#fff' }}>Add to Calendar</Button>
                    )}
                </div>
            </div>

            <div>
                { previousImages && previousImages.length > 0 && (
                    <div className="swiper-container">
                        <h4>Previous Event Images</h4>
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
                            {previousImages.map((image, index) => (
                                <SwiperSlide key={index}><img src={image} alt={`Previous Event ${index}`} /></SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
                <p><strong>Schedule:</strong> <a href={event.schedule} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}><button style={{ backgroundColor: '#1c4f33', color: 'whitesmoke', border: 'none', borderRadius: '8px', padding: '10px 20px', cursor: 'pointer' }}>Download Schedule</button></a></p>
            </div>

            <Dialog open={open} onClose={handleModalClose} maxWidth="xs" fullWidth PaperProps={{ className: 'payment-dialog' }}>
                <DialogTitle className="payment-dialog-title" sx={dialogStyles.title}>Pay for Event</DialogTitle>
                <DialogContent className="payment-dialog-content" sx={dialogStyles.content}>
                    <Box className="order-summary" sx={dialogStyles.orderSummary}>
                        <Typography variant="h6" sx={dialogStyles.orderSummaryTitle}>Order Summary</Typography>
                        <Typography><strong>Event:</strong> {event.eventName}</Typography>
                        <Typography><strong>Base Price:</strong> {event.price.toFixed(2)} EGP</Typography>
                        <Typography sx={dialogStyles.siteServices}><strong>Site Services (10%):</strong> {(event.price * 0.1).toFixed(2)} EGP</Typography>
                        <Typography sx={dialogStyles.totalPrice}><strong>Total:</strong> {(event.price * 1.1).toFixed(2)} EGP</Typography>
                    </Box>
                    <Tabs value={tab} onChange={handleTabChange} centered sx={dialogStyles.tabs} className="payment-tabs">
                        <Tab label="Credit Card" />
                        <Tab label="Instapay" />
                    </Tabs>
                    {tab === 0 && (
                        <Box className="credit-card-form" sx={dialogStyles.creditCardForm}>
                            <TextField label="Cardholder Name" name="name" value={cardDetails.name} onChange={handleCardInput} variant="outlined" fullWidth />
                            <TextField label="Card Number" name="number" value={cardDetails.number} onChange={handleCardInput} variant="outlined" fullWidth />
                            <Box className="credit-card-fields" sx={dialogStyles.creditCardFields}>
                                <TextField label="Expiry Date" name="expiry" value={cardDetails.expiry} onChange={handleCardInput} variant="outlined" fullWidth />
                                <TextField label="CVV" name="cvv" value={cardDetails.cvv} onChange={handleCardInput} variant="outlined" fullWidth />
                            </Box>
                        </Box>
                    )}
                    {tab === 1 && (
                        <Box className="instapay-section" sx={dialogStyles.instapaySection}>
                            <img src={event.instapay} alt="Instapay QR" style={{ width: 180, marginBottom: 16, borderRadius: 8 }} />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="payment-dialog-actions" sx={dialogStyles.actions}>
                    <Button onClick={handlePayNow} variant="contained" sx={dialogStyles.payButton}>Pay Now</Button>
                    <Button onClick={handleModalClose} color="primary">Close</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={paymentSuccessOpen}
                autoHideDuration={6000}
                onClose={() => setPaymentSuccessOpen(false)}
                message="Reservation confirmed and added to Calendar."
                
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            />

            

            <CommentSection />
        </div>
    );
}
