"use client";

import { useState } from "react";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";

export default function DatePicker() {
  const [value, setValue] = useState<DateRangePickerValue>({
    from: new Date(2023, 1, 1),
    to: new Date(),
  });

  return (
    <div>
      <DateRangePicker
        className="max-w-full mx-auto"
        value={value}
        onValueChange={setValue}
        color="rose"
      />
    </div>
  );
}
