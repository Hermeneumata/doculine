import { PlusIcon } from "@heroicons/react/20/solid";
import { Title, Text } from "@tremor/react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import Projects from "@/components/Projects";
import TimelineSlideOver from "@/components/TimelineSlideOver";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: { q: string; startDate: string; endDate: string };
}) {
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
  const timelines = await prisma.timeline.findMany({
    include: {
      owner: true,
      documents: {
        include: {
          createdBy: true,
        },
      },
    },
  });

  return (
    <>
      <TimelineSlideOver title="Add new project" user={user} />

      <div className="flex justify-between items-center">
        <div>
          <Title>Projects</Title>
          <Text>Here&apos;s a list of available projects</Text>
        </div>
        <Link
          href={`/?${new URLSearchParams({
            ...searchParams,
            slideOver: "true",
          }).toString()}`}
          className="rounded-md items-center flex bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          <PlusIcon className="block h-6 w-6" aria-hidden="true" />
          New Project
        </Link>
      </div>

      <Projects timelines={timelines} user={user} />
    </>
  );
}
