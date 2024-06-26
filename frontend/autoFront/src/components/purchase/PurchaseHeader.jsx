import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Select, MenuItem, TextField, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const PurchasesHeader = () => {
  return (
    <AppBar position="static" color="default">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          Purchases
        </Typography>
        <Select defaultValue="all" variant="outlined" style={{ marginRight: 10 }}>
          <MenuItem value="all">All statuses</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </Select>
        <TextField variant="outlined" placeholder="Search" style={{ marginRight: 10 }} />
        <IconButton color="inherit">
          <SearchIcon />
        </IconButton>
        <Button variant="outlined" startIcon={<CalendarTodayIcon />} style={{ marginRight: 10 }}>
          Choose dates...
        </Button>
        <Typography variant="body1">1 - 28 of Many</Typography>
      </Toolbar>
    </AppBar>
  );
};

export default PurchasesHeader;
