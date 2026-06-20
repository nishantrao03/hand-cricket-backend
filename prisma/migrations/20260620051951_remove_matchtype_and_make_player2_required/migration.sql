/*
  Warnings:

  - You are about to drop the column `matchType` on the `Match` table. All the data in the column will be lost.
  - Made the column `player2Id` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_player2Id_fkey";

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "matchType",
ALTER COLUMN "player2Id" SET NOT NULL;

-- DropEnum
DROP TYPE "MatchType";

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
