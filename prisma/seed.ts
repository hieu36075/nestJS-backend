import { amenities } from "./data/amenities";
import { roles } from "./data/roles";
import { PrismaClient } from "@prisma/client";
import { countries } from "./data/countries";
import { categories } from "./data/categories";
import { cities } from "./data/cities";

const prisma = new PrismaClient();

async function main() {
        await prisma.role.createMany({
            data: roles,
        }) 
        await prisma.amenity.createMany({
            data:amenities,
        })
        await prisma.country.createMany({
            data: countries,
        })
        await prisma.category.createMany({
            data: categories,
        })
        await prisma.city.createMany({
            data: cities
        })
}

main().catch(e => {
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})