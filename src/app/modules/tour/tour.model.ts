import { Schema, model } from "mongoose";
import { ITour, ItourType } from "./tour.interface";


const tourTypeSchema = new Schema <ItourType>({
    name: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true, versionKey: false})


export const TourType = model<ItourType> ("TourType", tourTypeSchema)




const tourSchema = new Schema<ITour>({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
      
        unique: true
    },
    description: { type: String},
    images: { type: [String], default: []},
    location: { type: String},
    costFrom: { type: Number},
    startDate: { type: Date},
    endDate: { type: Date},
    departureLocation: { type: String}, 
    arrivalLocation: { type: String},
    included: {type: [String], default: []},
    excluded: {type: [String], default: []},
    amenities: {type: [String], default: []},
    tourPlan: {type: [String], default: []},
    maxGuest: { type: Number},
    minAge:  { type: Number},
    division: {
        type: Schema.Types.ObjectId,
        ref: "Division",
        required: true
    },
    tourType: {
        type: Schema.Types.ObjectId,
        ref: "TourType",
        required: true
    }

},{
    timestamps: true,
    versionKey: false
})


tourSchema.pre("save", async function(next) {
 
    if(this.isModified("title")){   // if na dileo hobe 
        const baseSlug =  this.title.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-tour`
    
    
        let counter = 0;
    
        while(await Tour.exists({slug})){
            slug = `${slug}-${counter++}`
        }
    
        this.slug = slug
    }


    
    next()
    
})


// query middleware pre 

tourSchema.pre("findOneAndUpdate", async function (next) {

    const tour = this.getUpdate() as Partial<ITour>

    if(tour.title){
        const baseSlug = tour.title.toLowerCase().split(" ").join("-")
        let slug = `${baseSlug}-tour`

        let counter = 0;
    
        while(await Tour.exists({slug})){
            slug = `${slug}-${counter++}` 
        }
    
        tour.slug = slug
    }

    this.setUpdate(tour)

    next()
    
})

export const Tour = model<ITour> ("Tour", tourSchema)