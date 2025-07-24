import { Query } from "mongoose"

export class QueryBuilder<T>{

    public modelQuery : Query<T[], T>
    public readonly query : Record<string, string>

    constructor( modelQuery:Query<T[], T>, query: Record<string, string> ){

        this. modelQuery =modelQuery,
        this.query = query
    }

    filter(): this {
        const filter = {...this.query}
 
        const deletedFiled = ["searchItem", "sort","fieldsFiltering", "page", "limit","skip"]

        for( const field of deletedFiled){
            delete filter[field]
        }

        this.modelQuery = this.modelQuery.find(filter); // Tour.find().find(filter)

        return this
    }

    search(searchableFiled: string[]): this {
        
        const searchItem = this.query.searchItem || "";


        const searchQuery = {
                    $or: searchableFiled.map(field => ({[field]:{ $regex: searchItem, $options: "i"} }))
                 }

                 this.modelQuery = this.modelQuery.find(searchQuery)
        return this
    }

    sort(){
        const sort = this.query.sort || "-createdAt"

        this.modelQuery = this.modelQuery.sort(sort)

        return this;
    }

    fieldsFiltering(){
        const fieldFiltering = this.query.fieldFiltering?.split(",").join(" ") || "" //title,location => title location

        this.modelQuery = this.modelQuery.select(fieldFiltering)
        
        return this;
    }

    paginate(){
        const page = Number(this.query.page) || 1
        const limit = Number(this.query.limit) || 10
        const skip = (page -1)*limit

        this.modelQuery = this.modelQuery.skip(skip).limit(limit)
        
        return this;
    }

    build(){
        return this.modelQuery
    }


    async getMeta(){
            const total = await this.modelQuery.model.countDocuments()
            const page = Number(this.query.page) || 1
            const limit = Number(this.query.limit) || 10

        const totalPage = Math.ceil(total/limit)

        return{
            page: page,
            limit: limit,
            total: total,
            totalPage: totalPage,
            
        }

    
    }
}