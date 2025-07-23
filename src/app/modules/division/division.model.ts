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

// document middleware pre

divisionSchema.pre("save", async function(next) {
 
    if(this.isModified("name")){   // if na dileo hobe 
        const baseSlug =  this.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`
    
    
        let counter = 0;
    
        while(await Division.exists({slug})){
            slug = `${slug}-${counter++}`
        }
    
        this.slug = slug
    }


    
    next()
    
})


// query middleware pre 

divisionSchema.pre("findOneAndUpdate", async function (next) {

    const division = this.getUpdate() as Partial<IDivision>

    if(division.name){
        const baseSlug = division.name.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-division`

        let counter = 0;
    
        while(await Division.exists({slug})){
            slug = `${slug}-${counter++}` 
        }
    
        division.slug = slug
    }

    this.setUpdate(division)

    next()
    
})

export const Division =  model<IDivision>("Division", divisionSchema)