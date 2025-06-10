import React from 'react';
import { Paper, Typography, Box, LinearProgress } from '@mui/material';
import './EventsStatus.css';

const EventsStatus = ({ privateEvents, publicEvents }) => {
    const total = privateEvents + publicEvents;
    const privatePercentage = total > 0 ? (privateEvents / total) * 100 : 0;
    const publicPercentage = total > 0 ? (publicEvents / total) * 100 : 0;

    return (
        <Paper elevation={2} className="events-status">
            <Typography variant="h6" gutterBottom sx={{ color: '#1c4f33' }}>
                Events Privacy Distribution
            </Typography>
            
            <Box className="status-item">
                <Box className="status-header">
                    <Typography variant="body1">Private Events</Typography>
                    <Typography variant="body1" fontWeight="600">
                        {privateEvents} ({privatePercentage.toFixed(1)}%)
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={privatePercentage} 
                    className="private-progress"
                />
            </Box>

            <Box className="status-item">
                <Box className="status-header">
                    <Typography variant="body1">Public Events</Typography>
                    <Typography variant="body1" fontWeight="600">
                        {publicEvents} ({publicPercentage.toFixed(1)}%)
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={publicPercentage} 
                    className="public-progress"
                />
            </Box>

            <Box className="total-events">
                <Typography variant="body2" color="textSecondary">
                    Total Events: {total}
                </Typography>
            </Box>
        </Paper>
    );
};

export default EventsStatus; 