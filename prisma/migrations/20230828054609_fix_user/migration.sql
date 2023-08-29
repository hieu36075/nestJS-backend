/*
  Warnings:

  - Added the required column `hotelId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "hotelId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
