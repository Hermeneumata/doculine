/*
  Warnings:

  - You are about to drop the column `downloadLink` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `resourcePath` on the `Timeline` table. All the data in the column will be lost.

*/
BEGIN TRY

BEGIN TRAN;

-- AlterTable
ALTER TABLE [dbo].[Document] DROP COLUMN [downloadLink];
ALTER TABLE [dbo].[Document] ADD [blobName] NVARCHAR(1000) NOT NULL CONSTRAINT [Document_blobName_df] DEFAULT '';

-- AlterTable
ALTER TABLE [dbo].[Timeline] DROP COLUMN [resourcePath];

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
