import 'dotenv/config'
import express         from 'express'
import cors            from 'cors'
import bodyParser      from "body-parser";
import multer          from 'multer'
import {
    dirname,
    join
}                      from "path";
import {sequelize} from './util/database.js'
import authRoutes  from './api/example/routes/auth.js'
import {fileURLToPath} from 'url'
import UploadConfig    from "./util/UploadConfig.js";

const __filename = fileURLToPath(import.meta.url)
const __dirname  = dirname(__filename)

const app = express();
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

