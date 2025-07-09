import express, { Application, Request, Response } from "express"

import cors from "cors"
import { router } from "./app/routers"
import { globalError } from "./app/middlewares/globalErrorHandle"
const app:Application = express()

app.use(express.json())

app.use(cors())



app.use("/api/v1", router)

app.get("/",(req: Request,res: Response)=>{
    res.status(200).json({
        message: "Welcome to tour management"
    })
})

// global error

app.use(globalError)

export default app;
