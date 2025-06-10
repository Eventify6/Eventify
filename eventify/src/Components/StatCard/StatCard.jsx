// components/StatCard.js
import React from 'react';
import { Paper, Typography, Box } from '@mui/material';
import { Person, SupervisorAccount, Groups } from '@mui/icons-material';
import './StatCard.css';

const StatCard = ({ type, count, label }) => {
  const getIcon = () => {
    switch (type) {
      case 'users':
        return <Person sx={{ fontSize: 40, color: '#1c4f33' }} />;
      case 'hosts':
        return <SupervisorAccount sx={{ fontSize: 40, color: '#1c4f33' }} />;
      case 'attendees':
        return <Groups sx={{ fontSize: 40, color: '#1c4f33' }} />;
      default:
        return null;
    }
  };

  return (
    <Paper elevation={2} className="stat-card">
      <Box className="stat-content">
        <Box className="stat-icon">
          {getIcon()}
        </Box>
        <Box className="stat-info">
          <Typography variant="h4" component="div" className="stat-number">
            {count.toLocaleString()}
          </Typography>
          <Typography variant="body2" color="textSecondary" className="stat-label">
            {label}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default StatCard;
