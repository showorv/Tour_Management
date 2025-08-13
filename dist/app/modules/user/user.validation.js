"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserValidation = exports.createUserValidation = void 0;
const zod_1 = require("zod");
const user_interface_1 = require("./user.interface");
exports.createUserValidation = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "name must be string" })
        .min(2, { message: "name must have min 2 characters" })
        .max(50, { message: "name is too long" }),
    email: zod_1.z.string().email({ message: "wrong email format" }),
    password: zod_1.z
        .string()
        .min(6, { message: "password have to minimum 6 char" })
        .regex(/^(?=.*[A-Z]).{6,}$/, {
        message: "Password must include at least one uppercase letter",
    }),
    phone: zod_1.z
        .string()
        .regex(/^01[1-9]\d{8}$/, {
        message: "Phone number must be a valid Bangladeshi 11-digit number",
    })
        .optional(),
    address: zod_1.z.string().optional(),
});
exports.updateUserValidation = zod_1.z.object({
    name: zod_1.z
        .string({ invalid_type_error: "name must be string" })
        .min(2, { message: "name must have min 2 characters" })
        .max(50, { message: "name is too long" })
        .optional(),
    // password: z
    //   .string()
    //   .min(6, { message: "password have to minimum 6 char" })
    //   .regex(/^(?=.*[A-Z]).{6,}$/, {
    //     message: "Password must include at least one uppercase letter",
    //   })
    //   .optional(),
    phone: zod_1.z
        .string()
        .regex(/^01[1-9]\d{8}$/, {
        message: "Phone number must be a valid Bangladeshi 11-digit number",
    })
        .optional(),
    address: zod_1.z.string().optional(),
    role: zod_1.z.enum(Object.values(user_interface_1.Role)).optional(),
    isDeleted: zod_1.z.boolean().optional(),
    isActive: zod_1.z.enum(Object.values(user_interface_1.IActive)).optional(),
    isVerified: zod_1.z.boolean().optional(),
});
