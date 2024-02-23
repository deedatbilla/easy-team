import { DailyCommissions } from "@/interfaces";
import { Page, LegacyCard, DataTable } from "@shopify/polaris";
import React, { useEffect, useMemo, useState } from "react";

export default function DailyCommissionsTable({
  dailyCommissions,
}: {
  dailyCommissions: DailyCommissions[];
}) {
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const computedRowsData = useMemo(() => {
    return dailyCommissions.map((dailyCommission) => {
      const ordersCount = dailyCommission.orders.length;
      

      return [dailyCommission.day, ordersCount, 1000];
    });
  }, [dailyCommissions]);
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const handlePrevious = () => {
    if (offset > 1) {
      const newOffset = offset - 10;
      const newLimit = limit - 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };

  useEffect(() => {
    const displayedData = computedRowsData.slice(offset, limit);
    setDisplayedData(displayedData);
  }, [limit, offset]);

  const handleNext = () => {
    // console.log({ offset, totalPages });
    if (limit < computedRowsData.length) {
      const newOffset = offset + 10;
      const newLimit = limit + 10;
      setOffset(newOffset);
      setLimit(newLimit);
    }
  };

  return (
    <Page title="Daily commissions">
      <LegacyCard>
        <DataTable
          columnContentTypes={["text", "numeric", "numeric"]}
          headings={["Day", "Total Orders", "Total commissions"]}
          rows={displayedData}
          pagination={{
            hasNext: true,
            hasPrevious: true,
            onNext: () => {
              handleNext();
            },
            onPrevious: () => {
              handlePrevious();
            },
          }}
          //   totals={["", "", "", 255, "$155,830.00"]}
        />
      </LegacyCard>
    </Page>
  );
}
