'use client';

import Summarizedata from "@/components/Admin/Dashboard/summarize";
import React from "react";
// import dynamic from "next/dynamic";

// const CustomChart = dynamic(() => import("@/components/Admin/Dashboard/bar"));
// const LineChart = dynamic(() => import("@/components/Admin/Dashboard/line"));
// const AreaChart = dynamic(() => import("@/components/Admin/Dashboard/area"));

const Chart = () => {
  return (
    <div className="mx-64 my-24 space-y-8">
      <Summarizedata />

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="p-4 mx-5">
          <CustomChart
            categories={[2000, 2001, 2002, 2003, 2004, 2005]}
            seriesName="My Series"
            data={[10, 20, 30, 40, 50, 60]}
          />
        </div>
        <div className="p-4 mx-5">
          <AreaChart
            categories={[2000, 2001, 2002, 2003, 2004, 2005]}
            seriesName="My Series"
            data={[10, 20, 30, 40, 50, 60]}
          />
        </div>
        <div className="p-4 mx-5">
          <LineChart
            categories={[2000, 2001, 2002, 2003, 2004, 2005]}
            seriesName="My Series"
            data={[10, 20, 30, 40, 50, 60]}
          />
        </div>
      </div> */}
    </div>
  );
};

export default Chart;
