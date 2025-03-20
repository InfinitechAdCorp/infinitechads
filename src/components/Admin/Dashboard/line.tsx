'use client'

import React, { Component } from "react";
import ApexCharts from "react-apexcharts";

// Define types for props
interface CustomChartProps {
  categories: number[];
  seriesName: string;
  data: number[];
}

// Define types for state
interface CustomChartState {
  options: {
    chart: {
      id: string;
    };
    xaxis: {
      categories: number[];
    };
  };
  series: {
    name: string;
    data: number[];
  }[];
}

class LineChart extends Component<CustomChartProps, CustomChartState> {
  constructor(props: CustomChartProps) {
    super(props);

    // Initialize state with props values or fallback to defaults
    this.state = {
      options: {
        chart: {
          id: "line"
        },
        xaxis: {
          categories: this.props.categories  || [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999],
        }
      },
      series: [
        {
          name: this.props.seriesName || "series-1",
          data: this.props.data || [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    };
  }

  render() {
    return (
      <div className="app">
        <div className="row">
          <div className="mixed-chart">
            <ApexCharts
              options={this.state.options}
              series={this.state.series}
              type="line"
              width="500"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default LineChart;