//rendering of components

import React from 'react'

//material-ui is a ui kit that gives you pre-styled components
import { Typography, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

//import app components
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';


//define styles for the app components
const useStyles = makeStyles((theme) => ({

    appBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    
        [theme.breakpoints.down('xs')]: {
          width: '90%',
        },
      },

    wrapper: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontSize: 60,
        fontFamily: 'Courier',
    },

}));

const App = () => {

    //create hook so to apply styles to app components
    const classes = useStyles();

    return(
        // apply all styles defined in "wrapper" to all the components
        <div className={classes.wrapper}>
            <div>
                <AppBar 
                    className={classes.wrapper} //apply styles defined in "appBar"
                    position="static" 
                    style={{
                        backgroundColor: "transparent",
                        color: "white",
                        boxShadow: "0px 0px 0px 0px"
                    }}>

                    <Typography className={classes.title} align="center">
                        BabbleBot
                    </Typography>
                </AppBar>  
                <VideoPlayer />
                <Options>
                    <Notifications />
                </Options>  
            </div>
        </div>
    )
}

export default App;