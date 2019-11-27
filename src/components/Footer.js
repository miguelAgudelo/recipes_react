import React, { Component } from "react";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import GitHubIcon from '@material-ui/icons/GitHub';
class Footer extends Component {
  render() {
    return (
      <Grid container className="myFoo">
        <Grid>

          <IconButton edge="start" color="inherit" aria-label="menu">
            <GitHubIcon />
          </IconButton>

          <Typography variant="h6">
            Miguel Agudelo
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default Footer;