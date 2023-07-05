import { amenitys } from "./data/amenity";
import { roles } from "./data/roles";
import { PrismaClient } from "@prisma/client";

import { countries } from "./data/countries";
import { categories } from "./data/categories";

const prisma = new PrismaClient();

async function main() {
        await prisma.role.createMany({
            data: roles,
        }) 
        await prisma.amenity.createMany({
            data:amenitys,
        })
        await prisma.country.createMany({
            data: countries,
        })
        await prisma.category.createMany({
            data: categories,
        })
}

main().catch(e => {
    console.log(e);
    process.exit(1)
}).finally(() => {
    prisma.$disconnect();
})