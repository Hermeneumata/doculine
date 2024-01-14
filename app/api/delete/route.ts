import { NextRequest, NextResponse } from "next/server";
import AzureBlobStorage from "@/lib/storage";

export async function POST(
  request: NextRequest
): Promise<NextResponse | Response> {
  if (!AzureBlobStorage) {
    return NextResponse.json({
      status: 500,
      body: "Azure storage configuration is missing",
    });
  }

  const data = await request.formData();

  const blobName: string = data.get("blobName") as string;

  try {
    const result = await AzureBlobStorage.deleteFile(blobName);
    if (!result) {
      return NextResponse.json({
        status: 500,
        body: "Error deleting file",
      });
    }
    return NextResponse.json({
      status: 204,
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: `Error deleting file: ${error.message}`,
    });
  }
}
