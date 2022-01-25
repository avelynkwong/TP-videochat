// This file is the server for our app

// Express is web app framework for Node.js, used for designing and building web apps quickly
const app = require("express")();
const server = require("http").createServer(app);
// CORS = cross-origin resource sharing -> allows a server to indicate any origins other than its own
// from which a browser should permit loading of resources
const cors = require("cors");

//socket.io allows bi-directional communication btwn client and server
//initialize the server "io"
const io = require("socket.io")(server, {
	cors: {
		origin: "*", //allows access from all origins
		methods: [ "GET", "POST" ] //can view AND change data on server
	}
});

app.use(cors());

//declare the localhost port
const PORT = process.env.PORT || 5000;

//create the root route (how the root url will respond to client requests)
app.get('/', (req, res) => {
	//respond with the message below when a GET request is made to homepage
	res.send('Running');
});

//socket is one endpoint of 2-way communication between two programs
//each user has their own connection to the server, with a designated socket
//server's connection to the socket will allow us to transmit video in real time
io.on("connection", (socket) => {
	//gives the user (me) an id when connected to the server
	socket.emit("me", socket.id);

	//create disconnect event handler
    //when server receives an event called 'disconnect' from the socket connection
    //socket will send message to all connected clients except the sender
	socket.on("disconnect", () => {
		//broadcast prevents "callended" from being sent to the person who ended the call
		socket.broadcast.emit("callEnded")
	});

	//create a calluser event handler
    //pass all the info to the user you are calling (individual socketid)
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		io.to(userToCall).emit("callUser", { signal: signalData, from, name });
	});

	//socket handler to answer a call
	socket.on("answerCall", (data) => {
		//send "callaccepted" and your signal to an individual socketid
		io.to(data.to).emit("callAccepted", data.signal)
	});
});

//allows us to visit the server
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));