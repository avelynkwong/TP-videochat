import React, { useState, useContext } from 'react';
import { Button, TextField, Grid, Typography, Container, Paper } from '@material-ui/core';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Assignment, Phone, PhoneDisabled } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';

import { SocketContext } from '../SocketContext';


//styles for options sidebar
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    gridContainer: {
      width: '100%',
      [theme.breakpoints.down('xs')]: {
        flexDirection: 'column',
      },
    },
    container: {
      justifyContent: 'center',
      width: '600px',
      margin: 'auto',
      padding: 0,
      [theme.breakpoints.down('xs')]: {
        width: '100%',
      },
    },
    button: {
      justifyContent: 'center',
      marginTop: 5,
      background: 'rgba(255, 255, 255, 0.6)',
      fontFamily: 'Courier',
      fontSize: 12,
    },
    padding: {
      padding: 10,
    },
    paper: {
      padding: '0px 0px',
      border: '0px',
      background: 'transparent',
    },

    hangup: {
      justifyContent: 'center',
      marginTop: 5,
      background: 'rgba(255, 0, 0, 0.6)',
      fontFamily: 'Courier',
      fontSize: 12,
    }

  }));


//the notifications component from App.js is passed in as a child of the options component
const Options = ({ children }) => {
    //!
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser} = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('');
    const classes = useStyles();

    return (
        <Container className={classes.container}>
          <Paper className={classes.paper} elevation = {0}>
            <form className = {classes.root} noValidate autoComplete="off">
              <Grid container className = {classes.gridContainer}>
                
                {/* takes up full screen on small devices and half width on medium/large devices */}
                <Grid item xs={12} md={6} className={classes.padding}>
                  <Typography gutterBottom variant="overline">Account Info</Typography>
                  {console.log(me)}
                  {/* set the name as we type it into the textfield */}
                  <TextField label="YOUR NAME" value={name} onChange={(e) => setName(e.target.value)} fullWidth InputLabelProps={{ style: { fontSize: 12 } }}/>
                  <CopyToClipboard text={me} className = {classes.button}>
                    <Button variant="contained" fullWidth startIcon={<Assignment/>}>
                      Copy Your ID
                    </Button>
                  </CopyToClipboard>
                </Grid>

                <Grid item xs={12} md={6} className={classes.padding}>
                  <Typography gutterBottom variant="overline">Make a Call</Typography>
                  
                  {/* set the id to call as we type it into the textfield */}
                  <TextField label="ID to call" value={idToCall} onChange={(e) => setIdToCall(e.target.value)} fullWidth />
                  {callAccepted && !callEnded ? (
                    //if we are in the call
                    <Button 
                    variant="contained" 
                    colour="primary"
                    startIcon={<PhoneDisabled fontSize="large"/>}
                    fullWidth
                    //when user clicks button, the leaveCall function from socketcontext is executed
                    onClick={leaveCall}
                    className={classes.hangup}>
                      Hang Up
                    </Button>
                  ) : (
                    //if we are not in the call
                    <Button
                    variant="contained" 
                    colour="primary"
                    startIcon={<Phone fontSize="large"/>}
                    fullWidth
                    //arrow function needed so that the callUser function is only called AFTER the button as been clicked
                    //don't want function to automatically run
                    onClick={()=> callUser(idToCall)} 
                    className={classes.button}>
                      Call
                    </Button>
                  )}

                </Grid>

              </Grid>
            </form>
            {children}
          </Paper>

        </Container>
    );
};

export default Options