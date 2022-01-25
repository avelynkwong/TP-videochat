import React, { useContext } from 'react';
import { Grid, Typography, Paper, makeStyles } from '@material-ui/core';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  video: {
          marginTop: '0px',
          width: '550px',
          [theme.breakpoints.down('xs')]: {
            width: '300px',
          },
          borderRadius: '0px 10px 10px 10px',
  },

  gridContainer: {
    justifyContent: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
    },
  },
  paper: {
    padding: '10px',
    border: '0px',
    margin: '10px',
    background: 'transparent',
  },

  name: {
          fontFamily: 'Courier',
          fontSize: 15,
          width: '180px',
          background: 'rgba(255, 255, 255, 0.6)',
          padding: '5px 0px 0px 10px',
          borderRadius: '10px 10px 0px 0px',
  },

}));

const VideoPlayer = () => {
  const { name, callAccepted, myVideo, userVideo, callEnded, stream, call } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <Grid container className={classes.gridContainer}>
      {/* render our own video only if there is a stream*/}
      {stream && (
        <Paper className={classes.paper} elevation={0}>
          {/*takes up full width of screen (12/12 grid spaces) on mobile devices and half width of screen on desktop*/}
          {/*on desktop, half the screen will be your video, half will be other person's video*/}
          <Grid item xs={12} md={6}>
            <Typography className = {classes.name}>{name || 'Name'}</Typography>
            {/*we will mute our own video and set it to autoplay*/}
            {/*myVideo ref connects the stream and the video component*/}
            {/*remember in socketcontext myVideo.current.srcObject = currentStream*/}
            <video playsInline muted ref={myVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}

      {/*render user's video only if the call is accepted and the call isn't ended*/}
      {callAccepted && !callEnded && (
        <Paper className={classes.paper}>
          <Grid item xs={12} md={6}>
            <Typography
              className = {classes.name}>{call.name || 'Name'}
            </Typography> {/*the name of the other person*/}
            {/*do not mute the user video*/}
            <video playsInline ref={userVideo} autoPlay className={classes.video} />
          </Grid>
        </Paper>
      )}
    </Grid>
  );
};

export default VideoPlayer;