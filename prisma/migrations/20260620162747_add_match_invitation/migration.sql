-- CreateTable
CREATE TABLE "MatchInvitation" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchInvitation_pkey" PRIMARY KEY ("id")
);
