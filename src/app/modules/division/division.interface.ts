

export interface IDivision {

    name: string;
    slug: string;
    thumbnail?: string
    description?: string
}

/* what is slug? 
    if name of division is Dhaka Division
    then slug will be from name is dhaka-division ->> its will lower and hypen between word

    we get user by id ->> /:id

    we will get division by slug->>   /:slug
    ->> division/dhaka-division
*/