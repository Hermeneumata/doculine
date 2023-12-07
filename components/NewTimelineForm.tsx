"use client";

import { TextInput } from "@tremor/react";
import Label from "@/components/Label";

export default function NewTimelineForm({
  setTimeline,
  timeline,
}: {
  setTimeline: any;
  timeline: any;
}) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-6">
        <Label htmlFor="title">Name</Label>
        <div className="mt-2">
          <TextInput
            id="name"
            name="name"
            value={timeline.title}
            onChange={(e) => setTimeline({ ...timeline, name: e.target.value })}
            placeholder="Name"
          />
        </div>
      </div>
    </div>
  );
}
