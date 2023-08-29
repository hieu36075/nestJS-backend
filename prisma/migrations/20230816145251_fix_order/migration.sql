/*
  Warnings:

  - You are about to drop the column `date` on the `Order` table. All the data in the column will be lost.
  - The `status` column on the `Order` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `orderStatus` on the `OrderDetails` table. All the data in the column will be lost.
  - You are about to drop the column `Description` on the `Voucher` table. All the data in the column will be lost.
  - Added the required column `checkIn` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `checkOut` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roomId` to the `OrderDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Voucher` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('IN_PROGRESS', 'DONE');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "date",
ADD COLUMN     "checkIn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "checkOut" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "OrderDetails" DROP COLUMN "orderStatus",
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "roomId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Voucher" DROP COLUMN "Description",
ADD COLUMN     "description" TEXT NOT NULL;

-- DropEnum
DROP TYPE "OrderDetailStatus";

-- AddForeignKey
ALTER TABLE "OrderDetails" ADD CONSTRAINT "OrderDetails_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
