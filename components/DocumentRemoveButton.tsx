"use client";

import deleteDocument from "@/lib/deleteDocument";
import RemoveButton from "@/components/RemoveButton";

export default function DocumentRemoveButton({ id }: { id: string }) {
  return (
    <RemoveButton
      action={() => {
        deleteDocument(id);
      }}
      title="Confirm Deletion"
      message="Are you sure you want to delete this document? This action cannot be undone."
    />
  );
}
