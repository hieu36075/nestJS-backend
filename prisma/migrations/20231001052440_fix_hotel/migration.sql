/*
  Warnings:

  - You are about to drop the column `type` on the `Notification` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Hotel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `action` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Hotel" ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "type",
ADD COLUMN     "action" TEXT NOT NULL;
