import { NextRequest, NextResponse } from "next/server";
import Storage from "@/lib/storage";
import mime from "mime";

async function streamToBuffer(stream: any) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function GET(
  request: NextRequest
): Promise<NextResponse | Response> {
  const { searchParams } = new URL(request.url);
  const blobName = searchParams.get("fileName");

  if (!blobName) {
    return NextResponse.json({
      status: 400,
      body: "No blobName was provided",
    });
  }

  try {
    const streamBody = await Storage.downloadBlob(blobName);
    const fileBuffer = await streamToBuffer(streamBody);
    const contentType = mime.getType(blobName) || "application/octet-stream";

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${blobName}"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: `Error downloading blob: ${error.message}`,
    });
  }
}
