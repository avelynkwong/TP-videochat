import React, { useContext } from 'react';
import { Button } from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

import { SocketContext } from '../SocketContext';

const useStyles = makeStyles((theme) => ({
  button: {
    justifyContent: 'center',
    marginTop: 5,
    background: 'rgba(0, 255, 0, 0.6)',
    fontFamily: 'Courier',
    fontSize: 12,
  },

  notif: {
    fontSize: 15,
  }
}));

const Notifications = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  const classes = useStyles();

  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Typography className = {classes.notif} gutterBottom variant="overline">{call.name} is calling:</Typography>
          <Button className = {classes.button} variant="contained" onClick={answerCall}>
            Answer
          </Button>
        </div>
      )}
    </>
  );
};

export default Notifications;