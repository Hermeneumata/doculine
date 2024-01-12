BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Collection] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [ownerId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Collection_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[_TaggedIn] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_TaggedIn_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateTable
CREATE TABLE [dbo].[_CollectedIn] (
    [A] NVARCHAR(1000) NOT NULL,
    [B] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [_CollectedIn_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_TaggedIn_B_index] ON [dbo].[_TaggedIn]([B]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_CollectedIn_B_index] ON [dbo].[_CollectedIn]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[_TaggedIn] ADD CONSTRAINT [_TaggedIn_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Document]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_TaggedIn] ADD CONSTRAINT [_TaggedIn_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CollectedIn] ADD CONSTRAINT [_CollectedIn_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Collection]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_CollectedIn] ADD CONSTRAINT [_CollectedIn_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Document]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
