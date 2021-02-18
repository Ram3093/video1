require('dotenv').config();
const express = require("express");
const http = require("http");
const app = express();
const cors=require('cors');
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const bodyParser = require("body-parser");
const authroute=require("./routes/Auth");
const users = {};

const socketToRoom = {};




io.on('connection', socket => {
    socket.on("join room", roomID => {
        if (users[roomID]) {
            const length = users[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            users[roomID].push(socket.id);
        } else {
            users[roomID] = [socket.id];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            users[roomID] = room;
        }
    });

});



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
require("./config/db");
app.use(cors());

app.use("/api/v1.0/auth",authroute);

server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));


