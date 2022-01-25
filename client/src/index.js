//handles app startup, routing and other functions of app

import React from 'react';

// DOM = Document Object Model -> is an API that defines the logical structure of HTML documents
// and the way it is accessed and manipulated
import ReactDOM from 'react-dom';


import App from './App';

//import for using the contextprovider for the components
import {ContextProvider} from './SocketContext';


import './styles.css';


// ReactDOM.render() takes in HTML code and an HTML element
// goal is to display the HTML code inside the specified HTML element
// we are displaying the App component inside an element with the id "root"
ReactDOM.render(
    //wrap the app in the contextprovider so the functions and states can be globally used by the app
    <ContextProvider>
            <App />
    </ContextProvider>,
    document.getElementById('root') //set the application to the root div
);