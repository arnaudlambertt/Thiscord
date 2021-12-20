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
      <Typography variant="h6" gutterBottom>
        A project made by
      </Typography>
      <Divider />
        <Typography>
          Lambert Arnaud
        </Typography>
        <Typography>
          Bouvard Clément
        </Typography>
    </Grid>
  );
}

export default Main;
