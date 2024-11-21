import multer from 'multer'
import express from "express"
import cors from 'cors'
import fs from 'fs'
import socketio from 'socket.io'
import http from 'http'

const app = express();
app.use(cors())
const server = http.createServer(app);
const io = new socketio.Server(server, {
    cors:{
        origin:'*',
        //methods:['GET', 'POST']
    } 
})


io.on('connection',(socket)=>{
    //console.log('user connected')
    
    //io.emit('idClient', socket.id)

    socket.on('chatMessage',(msg)=>{
        console.log(msg)
        io.emit('chatMessage',msg)
    })
        
    socket.on('disconnect',()=>{
        //console.log('user disconnect')
    })
})


let imageName='Avatar.png'

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, './public/upload')
    },
    
    filename(req, file, callback) {
        if(imageName !== file.originalname){
            fs.unlink(`./public/upload/${imageName}`,(err)=>{
                if(err){
                    return console.error('error: ', err)
                }
                console.log('arqquivo deletado')
            })
            imageName = file.originalname

            callback(null, `${file.originalname}`)
        }else{
            console.log('arquivos iguais')
        }
    },
})

const upload = multer({
    storage,
})

app.post('/', upload.single('avatar'), (req, res, next)=>{
    const file = req.file?.filename
    console.log(file)
    res.send()
})


server.listen(3333, ()=>{
    console.log('Running on port 3333')
})

