/*
  Warnings:

  - You are about to drop the column `name` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the `ImageComment` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actionId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ImageComment" DROP CONSTRAINT "ImageComment_commentId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "name",
ADD COLUMN     "createAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "actionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ImageComment";
