import { NextRequest, NextResponse } from "next/server";
import Storage from "@/lib/storage";

export async function POST(
  request: NextRequest
): Promise<NextResponse | Response> {
  const data = await request.formData();

  const blobName: string = data.get("blobName") as string;

  try {
    const deleteResponse = await Storage.deleteFile(blobName);
    // TODO
    console.info("Delete response:", deleteResponse);
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
