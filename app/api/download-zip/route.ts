import { NextRequest, NextResponse } from "next/server";
import Storage from "@/lib/storage";
import JSZip from "jszip";

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
  const blobNames = searchParams.get("fileNames");

  if (!blobNames) {
    return new Response(
      JSON.stringify({
        status: 400,
        body: "No fileNames were provided",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  const filesToZip = blobNames.split(",");

  try {
    const zip = new JSZip();

    for (const blobName of filesToZip) {
      const streamBody = await Storage.downloadBlob(blobName);
      const fileBuffer = await streamToBuffer(streamBody);
      zip.file(blobName, fileBuffer);
    }

    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="download.zip"`,
      },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        status: 500,
        body: `Error creating zip file: ${error.message}`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
