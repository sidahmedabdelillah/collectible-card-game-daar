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
            <img
              src="../public/cards.png" // Replace with the URL of your image
              alt="Your Image"
              style={{ width: "40%", marginRight: "30%", marginBottom: "15%" }}
            />
          </Box>
        </Grid>
        <Box sx={{ borderRadius: '10px', display: 'flex', gap: '16px' ,backgroundColor:"#26193b",height:"200px",marginTop:"1%" ,width:"30%"}}>
          <Paper elevation={3} sx={{ borderRadius: '12px', padding: '16px', marginBottom: '16px',height:"150px",marginTop:"3%",marginLeft:"5%" }}>
            <Typography variant="h6">Ethereum</Typography>
            <Typography>200</Typography>
          </Paper>
          <Paper elevation={3} sx={{ borderRadius: '12px', padding: '16px', marginBottom: '16px',height:"150px",marginTop:"3%"  }}>
            <Typography variant="h6">NFT</Typography>
            <Typography>600</Typography>
          </Paper>
      
          <Paper elevation={3} sx={{ borderRadius: '12px', padding: '16px',height:"150px",marginTop:"3%",marginRight:"5%" }}>
            <Typography variant="h6">Collections</Typography>
            <Typography>150</Typography>
          </Paper>
        </Box>
      </Grid>
    </Box>
  );
}
