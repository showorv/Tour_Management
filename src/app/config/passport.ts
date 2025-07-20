// frontend e user req for google auth-> hit the backend url of http://localhost:5000/api/v1/auth/google ->passport-> google consent -> select email-> successfull -> http://localhost:5000/api/v1/auth/google/callback -> db store -> token provide for api access

import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { envVars } from "./env";
import { User } from "../modules/user/user.model";
import { Role } from "../modules/user/user.interface";
import { Strategy as  LocalStrategy} from "passport-local";
import bcryptjs from "bcryptjs"

passport.use(
    new LocalStrategy({

        // passport local e username r password field rkhe seta rename korte hbe

        usernameField: "email",
        passwordField: "password"
    }, async(email: string, password: string, done)=>{

        const userExist = await User.findOne({email})

        if(!userExist){
            return done(null, false, {message: "user doesnot exist"})
        }

        const isGoogleAuthenticated = userExist.auths.some(providerCheck => providerCheck.provider == "google");

        if(isGoogleAuthenticated && !userExist.password){
            return done (null, false, {message: "You signed up with Google. To use email and password, log in with Google first and set a password."})
        }

    
        const isPasswordMatch = await bcryptjs.compare(password as string, userExist.password as string)
    
    
        if(!isPasswordMatch){
            return done(null, false, {message: "password doesnot match"})
        }

        return done(null, userExist)
    })
)




// bridge == goolge ? db store -> token -> already store thakle only token provide


passport.use(
    new GoogleStrategy({
        clientID: envVars.GOOGLE_CLIENT_ID as string,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET as string,
        callbackURL: envVars.GOOGLE_CALLBACK_URL as string
    }, async(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback)=>{

        try {
            
            const email = profile.emails?.[0].value

            if(!email){
                return done(null, false, {message: "no email found"})
            }

            let user = await User.findOne({email})

            if(!user){
                user = await User.create({
                    email,
                    name: profile.displayName,
                    image: profile.photos?.[0].value,
                    isVerified: true,
                    role: Role.USER,
                    auths: [
                        {
                            provider: "google",
                           providerId: profile.id
                        }
                    ] 
                    
                })
            }

            return done( null, user)
        } catch (error) {
                return done(error)
        }
    })
)

passport.serializeUser((user:any, done: (err: any, id?: unknown) => void)=>{
    done(null, user._id)
})

passport.deserializeUser(async(id: string, done: any)=>{
    try {
        const user = await User.findById(id)
        done(null, user)
    } catch (error) {
        done(error)
    }
})