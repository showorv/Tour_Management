import {  Schema, model } from "mongoose";
import { IDivision } from "./division.interface";


const divisionSchema = new  Schema<IDivision>({

    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        unique: true
    },
    thumbnail: {
        type: String
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})

export const Division =  model<IDivision>("Division", divisionSchema)