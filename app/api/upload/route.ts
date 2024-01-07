import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import Storage from "@/lib/storage";
import path from "path";

export async function POST(
  request: NextRequest
): Promise<NextResponse | Response> {
  const formData = await request.formData();

  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({
      status: 400,
      body: "No file was provided",
    });
  }

  const extension = path.extname(file.name);
  const fileName = path.basename(file.name, extension);
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const blobName = `${fileName}-${uuidv4()}${extension}`;

  try {
    const response = await Storage.uploadFile(blobName, buffer);
    if (response) {
      return NextResponse.json({
        status: 201,
        body: { success: true, blobName },
      });
    } else {
      return NextResponse.json({
        status: 500,
        body: "Error uploading file",
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      body: `Error uploading file: ${error.message}`,
    });
  }
}
