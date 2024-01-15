import { NextRequest, NextResponse } from "next/server";
import Storage from "@/lib/storage";

export async function GET(
  request: NextRequest
): Promise<NextResponse | Response> {
  const { searchParams } = new URL(request.url);
  const blobName = searchParams.get("blobName");

  if (!blobName) {
    return NextResponse.json({
      status: 400,
      body: "No blobName was provided",
    });
  }

  try {
    const blobSasUrl = await Storage.generateBlobSasUrl(blobName);
    if (blobSasUrl) {
      return NextResponse.json({
        status: 200,
        url: blobSasUrl,
      });
    } else {
      return NextResponse.json({
        status: 500,
        body: "Error generating blob SAS URL",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: `Error generating blob SAS URL: ${error.message}`,
    });
  }
}
