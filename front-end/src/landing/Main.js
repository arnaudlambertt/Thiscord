import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function Main() {

  return (
    <Grid
      item
      xs={12}
      md={8}
      sx={{
        '& .markdown': {
          py: 3,
        },
      }}
    >
      <Typography variant="h6" sx={{color:'terciary.contrastText'}}gutterBottom>
        A project made by
      </Typography>
      <Divider />
        <Typography sx={{color:'terciary.contrastText'}}>
          Lambert Arnaud
        </Typography>
        <Typography sx={{color:'terciary.contrastText'}}>
          Bouvard Clément
        </Typography>
    </Grid>
  );
}

export default Main;
