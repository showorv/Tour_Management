import { Types } from "mongoose";

export enum Role{
    SUPERADMIN = "SUPERADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}

export interface IAuths{
    provider: "credential" | "google"; //google or credential
    providerId: string
}

export enum IActive{
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"

}
export interface Iuser {
    _id?: string,
    name: string;
    email: string;
    password ?: string;
    phone?:string;
    image?: string;
    address?: string;
    isDeleted?: string;
    isActive?: string;
    isVerified?: boolean;
    role: Role;
    auths: IAuths[] // user google o dite prbe + chaile update e passoword o dite prbe
    bookings?: Types.ObjectId[]
    guides?: Types.ObjectId[]

}