/*
  Warnings:

  - You are about to drop the `UserVoucher` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Voucher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserVoucher" DROP CONSTRAINT "UserVoucher_userId_fkey";

-- DropTable
DROP TABLE "UserVoucher";

-- DropTable
DROP TABLE "Voucher";

-- DropEnum
DROP TYPE "VoucherStatus";
