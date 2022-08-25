import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { Dataset } from "../types";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface LineChartProps {
    labels: string[];
    datasets: Dataset[];
}

export default function LineChart(props: LineChartProps) {
    return (
        <>
            <div className="linechart__title">
                {props.datasets[1].label} (Percent Change)
            </div>
            <div className="linechart">
                <Line
                    options={{
                        // responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom" as const,
                                align: "start" as const,
                            },
                        },
                        scales: {
                            yAxes: {
                                grid: { display: false },
                            },
                            xAxes: {
                                grid: { display: false },
                                time: {
                                    tooltipFormat: "ll",
                                },
                            },
                        },
                    }}
                    data={{
                        labels: props.labels,
                        datasets: props.datasets,
                    }}
                />
            </div>
        </>
    );
}
