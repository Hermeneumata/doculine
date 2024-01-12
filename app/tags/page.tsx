import { Title, Text } from "@tremor/react";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import getTags from "@/lib/getTags";
import { Badge } from "@tremor/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { TrashIcon } from "@heroicons/react/24/outline";
import RemoveTagButton from "@/components/RemoveTagButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession();
  if (!session || !session?.user || !session?.user?.email) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session?.user?.email,
    },
  });
  if (!user) {
    return notFound();
  }
  const tags = await getTags();

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Title>Tags</Title>
          <Text>Here&apos;s a list of all tags</Text>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 my-2">
        {tags
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((tag) => (
            <Badge key={tag.id}>
              <span className="flex gap-1 items-center group">
                <span>{tag.name}</span>
                <RemoveTagButton id={tag.id}>
                  <XCircleIcon className="h-4 w-4" />
                </RemoveTagButton>
              </span>
            </Badge>
          ))}
      </div>
    </>
  );
}
