// components/Dashboard.js
import React from 'react';
import { Box, Typography, Container, Grid, Paper, CircularProgress } from '@mui/material';
import StatCard from '../../Components/StatCard/StatCard';
import TopSellingEvents from '../../Components/TopSellingEvents/TopSellingEvents';
import RevenueChart from '../../Components/RevenueChart/RevenueChart';
import EventsStatus from '../../Components/EventsStatus/EventsStatus';
import useDashboardStats from '../../hooks/useDashboardStats';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import './Dashboard.css';

const Dashboard = () => {
  const { stats, loading, error } = useDashboardStats();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" className="dashboard-container">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1c4f33', fontWeight: 'bold', mb: 4 }}>
          Admin Dashboard
        </Typography>

        {/* Stats Section */}
        <Grid container spacing={1} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              type="users" 
              count={stats.users.total}
              label={stats.users.label}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              type="hosts" 
              count={stats.hosts.total}
              label={stats.hosts.label}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard 
              type="attendees" 
              count={stats.attendees.total}
              label={stats.attendees.label}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper elevation={2} className="stat-card">
              <Box className="stat-content">
                <Box className="stat-icon">
                  <ConfirmationNumberIcon sx={{ fontSize: 40, color: '#1c4f33' }} />
                </Box>
                <Box className="stat-info">
                  <Typography variant="h4" component="div" className="stat-number">
                    {stats.ticketsSold.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" className="stat-label">
                    Total Tickets Sold
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Charts and Status Section */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
              <Typography variant="h6" gutterBottom sx={{ color: '#1c4f33' }}>
                Revenue Overview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" component="span" sx={{ mr: 1 }}>
                  {stats.revenue.total.toLocaleString()}
                </Typography>
                <Typography variant="subtitle1" component="span" color="textSecondary">
                  {stats.revenue.currency}
                </Typography>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <EventsStatus 
                  privateEvents={stats.eventPrivacy.private}
                  publicEvents={stats.eventPrivacy.public}
                />
              </Grid>
              <Grid item xs={12}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#1c4f33' }}>
                    Top Categories
                  </Typography>
                  <TopSellingEvents events={stats.topCategories} />
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Dashboard;
