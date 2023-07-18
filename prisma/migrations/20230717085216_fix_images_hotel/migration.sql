/*
  Warnings:

  - You are about to drop the `HotelImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HotelImage" DROP CONSTRAINT "HotelImage_hotelId_fkey";

-- DropTable
DROP TABLE "HotelImage";

-- CreateTable
CREATE TABLE "ImageHotel" (
    "id" TEXT NOT NULL,
    "hotelId" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "ImageHotel_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImageHotel" ADD CONSTRAINT "ImageHotel_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
