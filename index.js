import 'dotenv/config'
import express         from 'express'
import cors            from 'cors'
import bodyParser      from "body-parser";
import multer          from 'multer'
import {
    dirname,
    join
}                      from "path";
import {sequelize}     from './util/database.js'
import authRoutes      from './api/users/routes/auth.js'
import {fileURLToPath} from 'url'
import {Server}        from "socket.io";
import {createServer}  from "http";
import UploadConfig    from "./util/UploadConfig.js";
import chatRoutes      from './api/chat/routes/chat.js'

import {logger} from "./util/logging.js";
const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)
const app        = express();
const server     = createServer(app);
const io         = new Server(server,
                              {
                                  cors: {
                                      origin : "http://localhost:3000",
                                      methods: [
                                          "GET",
                                          "POST"
                                      ]
                                  }
                              });
logger.error(new Error('sss'))
io.on('connection',
      (socket) => {
          console.log('connected')
          socket.on('chatMessage',
                    () => {
                        console.log('ssss')
                        socket.broadcast.emit('refreshChat')
                    });
      });

server.listen(3011);

app.use(bodyParser.json());
app.use(cors());
app.use(multer({
                   storage: UploadConfig.fileStorage,
                   filter : UploadConfig.fileFilter
               })
            .single('image'));
try {
    await sequelize.sync({logging: false})
    app.listen(3010)
}
catch (e) {
    console.log(e)
}

app.use(
    '/images',
    express.static(join(
        __dirname,
        'images'
    ))
);

app.use(
    '/auth',
    authRoutes
);
app.use('/chat',
        chatRoutes)
app.use((
            error,
            req,
            res,
            next
        ) => {
    const status  = error.statusCode || 500;
    const message = error.message;
    const data    = error.data;
    res.status(status)
       .json({
                 message: message,
                 data   : data
             });
});

