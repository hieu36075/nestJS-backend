/*
  Warnings:

  - You are about to drop the column `idRoom` on the `ImageRoom` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `ImageRoom` table. All the data in the column will be lost.
  - You are about to drop the column `postId` on the `ImageRoom` table. All the data in the column will be lost.
  - You are about to drop the column `isAvaiable` on the `Room` table. All the data in the column will be lost.
  - Added the required column `userId` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Made the column `checkInTime` on table `Hotel` required. This step will fail if there are existing NULL values in that column.
  - Made the column `checkOutTime` on table `Hotel` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `postId` to the `ImagePost` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `ImageRoom` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `ImageRoom` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoomStatus" AS ENUM ('AVAILABLE', 'BOOKED', 'RETURNED');

-- DropForeignKey
ALTER TABLE "ImageRoom" DROP CONSTRAINT "ImageRoom_idRoom_fkey";

-- DropForeignKey
ALTER TABLE "ImageRoom" DROP CONSTRAINT "ImageRoom_postId_fkey";

-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "checkInTime" SET NOT NULL,
ALTER COLUMN "checkInTime" SET DATA TYPE TEXT,
ALTER COLUMN "checkOutTime" SET NOT NULL,
ALTER COLUMN "checkOutTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ImagePost" ADD COLUMN     "postId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImageRoom" DROP COLUMN "idRoom",
DROP COLUMN "imageUrl",
DROP COLUMN "postId",
ADD COLUMN     "roomId" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "isAvaiable",
ADD COLUMN     "expectedCheckIn" TIMESTAMP(3),
ADD COLUMN     "expectedCheckOut" TIMESTAMP(3),
ADD COLUMN     "status" "RoomStatus" NOT NULL DEFAULT 'AVAILABLE';

-- AddForeignKey
ALTER TABLE "Hotel" ADD CONSTRAINT "Hotel_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImageRoom" ADD CONSTRAINT "ImageRoom_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ImagePost" ADD CONSTRAINT "ImagePost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
