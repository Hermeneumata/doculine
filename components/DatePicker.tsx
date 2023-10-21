"use client";

import { useState, useEffect, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DateRangePicker, DateRangePickerValue } from "@tremor/react";

export default function DatePicker() {
  const { replace } = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState<DateRangePickerValue>({
    from: undefined,
    to: undefined,
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const startDate = params.get("startDate");
    const endDate = params.get("endDate");
    if (startDate && endDate) {
      setValue({
        from: new Date(Number(startDate)),
        to: new Date(Number(endDate)),
      });
    }
  }, []);

  function handleDateRangeChange(dateRange: DateRangePickerValue) {
    const params = new URLSearchParams(window.location.search);
    if (dateRange.from && dateRange.to) {
      params.set("startDate", dateRange.from.getTime().toString());
      params.set("endDate", dateRange.to.getTime().toString());
    } else {
      params.delete("startDate");
      params.delete("endDate");
    }

    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }

  return (
    <div className="relative">
      <DateRangePicker
        value={value}
        className="max-w-full mx-auto"
        onValueChange={(e) => {
          handleDateRangeChange(e);
          setValue(e);
        }}
      />
    </div>
  );
}
