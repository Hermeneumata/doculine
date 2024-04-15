import { Title, Text } from "@tremor/react";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Badge } from "@tremor/react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import RemoveTagButton from "@/components/RemoveTagButton";
import getProjectTags from "@/lib/getProjectTags";
import Link from "next/link";

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

  const projects = await prisma.timeline.findMany({});

  const tagsByProject = await Promise.all(
    projects.map(async (project) => ({
      id: project.id,
      name: project.name,
      tags: await getProjectTags(project.id),
    }))
  );

  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <Title>Tags</Title>
          <Text>Here&apos;s a list of all tags</Text>
        </div>
      </div>
      <ul className="mt-4 flex flex-col gap-4">
        {tagsByProject.map((project) => {
          return (
            <li key={project.id}>
              <h2 className="text-lg">{project.name}</h2>
              <div className="flex flex-wrap gap-2 my-2">
                {project.tags
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((tag) => (
                    <Badge key={tag.id}>
                      <span className="flex gap-1 items-center group">
                        <Link href={`/projects/${project.id}?tags=${tag.id}`}>
                          {tag.name}
                        </Link>
                        <RemoveTagButton id={tag.id}>
                          <XCircleIcon className="h-4 w-4" />
                        </RemoveTagButton>
                      </span>
                    </Badge>
                  ))}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
