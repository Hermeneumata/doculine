"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";

export default function DatePicker() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function handleDateRangeChange(dateRange: DateRangePickerValue) {
    const params = new URLSearchParams(window.location.search);
    if (dateRange.from) {
      params.set("startDate", dateRange.from.getTime().toString());
    } else {
      params.delete("startDate");
    }
    if (dateRange.to) {
      params.set("endDate", dateRange.to.getTime().toString());
    } else {
      params.delete("endDate");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <DateRangePicker
        className="max-w-full mx-auto"
        onValueChange={handleDateRangeChange}
      />
    </div>
  );
}
