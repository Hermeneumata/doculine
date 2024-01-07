import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@tremor/react";
import RemoveTimelineButton from "@/components/RemoveTimelineButton";
import { FolderOpenIcon, PencilIcon } from "@heroicons/react/24/outline";

import Link from "next/link";

import { Timeline } from "@/lib/types";
import { User } from "@prisma/client";

export default function Projects({
  timelines,
  user,
  searchParams,
}: {
  timelines: Timeline[];
  user: User;
  searchParams: { q: string; startDate: string; endDate: string };
}) {
  if (!timelines.length) {
    return (
      <div className="flex items-center justify-center p-10">
        <p className="text-gray-500">No projects found.</p>
      </div>
    );
  }

  return (
    <Table className="mt-6">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Project Manager</TableHeaderCell>
          <TableHeaderCell>Document Count</TableHeaderCell>
          <TableHeaderCell>Actions</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {timelines.map(({ id, name, owner, documents }) => (
          <TableRow key={id}>
            <TableCell>
              <Link
                href={`/projects/${id}`}
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                {name}
              </Link>
            </TableCell>
            <TableCell>
              <Link
                href={`mailto:${owner.email}`}
                className="text-blue-500 hover:text-blue-400 hover:underline"
              >
                {owner.name}
              </Link>
            </TableCell>
            <TableCell>{documents.length}</TableCell>
            <TableCell>
              <div className="flex items-center gap-4">
                <Link
                  href={`/projects/${id}`}
                  className="text-blue-500 hover:text-blue-400 hover:underline"
                >
                  <span className="sr-only">View</span>
                  <FolderOpenIcon className="w-5 h-5 text-gray-500 hover:text-blue-500" />
                </Link>
                <Link
                  href={`/?${new URLSearchParams({
                    ...searchParams,
                    slideOver: "true",
                    id,
                  }).toString()}`}
                  className="text-blue-500 hover:text-blue-400 hover:underline"
                >
                  <span className="sr-only">Edit</span>
                  <PencilIcon className="w-5 h-5 text-gray-500 hover:text-yellow-500" />
                </Link>
                {owner.id === user.id && <RemoveTimelineButton id={id} />}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
