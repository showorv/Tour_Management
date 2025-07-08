import {  Schema, model } from "mongoose";
import { IActive, IAuths, Iuser, Role } from "./user.interface";
import { string } from "zod";

const authEmebededSchema = new Schema<IAuths>(
    {
        provider: {
            type: String,
            required: true
        },
        providerId: {
            type: String,
            required: true
        },
    },{
    _id: false,
    versionKey: false
})


const userSchema = new Schema<Iuser>({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String
    },
    phone: {
        type: String
    },
    address: {
        type: String
    },
    image: {
        type: String
    },
    role :{
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    isVerified : {
        type: Boolean,
        default: false
    },
    isActive: {
        type: String,
        enum: Object.values(IActive),
        default: IActive.ACTIVE
    },

    auths: [authEmebededSchema]
},{
    timestamps: true,
    versionKey: false
})

export const User = model<Iuser>("User", userSchema)