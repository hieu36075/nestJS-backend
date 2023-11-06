/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `expectedCheckIn` on the `Room` table. All the data in the column will be lost.
  - You are about to drop the column `expectedCheckOut` on the `Room` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_categoryId_fkey";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "categoryId",
DROP COLUMN "expectedCheckIn",
DROP COLUMN "expectedCheckOut";

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");
