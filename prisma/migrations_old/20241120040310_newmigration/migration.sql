-- CreateTable
CREATE TABLE "TeamMemberDetail" (
    "id" SERIAL NOT NULL,
    "officeAddress" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "telephoneNumber" TEXT NOT NULL,
    "websiteLink" TEXT NOT NULL,
    "teamMemberId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "TeamMemberDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TeamMemberDetail" ADD CONSTRAINT "TeamMemberDetail_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "TeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
