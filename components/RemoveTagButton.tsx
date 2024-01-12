"use client";

import RemoveButton from "@/components/RemoveButton";
import deleteTag from "@/lib/deleteTag";

export default function RemoveTimelineButton({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <RemoveButton
      action={() => {
        deleteTag(id);
      }}
      title="Confirm Deletion"
      message="Are you sure you want to delete this tag? Be aware that this will also remove the tag from all associated documents."
    >
      {children}
    </RemoveButton>
  );
}
