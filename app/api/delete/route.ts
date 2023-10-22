import { del } from "@vercel/blob";

export const runtime = "edge";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const urlToDelete = searchParams.get("url") as string;

  if (!urlToDelete) {
    return new Response("Missing url", { status: 400 });
  }

  const response = await del(urlToDelete);

  return new Response(null, { status: 204 });
}
