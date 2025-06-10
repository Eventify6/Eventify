// components/TopSellingEvents.js
import React from 'react';
import { List, ListItem, ListItemText, Typography, Box } from '@mui/material';
import './TopSellingEvents.css';

const TopSellingEvents = ({ events }) => {
  return (
    <List className="top-selling-list">
      {events.map((event, index) => (
        <ListItem key={index} className="top-selling-item">
          <ListItemText
            primary={
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1" className="category-name">
                  {event.name}
                </Typography>
                <Typography variant="body1" className="category-revenue">
                  {event.revenue.toLocaleString()} EGP
                </Typography>
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TopSellingEvents;
