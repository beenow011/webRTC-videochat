import express from "express"
import http from "http"
import {Server} from 'socket.io'
import cors from 'cors'
import { roomHandler } from "./room"

const port = 8000
const app = express() // express app
app.use(cors)
const server = http.createServer(app) // http server
const io = new Server(server , {
    cors:{
        origin: '*',
        methods:["GET","POST"]
    }
}) // web socket server

io.on("connection",(socket)=>{
    console.log('User is connected')
   roomHandler(socket)
    socket.on('disconnect',()=>{
        console.log("User is dissconnected")
    })
})

server.listen(port , ()=>{
    console.log(`Listening to the server on ${port}`)
})

