import  express  from "express";
import cookieParser from 'cookie-parser';
//Fix para __direname
import path from 'path';
import {fileURLToPath} from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import {methods as authentication} from "./controllers/authentication.controller.js"
import {methods as authorization} from "./middlewares/authorization.js";
import debug from "./utils/debug.js";

debug("Corriendo en ambiente de desarrollo");

//Server
const app = express();
app.set("port",80);
app.listen(app.get("port"), error => {
    if (error) {
        console.log(error);
        process.exit();
    }

    console.log("Servidor corriendo en puerto", app.get("port"));
});

//Configuración
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(cookieParser())


//Rutas
app.get("/",authorization.soloPublico, (req,res)=> res.sendFile(__dirname + "/pages/login.html"));
app.get("/register",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/register.html"));
app.get("/admin",authorization.soloPublico,(req,res)=> res.sendFile(__dirname + "/pages/admin.html"));
app.post("/api/login",authentication.login);
app.post("/api/register",authentication.register);