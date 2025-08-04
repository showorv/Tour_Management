import express, { Application, Request, Response } from "express"
import "./app/config/passport"
import cors from "cors"
import { router } from "./app/routers"
import { globalError } from "./app/middlewares/globalErrorHandle"
import { routeNotFound } from "./app/middlewares/routeNotFound"
import cookieParser from "cookie-parser"
import passport from "passport"
import expressSession from "express-session"

const app:Application = express()

app.use(expressSession({
    secret: "my secret",
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true})) // for read form-data

app.use(cors())



app.use("/api/v1", router)

app.get("/",(req: Request,res: Response)=>{
    res.status(200).json({
        message: "Welcome to tour management"
    })
})

// global error

app.use(globalError)

// route not found

app.use(routeNotFound)

export default app;
