const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const { log } = require('console');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
let history=[];
io.on('connection', (socket) => {
    console.log('New client connected');
    let msg=[];
    socket.on('message', (data) => {
        console.log('Received message:', data);
        const timestamp = new Date().toLocaleTimeString(); // Get the current time
        msg.push(data);
        history.push(data);
        const messageWithTimestamp = { text: data, timestamp ,msg,history};
        // console.log(timestamp);
        // console.log(messageWithTimestamp);
        io.emit('message', messageWithTimestamp);
        // io.emit('history',msg) ;// Broadcast the received message with timestamp
        // setTimeout(() => {
        //     io.emit('message', { text: `Server: You said "${data}"`, timestamp });
        // }, 500); // Respond with a message after 500ms with timestamp
    });
    let user=[]
    socket.on('user',(userdata)=>{
        console.log("user",userdata);
        user.push(userdata)
        const res={userses:userdata,user};
        io.emit('user',res);
    });
    socket.on('disconnect', () => {
       
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4001;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  