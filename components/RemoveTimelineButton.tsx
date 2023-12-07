"use client";

import RemoveButton from "@/components/RemoveButton";
import deleteTimeline from "@/lib/deleteTimeline";

export default function RemoveTimelineButton({ id }: { id: string }) {
  return (
    <RemoveButton
      action={() => {
        deleteTimeline(id);
      }}
      title="Confirm Deletion"
      message="Are you sure you want to delete this timeline? This action will also delete all associated documents and cannot be undone."
    />
  );
}
