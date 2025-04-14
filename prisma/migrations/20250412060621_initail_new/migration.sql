/*
  Warnings:

  - You are about to drop the column `description` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `aiGenerated` on the `module_contents` table. All the data in the column will be lost.
  - You are about to drop the column `contentType` on the `module_contents` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `module_contents` table. All the data in the column will be lost.
  - You are about to drop the column `position` on the `module_contents` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `module_contents` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `modules` table. All the data in the column will be lost.
  - You are about to drop the column `isLocked` on the `modules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "courses" DROP COLUMN "description";

-- AlterTable
ALTER TABLE "module_contents" DROP COLUMN "aiGenerated",
DROP COLUMN "contentType",
DROP COLUMN "duration",
DROP COLUMN "position",
DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "description",
DROP COLUMN "isLocked";

-- DropEnum
DROP TYPE "ContentType";
