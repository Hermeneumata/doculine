import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  ContainerClient,
  generateBlobSASQueryParameters,
  BlobSASSignatureValues,
  SASProtocol,
  BlobSASPermissions,
} from "@azure/storage-blob";

const storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME;
const storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY;
const blobContainerName = process.env.AZURE_BLOB_CONTAINER_NAME;

class AzureBlobStorage {
  private static instance: AzureBlobStorage;
  private blobServiceClient: BlobServiceClient;
  private containerClient: ContainerClient;

  private constructor() {
    if (!storageAccountName || !storageAccountKey || !blobContainerName) {
      throw new Error("Azure storage configuration is missing");
    }

    this.blobServiceClient = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net`,
      new StorageSharedKeyCredential(storageAccountName, storageAccountKey)
    );
    this.containerClient =
      this.blobServiceClient.getContainerClient(blobContainerName);
  }

  public static getInstance(): AzureBlobStorage {
    if (!AzureBlobStorage.instance) {
      AzureBlobStorage.instance = new AzureBlobStorage();
    }
    return AzureBlobStorage.instance;
  }

  public async uploadFile(blobName: string, content: Buffer): Promise<boolean> {
    try {
      const blockBlobClient = this.containerClient.getBlockBlobClient(blobName);
      const uploadResponse = await blockBlobClient.upload(
        content,
        content.byteLength
      );
      return (
        Boolean(uploadResponse.requestId) &&
        uploadResponse._response.status === 201
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }

  public async deleteFile(blobName: string): Promise<boolean> {
    try {
      const blobClient = this.containerClient.getBlockBlobClient(blobName);
      const deleteResponse = await blobClient.deleteIfExists();
      return deleteResponse.succeeded;
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }

  public generateBlobSasUrl(blobName: string): string {
    if (!storageAccountName || !storageAccountKey || !blobContainerName) {
      throw new Error("Azure storage configuration is missing");
    }

    const sharedKeyCredential = new StorageSharedKeyCredential(
      storageAccountName,
      storageAccountKey
    );

    const sasOptions: BlobSASSignatureValues = {
      containerName: blobContainerName,
      blobName: blobName,
      permissions: BlobSASPermissions.parse("r"),
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 30 * 1000), // 30 seconds from now
      protocol: SASProtocol.Https,
    };

    const sasToken = generateBlobSASQueryParameters(
      sasOptions,
      sharedKeyCredential
    ).toString();

    return `https://${storageAccountName}.blob.core.windows.net/${blobContainerName}/${blobName}?${sasToken}`;
  }

  public async downloadBlob(blobName: string) {
    const blobClient = this.containerClient.getBlockBlobClient(blobName);
    const downloadResponse = await blobClient.download();
    return downloadResponse.readableStreamBody;
  }
}

export default AzureBlobStorage.getInstance();
