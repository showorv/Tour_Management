import { Types } from "mongoose";

export interface ItourType {
    name: string
}

export interface ITour {
    title: string;
    slug: string ; // name of titile
    description?: string;
    images?: string[];
    location?: string;
    costFrom?: number;
    startDate?: Date;
    endDate?: Date;
    departureLocation?: string;
    arrivalLocation?: string;
    included?: string[]
    excluded?: string[]
    amenities?: string[] // like jersey dibe nki amn kisu
    tourPlan?: string[];
    maxGuest?: number;
    minAge?: number;
    division: Types.ObjectId 
    tourType: Types.ObjectId  // tourtype alada banabo karon filtering er jnne kaje ashbe

}