//loading modules
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage } = require('./utils/message')
const { addUsers, removeUser, getUser, getUsersInRoom } = require('./utils/user')

//configuring the server with web socket
const app = express()
const server = http.createServer(app)
const io = socketio(server)

//configuring the port
const port = process.env.PORT || 3000

//configuring the path
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))
//configuring the event that triggers for the websocket

// let count=0

io.on('connection', (socket) => {
    console.log('Web socket io is configured and the client is connected')


    //users joining the room
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUsers({ id: socket.id, username, room })
        if (error) {
            return callback(error, undefined)
        }
        socket.join(user.room)
        socket.emit('newUserMessage', generateMessage('Admin', 'Welcome'))
        socket.broadcast.to(user.room).emit('newUserMessage', generateMessage(`${user.username} is joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })

    //receiving the event from client
    socket.on('newMessage', (msg, callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if (filter.isProfane(msg)) {
            return callback('profane words are not allowed', undefined)
        }
        io.to(user.room).emit('newUserMessage', generateMessage(user.username, msg))
        callback()
    })

    //client disconnection logic
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('newUserMessage', generateMessage('Admin',`${user.username} has left meeting`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

    //location share code event handler
    socket.on('sendLocation', (loc, callback) => {
        const user = getUser(socket.id)
        // socket.emit('locationMessage',`https://google.com/maps?q=${loc.latitude},${loc.longitude}`)
        // socket.broadcast.emit('locationMessage',`https://google.com/maps?q=${loc.latitude},${loc.longitude}`) 
        // io.emit('locationMessage',`https://google.com/maps?q=${loc.latitude},${loc.longitude}`)      30.1937° N, 71.4516°   
        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=30.1937,71.4516`))
        callback()
    })
})

server.listen(port, () => {
    console.log("Server is running on port " + port)
})



























 // socket.emit('countUpdated',count)//sending the event to the client
    // socket.on('increment',()=>{//recieving the event from the client
    //     count++
    //     io.emit('countUpdated',count)
    // })