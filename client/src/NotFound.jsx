import { Button } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50vh', transform: 'translateY(-50%)' }}>
      <h1>404 - Page Not Found</h1>
      <Link to="/">
      <Button style={{marginTop:"0.5rem",backgroundColor:"#662d91"}}variant='contained'>
      Go to Home
      </Button>
      </Link>
    </div>
  );
};

export default NotFound;