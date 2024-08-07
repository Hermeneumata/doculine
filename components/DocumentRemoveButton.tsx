"use client";

import deleteDocument from "@/lib/deleteDocument";
import RemoveButton from "@/components/RemoveButton";

export default function DocumentRemoveButton({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <RemoveButton
      action={() => {
        deleteDocument(id);
      }}
      title="Confirm Deletion"
      message="Are you sure you want to delete this document? This action cannot be undone."
    >
      {children}
    </RemoveButton>
  );
}
