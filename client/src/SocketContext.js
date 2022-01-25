//this file contains all logic for socket.io, which will be shared with all components

// react context allows data to be shared with multiple components 
// at different levels of depth (like a global variable)
// this means we don't have to pass data from parent to child
// for multiple components via props (inputs)

import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

//create context
const SocketContext = createContext();

//create instance of socket.io
const socket = io('http://localhost:5000');

//curly braces used to destructure props
const ContextProvider = ({ children }) => {
  //state-changer for when call is accepted
  const [callAccepted, setCallAccepted] = useState(false);
  //state-changer for when call is ended
  const [callEnded, setCallEnded] = useState(false);
  //set initial stream state to null
  const [stream, setStream] = useState();
  //state-changer for the name of the user we will be calling
  const [name, setName] = useState('');
  //'call' will include important information once the 'calluser' action is performed
  const [call, setCall] = useState({});
  //to set the state of the user's id, initialize as empty string
  const [me, setMe] = useState('');

  //refs are an easy way to access DOM (document object model) elements in a React component
  //DOM elements include DIV, HTML, BODY elements on a page
  //in this case we want to reference the video that will appear on the page
  //we want to populate the video <iframe> element with the videostream
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  //code here runs immediately when page loads
  //request video and mic access
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //above line returns a promise (3 states: fulfilled, rejected, or pending)
        //a promise is smth that will be given a value later on in time
        //chain a .then() to handle the case when the promise is fulfilled
      .then((currentStream) => {
        //change the state of the stream to currentStream
        setStream(currentStream);
        //we want to populate the video <iframe> element with the videostream
        myVideo.current.srcObject = currentStream;
      });
    
    //listen for the 'me' action defined in index.js
    //this action emits the id of user as soon as the connection is made
    //we want to change the id state to the id obtained by the action
    socket.on('me', (id) => setMe(id));
    
    //get 3 things emitted from 'calluser' action
    //rename 'name' to callerName
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      //change the setCall state to contain the necessary info
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []); //need an empty dependency array at the end or the useEffect will constantly be running

  const answerCall = () => {
    setCallAccepted(true);

    //create Peer object for video call
    //initiator is false since we did not start the call
    //set trickle to false to prevent ICE trickling (continuing to send data after the initial offer/answer has been sent to the other peer)
    //pass in the stream (which we set to currenStream above)
    const peer = new Peer({ initiator: false, trickle: false, stream });

    //once we receive the signal, we will send the data to whoever called us
    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    //populate the video <iframe> element with the videostream of the other person's video
    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    //set the current connection to the peer object that is inside this answercall to receive input from user's camera and audio
    connectionRef.current = peer;
  };

  const callUser = (id) => {
    
    //create a peer object like answerCall, but we are now the initiator
    const peer = new Peer({ initiator: true, trickle: false, stream });

    //populate the video <iframe> element with the videostream of the other person's video
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);

      peer.signal(signal);
    });

    //set the current connection to the peer object that is inside this callUser to receive input from user's camera and audio
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy(); //destroy the connection, stop receiving input

    window.location.reload(); //reload the page and gives the user a new id for another call (in the setMe(id) part of this code)
  };

  return (
    //everything you pass into the SocketConext.Provider value object is globally accessible by all your components
    //we will pass all the states and functions defined in this file
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };