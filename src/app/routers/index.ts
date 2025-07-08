import { Router } from "express";
import { userRouter } from "../modules/user/user.router";


export const router = Router()

const moduleRoutes = [
    {
        path: "/user",
        route: userRouter
    }
]

moduleRoutes.forEach((route)=>{
    router.use(route.path, route.route)
})