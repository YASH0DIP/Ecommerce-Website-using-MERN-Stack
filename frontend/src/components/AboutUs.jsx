// AboutUsPage.js

import React from 'react';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import chinmayi from "./images/chinmayi.jpeg";
import disha from "./images/disha.jpeg";
import atish from "./images/atish.jpeg";
import yash from "./images/yash.jpeg";

const AboutUs = () => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '20px' }}>
      <h1>About Us</h1><br/>
      <Grid container spacing={3}>
        {/* Container 1 */}
        <Grid item xs={12} md={6} className='user-containers'>
          <Paper>
            <img
              src={atish}
              alt="Description of Image 1"
              style={{ width: '40%', height: '250px' }}
            />
            <h3>Name : Atish Bagad</h3>
            <p>Designation : Database Engineer</p>
          </Paper>
        </Grid>

        {/* Container 2 */}
        <Grid item xs={12} md={6} className='user-containers'>
          <Paper>
            <img
              src={chinmayi}
              alt="Description of Image 2"
              style={{ width: '40%', height: '250px' }}
            />
            <h3>Name : Chinmayi Patil</h3>
            <p>Designation : Software Tester, Content Writer</p>
          </Paper>
        </Grid>

        {/* Container 3 */}
        <Grid item xs={12} md={6} className='user-containers'>
          <Paper>
            <img
              src={disha}
              alt="Description of Image 3"
              style={{ width: '40%', height: '250px' }}
            />
            <h3>Name : Disha Gohil</h3>
            <p>Designation : Frontend Developer</p>
          </Paper>
        </Grid>

        {/* Container 4 */}
        <Grid item xs={12} md={6} className='user-containers'>
          <Paper>
            <img
              src={yash}
              alt="Description of Image 4"
              style={{ width: '40%', height: '250px' }}
            />
            <h3>Name : Yashodip Jain</h3>
            <p>Designation : Backend Developer</p>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AboutUs;
