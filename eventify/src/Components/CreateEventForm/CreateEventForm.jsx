import React, { useState, useEffect } from 'react';
import {
    Grid,
    TextField,
    Button,
    MenuItem,
    FormControlLabel,
    RadioGroup,
    Radio,
    Checkbox,
    FormGroup,
    Typography,
    InputLabel,
    Select,
    FormControl,
    FormLabel,
    Box,
    IconButton,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import './CreateEventForm.css';
import { Events } from '../../Data/Enums';
import { SocialMediaBoostOptions } from '../../Data/Enums';

const schema = yup.object().shape({
    eventName: yup.string().required('Event Name is required'),
    eventImage: yup.mixed().required('Event Image is required'),
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date().min(
        yup.ref('startDate'),
        'End date must be after start date'
    ).required('End date is required'),
    location: yup.string().required('Location is required'),
    description: yup.string().required('Description is required'),
    category: yup.string().required('Category is required'),
    isCharged: yup.boolean().required('Please select if you will charge'),
    instapay: yup.mixed().when('isCharged', {
        is: true,
        then: (schema) => schema.required('InstaPay QRCode is required'),
        otherwise: (schema) => schema.notRequired(),
    }),
    isAttendeeLimit: yup.boolean().required('Please select attendee limit option'),
    attendeeLimit: yup.number().when('isAttendeeLimit', {
        is: true,
        then: (schema) => schema.typeError('Enter a number').required('Attendee limit is required').min(1, 'Must be at least 1'),
        otherwise: (schema) => schema.notRequired(),
    }),
    isPrivate: yup.boolean().required('Please select public or private'),
    schedule: yup.mixed().required('Schedule PDF is required'),
    agreement: yup.bool().oneOf([true], 'You must agree to terms'),
    price: yup.number().when('isCharged', {
        is: true,
        then: (schema) => schema.required('Event Price is required').typeError('Enter a valid number'),
        otherwise: (schema) => schema.notRequired(),
    }),
});

function generateCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function CreateEventForm() {
    const [code, setCode] = useState('');
    const [openSuccessPopup, setOpenSuccessPopup] = useState(false); // State for success popup
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false); // State for payment confirmation dialog
    const [submittedData, setSubmittedData] = useState(null); // Store submitted data for dialogs

    const BASE_PRICE = 5000;

    const {
        control,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors, isValid },
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            eventName: '',
            eventImage: null,
            startDate: null,
            endDate: null,
            location: '',
            description: '',
            category: '',
            isCharged: false,
            instapay: null,
            isAttendeeLimit: false,
            attendeeLimit: 0,
            isPrivate: false,
            socialMediaBoost: [],
            schedule: null,
            previousImages: null,
            instagramLink: '',
            facebookLink: '',
            twitterLink: '',
            agreement: false,
            price: 0,
        },
    });

    const isCharged = watch('isCharged');
    const isAttendeeLimit = watch('isAttendeeLimit');
    const isPrivate = watch('isPrivate');
    const selectedSocialMedia = watch('socialMediaBoost');
    const watchedValues = watch(); // Watch all form values
    const selectedOptions = SocialMediaBoostOptions.filter(opt => selectedSocialMedia.includes(opt.value));
    const socialMediaTotal = selectedOptions.reduce((sum, opt) => sum + opt.price, 0);
    const totalPrice = BASE_PRICE + socialMediaTotal;

    // Log all form changes
    useEffect(() => {
        console.log(watchedValues);
    }, [watchedValues]);

    const onSubmit = (data) => {
        const invoice = {
            base: BASE_PRICE,
            socialMedia: selectedOptions.map(opt => ({ label: opt.label, price: opt.price })),
            total: totalPrice,
        };
        setSubmittedData({ ...data, invoice });
        setOpenSuccessPopup(true);
    };

    const handleClosePopup = () => {
        setOpenSuccessPopup(false);
    };

    const handleProceedToPayment = () => {
        setOpenSuccessPopup(false);
        setOpenPaymentDialog(true);
    };

    const handleCancelPayment = () => {
        setOpenPaymentDialog(false);
    };

    const handleConfirmPayment = () => {
        setOpenPaymentDialog(false);
        alert('Event created');
    };

    return (
        <>
            <div className="create-event-form-bg" />
            <Paper elevation={4} className="create-event-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-grid">
                        <h2>Create Event</h2>
                        <div>
                            <Controller
                                name="eventName"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Event Name" fullWidth error={!!errors.eventName} />
                                )}
                            />
                        </div>

                        {/* Event Image */}
                        <div>
                            <Controller
                                name="eventImage"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files[0])}
                                        style={{ display: 'none' }}
                                        id="eventImageInput"
                                    />
                                )}
                            />
                            <label htmlFor="eventImageInput">
                                <Button variant="outlined" component="span" fullWidth startIcon={<FileUploadIcon />}>
                                    {getValues('eventImage') ? getValues('eventImage').name : 'Upload Event Image'}
                                </Button>
                            </label>
                            {errors.eventImage && <div className="validation-error">{errors.eventImage.message}</div>}
                        </div>

                        {/* Start Date */}
                        <div>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <div className="date-picker-group">
                                        <label>Event Start Date</label>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="Pp"
                                            className="form-control"
                                        />
                                        {errors.startDate && <div className="validation-error">{errors.startDate?.message}</div>}
                                    </div>
                                )}
                            />
                        </div>

                        {/* End Date */}
                        <div>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <div className="date-picker-group">
                                        <label>Event End Date</label>
                                        <DatePicker
                                            selected={field.value}
                                            onChange={(date) => field.onChange(date)}
                                            showTimeSelect
                                            timeFormat="HH:mm"
                                            timeIntervals={15}
                                            dateFormat="Pp"
                                            className="form-control"
                                        />
                                        {errors.endDate && <div className="validation-error">{errors.endDate?.message}</div>}
                                    </div>
                                )}
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <Controller
                                name="location"
                                control={control}
                                render={({ field }) => (
                                    <Box display="flex" alignItems="center">
                                        <TextField {...field} label="Location" fullWidth error={!!errors.location} />
                                        <IconButton
                                            onClick={() => {
                                                window.open('https://www.google.com/maps', '_blank');
                                            }}
                                            color="primary"
                                            sx={{ ml: 1 }}
                                        >
                                            <AddLocationAltIcon />
                                        </IconButton>
                                    </Box>
                                )}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <Controller
                                name="category"
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={!!errors.category}>
                                        <InputLabel>Category</InputLabel>
                                        <Select {...field} label="Category">
                                            {Events.map((cat) => (
                                                <MenuItem key={cat.value} value={cat.label}>{cat.label}</MenuItem>
                                            ))}
                                        </Select>
                                        {errors.category && <div className="validation-error">{errors.category?.message}</div>}
                                    </FormControl>
                                )}
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Description" fullWidth multiline minRows={4} error={!!errors.description} />
                                )}
                            />
                        </div>

                        {/* Charge (Boolean Radio) */}
                        <div>
                            <FormControl component="fieldset" error={!!errors.isCharged} fullWidth>
                                <FormLabel component="legend">Will you charge for this event?</FormLabel>
                                <Controller
                                    name="isCharged"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup row {...field} value={field.value} onChange={e => field.onChange(e.target.value === 'true')}>
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.isCharged && <div className="validation-error">{errors.isCharged?.message}</div>}
                            </FormControl>
                        </div>

                        {/* InstaPay QR (if isCharged is true) */}
                        {isCharged && (
                            <>
                                <div>
                                    <Controller
                                        name="instapay"
                                        control={control}
                                        render={({ field }) => (
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => field.onChange(e.target.files[0])}
                                                style={{ display: 'none' }}
                                                id="instapayInput"
                                            />
                                        )}
                                    />
                                    <label htmlFor="instapayInput">
                                        <Button variant="outlined" component="span" fullWidth startIcon={<FileUploadIcon />}>
                                            {getValues('instapay') ? getValues('instapay').name : 'Upload InstaPay QR Code'}
                                        </Button>
                                    </label>
                                    {errors.instapay && <div className="validation-error">{errors.instapay.message}</div>}
                                </div>
                                <div>
                                    <Controller
                                        name="price"
                                        control={control}
                                        render={({ field }) => (
                                            <TextField {...field} label="Event Price (EGP)" type="number" fullWidth error={!!errors.price} />
                                        )}
                                    />
                                </div>
                            </>
                        )}

                        {/* Attendee Limit (Boolean) */}
                        <div>
                            <FormControl component="fieldset" error={!!errors.isAttendeeLimit} fullWidth>
                                <FormLabel component="legend">Limit number of attendees?</FormLabel>
                                <Controller
                                    name="isAttendeeLimit"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup row {...field} value={field.value} onChange={e => field.onChange(e.target.value === 'true')}>
                                            <FormControlLabel value={true} control={<Radio />} label="Yes" />
                                            <FormControlLabel value={false} control={<Radio />} label="No" />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.isAttendeeLimit && <div className="validation-error">{errors.isAttendeeLimit?.message}</div>}
                            </FormControl>
                        </div>

                        {/* Attendee Limit Number (if yes) */}
                        {isAttendeeLimit && (
                            <div>
                                <Controller
                                    name="attendeeLimit"
                                    control={control}
                                    render={({ field }) => (
                                        <TextField {...field} label="Attendee Limit" type="number" fullWidth error={!!errors.attendeeLimit} />
                                    )}
                                />
                            </div>
                        )}

                        {/* Privacy (Boolean) */}
                        <div>
                            <FormControl component="fieldset" error={!!errors.isPrivate} fullWidth>
                                <FormLabel component="legend">Event Privacy</FormLabel>
                                <Controller
                                    name="isPrivate"
                                    control={control}
                                    render={({ field }) => (
                                        <RadioGroup row {...field} value={field.value} onChange={e => field.onChange(e.target.value === 'true')}>
                                            <FormControlLabel value={false} control={<Radio />} label="Public" />
                                            <FormControlLabel value={true} control={<Radio />} label="Private" />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.isPrivate && <div className="validation-error">{errors.isPrivate?.message}</div>}
                            </FormControl>
                        </div>

                        {/* Social Media Boost (Checkbox group) */}
                        <div>
                            <FormControl component="fieldset" error={!!errors.socialMediaBoost} fullWidth>
                                <FormLabel component="legend">Social Media Boost</FormLabel>
                                <FormGroup
                                    row={false}
                                    sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
                                >
                                    {SocialMediaBoostOptions.map((option) => (
                                        <FormControlLabel
                                            key={option.value}
                                            control={
                                                <Controller
                                                    name="socialMediaBoost"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Checkbox
                                                            checked={field.value.includes(option.value)}
                                                            onChange={e => {
                                                                if (e.target.checked) {
                                                                    field.onChange([...field.value, option.value]);
                                                                } else {
                                                                    field.onChange(field.value.filter((v) => v !== option.value));
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                />
                                            }
                                            label={`${option.label} (+${option.price} EGP)`}
                                        />
                                    ))}
                                </FormGroup>
                                {errors.socialMediaBoost && <div className="validation-error">{errors.socialMediaBoost?.message}</div>}
                            </FormControl>
                        </div>

                        {/* Schedule PDF */}
                        <div>
                            <Controller
                                name="schedule"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={(e) => field.onChange(e.target.files[0])}
                                        style={{ display: 'none' }}
                                        id="scheduleInput"
                                    />
                                )}
                            />
                            <label htmlFor="scheduleInput">
                                <Button variant="outlined" component="span" fullWidth startIcon={<FileUploadIcon />}>
                                    {getValues('schedule') ? getValues('schedule').name : 'Upload Schedule PDF'}
                                </Button>
                            </label>
                            {errors.schedule && <div className="validation-error">{errors.schedule.message}</div>}
                        </div>

                        {/* Previous Images (optional) */}
                        <div>
                            <Controller
                                name="previousImages"
                                control={control}
                                render={({ field }) => (
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => field.onChange(e.target.files[0])}
                                        style={{ display: 'none' }}
                                        id="previousImagesInput"
                                    />
                                )}
                            />
                            <label htmlFor="previousImagesInput">
                                <Button variant="outlined" component="span" fullWidth startIcon={<FileUploadIcon />}>
                                    {getValues('previousImages') ? getValues('previousImages').name : 'Upload Previous Event Images (optional)'}
                                </Button>
                            </label>
                        </div>

                        {/* Individual Social Media Links (optional) */}
                        <div className="social-links-optional">
                            <Controller
                                name="instagramLink"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Instagram Link (optional)" variant="outlined" fullWidth size="small" />
                                )}
                            />
                            <Controller
                                name="facebookLink"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Facebook Link (optional)" variant="outlined" fullWidth size="small" />
                                )}
                            />
                            <Controller
                                name="twitterLink"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label="Twitter Link (optional)" variant="outlined" fullWidth size="small" />
                                )}
                            />
                        </div>

                        {/* Agreement Checkbox */}
                        <div>
                            <FormControlLabel
                                control={
                                    <Controller
                                        name="agreement"
                                        control={control}
                                        render={({ field }) => (
                                            <Checkbox {...field} checked={field.value} />
                                        )}
                                    />
                                }
                                label={<span>I agree to the <a href="#" target="_blank" rel="noopener noreferrer">terms and conditions</a></span>}
                            />
                            {errors.agreement && <div className="validation-error">{errors.agreement.message}</div>}
                        </div>

                        {/* Submit Button */}
                        <div>
                            <Button type="submit" fullWidth disabled={!isValid} size="large">
                                Create Event
                            </Button>
                        </div>
                    </div>
                </form>
            </Paper>

            {/* Success Popup */}
            <Dialog open={openSuccessPopup} onClose={handleClosePopup} classes={{ paper: 'create-event-dialog' }}>
                <DialogTitle>{submittedData?.eventName} was Created Successfully!</DialogTitle>
                <DialogContent>
                    <div className="success-popup-content">
                        <Typography variant="subtitle1">Event Name: {submittedData?.eventName}</Typography>
                        <Typography variant="subtitle1">Base Price: {submittedData?.invoice?.base} EGP</Typography>
                        {submittedData?.invoice?.socialMedia?.map((item, idx) => (
                            <Typography key={idx} variant="subtitle2">{item.label}: +{item.price} EGP</Typography>
                        ))}
                        <Typography variant="h6" sx={{ mt: 2 }}>Total: {submittedData?.invoice?.total} EGP</Typography>
                    </div>
                    <Typography sx={{ mt: 2 }}>Event creation was successful. We will add additional information here soon.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleProceedToPayment} color="primary">Proceed to Payment</Button>
                    <Button onClick={handleClosePopup} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>

            {/* Payment Confirmation Dialog */}
            <Dialog open={openPaymentDialog} onClose={handleCancelPayment} classes={{ paper: 'create-event-dialog' }}>
                <DialogTitle>Payment Confirmation</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1">Event Name: {submittedData?.eventName}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Total: {submittedData?.invoice?.total} EGP</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmPayment} color="primary">Confirm Payment</Button>
                    <Button onClick={handleCancelPayment} color="secondary">Cancel</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
