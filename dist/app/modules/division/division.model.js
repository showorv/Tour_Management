"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Division = void 0;
const mongoose_1 = require("mongoose");
const divisionSchema = new mongoose_1.Schema({
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
});
// document middleware pre
divisionSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified("name")) { // if na dileo hobe 
            const baseSlug = this.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            this.slug = slug;
        }
        next();
    });
});
// query middleware pre 
divisionSchema.pre("findOneAndUpdate", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const division = this.getUpdate();
        if (division.name) {
            const baseSlug = division.name.toLowerCase().split(" ").join("-");
            let slug = `${baseSlug}-division`;
            let counter = 0;
            while (yield exports.Division.exists({ slug })) {
                slug = `${slug}-${counter++}`;
            }
            division.slug = slug;
        }
        this.setUpdate(division);
        next();
    });
});
exports.Division = (0, mongoose_1.model)("Division", divisionSchema);
