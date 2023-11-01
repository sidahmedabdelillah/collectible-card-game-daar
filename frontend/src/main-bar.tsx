import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function MainBar() {
  return (
    <Box sx={{ width: '100%', height: '220px', backgroundColor: '#462f63', borderRadius: '10px', marginTop: '8%' }}>
      <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid item xs={12} sm={6} md={6}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >

            <div className="image-text-container">
              <img src="../public/bg.png" alt="green iguana" />
              <div className="text-container">
                <div className='titre_collection'>My Magic Collections</div>
                <div className='date_titre'>created at 24h |update 5 minutes ago</div>
              </div>
            </div>
          </Box>

        </Grid>
        <Box className="box-number" sx={{ borderRadius: '10px', display: 'flex', gap: '16px', backgroundColor: "#26193b", height: "200px", marginTop: "1%", width: "45%" }}>
          <div className="container">
            <div className="box">
              <p className='font_titre_count'>Ethereum</p>
            </div>
            <div className="box">
              <p className='font_titre_count'>NFT</p>
            </div>
            <div className="box">
              <p className='font_titre_count'>NFT</p>
            </div>
          </div>
        </Box>
      </Grid>
    </Box>
  );
}
