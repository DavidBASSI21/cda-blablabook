/*
  Warnings:

  - You are about to drop the column `category` on the `book` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `author` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `publisher` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `isbn` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(13)`.
  - You are about to alter the column `cover` on the `book` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to drop the column `reportCounter` on the `comment` table. All the data in the column will be lost.
  - You are about to alter the column `title` on the `comment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `rating` on the `rate` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `SmallInt`.
  - You are about to alter the column `username` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `email` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `password` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(64)`.
  - You are about to alter the column `profilePicture` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(500)`.
  - You are about to drop the `CommentReport` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `publishing_date` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `averageRating` on table `book` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `name` on the `role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "role_enum" AS ENUM ('USER', 'ADMIN');

-- DropForeignKey
ALTER TABLE "CommentReport" DROP CONSTRAINT "CommentReport_commentId_fkey";

-- DropForeignKey
ALTER TABLE "CommentReport" DROP CONSTRAINT "CommentReport_userId_fkey";

-- AlterTable
ALTER TABLE "book" DROP COLUMN "category",
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "author" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "publishing_date" SET NOT NULL,
ALTER COLUMN "publishing_date" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "publisher" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "isbn" SET DATA TYPE VARCHAR(13),
ALTER COLUMN "cover" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "averageRating" SET NOT NULL;

-- AlterTable
ALTER TABLE "comment" DROP COLUMN "reportCounter",
ALTER COLUMN "title" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "rate" ALTER COLUMN "rating" SET DATA TYPE SMALLINT;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "name",
ADD COLUMN     "name" "role_enum" NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "username" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(64),
ALTER COLUMN "profilePicture" SET DATA TYPE VARCHAR(500);

-- DropTable
DROP TABLE "CommentReport";

-- CreateTable
CREATE TABLE "commentReport" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "commentReport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "commentReport_commentId_idx" ON "commentReport"("commentId");

-- CreateIndex
CREATE INDEX "commentReport_userId_idx" ON "commentReport"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "commentReport_commentId_userId_key" ON "commentReport"("commentId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- AddForeignKey
ALTER TABLE "commentReport" ADD CONSTRAINT "commentReport_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentReport" ADD CONSTRAINT "commentReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
