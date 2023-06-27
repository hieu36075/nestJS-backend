-- AlterTable
ALTER TABLE "users" ALTER COLUMN "hashedPassword" DROP NOT NULL;

-- CreateTable
CREATE TABLE "GoogleAcount" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "refreshToken" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GoogleAcount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAcount_userId_key" ON "GoogleAcount"("userId");

-- AddForeignKey
ALTER TABLE "GoogleAcount" ADD CONSTRAINT "GoogleAcount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
