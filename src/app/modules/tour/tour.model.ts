import { Schema, model } from "mongoose";
import { ITour, ItourType } from "./tour.interface";


const tourTypeSchema = new Schema <ItourType>({
    name: {
        type: String,
        required: true,
        unique: true
    }
},{timestamps: true, versionKey: true})


export const TourType = model<ItourType> ("TourType", tourTypeSchema)

const tourSchema = new Schema<ITour>({
    title: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    description: { type: String},
    images: { type: [String], default: []},
    location: { type: String},
    costFrom: { type: Number},
    startDate: { type: Date},
    endDate: { type: Date},
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

export const Tour = model<ITour> ("Tour", tourSchema)