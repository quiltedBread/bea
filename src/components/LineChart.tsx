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
        <div style={{ width: "70vw" }}>
            <Line
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: "top" as const,
                        },
                    },
                }}
                data={{
                    labels: props.labels,
                    datasets: props.datasets,
                }}
            />
        </div>
    );
}
