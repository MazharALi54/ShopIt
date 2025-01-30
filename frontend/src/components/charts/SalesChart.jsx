import React from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function SalesChart({ salesData }) {
    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                text: "Sales & Order Data",
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };

    const labels = salesData?.map((data) => data?.date);

    const data = {
        labels,
        datasets: [
            {
                label: "Sales",
                data: salesData?.map((data) => data?.sales),
                borderColor: "#198753",
                backgroundColor: "rgba(42, 117, 83, 0.5)",
                yAxisID: "y",
            },
            {
                label: "Orders",
                data: salesData?.map((data) => data?.numOrders),
                borderColor: "rgb(220, 52, 69)",
                backgroundColor: "rgba(201, 68, 82, 0.5)",
                yAxisID: "y1",
            },
        ],
    };
    return <Bar options={options} data={data} />;
}