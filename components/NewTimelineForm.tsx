"use client";

import { TextInput } from "@tremor/react";
import Label from "@/components/Label";
import { NewTimeline } from "@/lib/types";

export default function NewTimelineForm({
  setTimeline,
  timeline,
}: {
  setTimeline: (value: NewTimeline) => void;
  timeline: NewTimeline;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <Label htmlFor="title">Name</Label>
        <div className="mt-2">
          <TextInput
            id="name"
            name="name"
            value={timeline.name}
            onChange={(e) => setTimeline({ ...timeline, name: e.target.value })}
            placeholder="Name"
          />
        </div>
      </div>
      <div className="sm:col-span-6">
        <Label htmlFor="title">Folder Path</Label>
        <div className="mt-2">
          <TextInput
            id="resourcePath"
            name="resourcePath"
            value={timeline.resourcePath}
            onChange={(e) =>
              setTimeline({
                ...timeline,
                resourcePath: e.target.value.endsWith("\\")
                  ? e.target.value
                  : e.target.value + "\\",
              })
            }
            placeholder="Folder path"
          />
        </div>
      </div>
    </div>
  );
}
