import mongoose from "mongoose";
import app from "./app";
import {Server} from "http"
import { envVars } from "./app/config/env";


let server: Server;
// dotenv.config();

async function main() {
    try {
        // console.log(envVars.NODE_ENV);
        
        await mongoose.connect(envVars.MONGODB_URI as string)
       
        

       server = app.listen(envVars.PORT, ()=>{
            console.log(`Server listening at ${envVars.PORT}`);
            
        })
    } catch (error) {
        console.log(error);
        
    }
}

main()

// server error handle and server off

process.on("unhandledRejection", (err)=>{
    console.log("unhandle rejection detected... server shutting down..",err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})


process.on("uncaughtException", (err)=>{
    console.log("uncaught exception detected... server shutting down..",err);

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

process.on("SIGTERM", ()=>{
    console.log("sigterm signal recived... server shutting down..");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})

process.on("SIGINT", ()=>{
    console.log("sigintsignal recived... server shutting down..");

    if(server){
        server.close(()=>{
            process.exit(1)
        })
    }

    process.exit(1)
    
})