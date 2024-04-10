import { NextRequest, NextResponse } from "next/server";
import Storage from "@/lib/storage";

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

  console.info("blobName", blobName);
  try {
    const streamBody = await Storage.downloadBlob(blobName);

    console.info("streamBody", streamBody);
    const fileBuffer = await streamToBuffer(streamBody);

    return new Response(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
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
