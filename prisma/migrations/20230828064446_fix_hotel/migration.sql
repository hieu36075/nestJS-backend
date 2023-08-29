/*
  Warnings:

  - You are about to drop the column `categoryId` on the `CategoryRoom` table. All the data in the column will be lost.
  - Added the required column `hotelId` to the `CategoryRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOrBeds` to the `CategoryRoom` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryRoom" DROP CONSTRAINT "CategoryRoom_categoryId_fkey";

-- AlterTable
ALTER TABLE "CategoryRoom" DROP COLUMN "categoryId",
ADD COLUMN     "hotelId" TEXT NOT NULL,
ADD COLUMN     "numberOrBeds" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "area" INTEGER;

-- AddForeignKey
ALTER TABLE "CategoryRoom" ADD CONSTRAINT "CategoryRoom_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
