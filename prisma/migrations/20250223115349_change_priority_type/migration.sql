/*
  Warnings:

  - The `priority` column on the `Todo` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Todo" DROP COLUMN "priority",
ADD COLUMN     "priority" TEXT NOT NULL DEFAULT 'LOW';

-- DropEnum
DROP TYPE "Priority";
