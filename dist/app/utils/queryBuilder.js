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
exports.QueryBuilder = void 0;
class QueryBuilder {
    constructor(modelQuery, query) {
        this.modelQuery = modelQuery,
            this.query = query;
    }
    filter() {
        const filter = Object.assign({}, this.query);
        const deletedFiled = ["searchItem", "sort", "fieldsFiltering", "page", "limit", "skip"];
        for (const field of deletedFiled) {
            delete filter[field];
        }
        this.modelQuery = this.modelQuery.find(filter); // Tour.find().find(filter)
        return this;
    }
    search(searchableFiled) {
        const searchItem = this.query.searchItem || "";
        const searchQuery = {
            $or: searchableFiled.map(field => ({ [field]: { $regex: searchItem, $options: "i" } }))
        };
        this.modelQuery = this.modelQuery.find(searchQuery);
        return this;
    }
    sort() {
        const sort = this.query.sort || "-createdAt";
        this.modelQuery = this.modelQuery.sort(sort);
        return this;
    }
    fieldsFiltering() {
        var _a;
        const fieldFiltering = ((_a = this.query.fieldFiltering) === null || _a === void 0 ? void 0 : _a.split(",").join(" ")) || ""; //title,location => title location
        this.modelQuery = this.modelQuery.select(fieldFiltering);
        return this;
    }
    paginate() {
        const page = Number(this.query.page) || 1;
        const limit = Number(this.query.limit) || 10;
        const skip = (page - 1) * limit;
        this.modelQuery = this.modelQuery.skip(skip).limit(limit);
        return this;
    }
    build() {
        return this.modelQuery;
    }
    getMeta() {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield this.modelQuery.model.countDocuments();
            const page = Number(this.query.page) || 1;
            const limit = Number(this.query.limit) || 10;
            const totalPage = Math.ceil(total / limit);
            return {
                page: page,
                limit: limit,
                total: total,
                totalPage: totalPage,
            };
        });
    }
}
exports.QueryBuilder = QueryBuilder;
