import React, { useEffect } from "react";
import { useState } from "react";
import { stateFIPS, countyFIPS } from "./FIPS";
import { LineCode, LineCodeResults } from "./types";

import LineChart from "./components/LineChart";

const API =
    "https://apps.bea.gov/api/data/?UserID=B2E7AD45-4F99-4BF2-8222-D0818042762F";

function App() {
    const [state, setState] = useState<keyof typeof stateFIPS | undefined>();
    const [county, setCounty] = useState<keyof typeof countyFIPS | undefined>();
    const [countyChoices, setCountyChoices] = useState<string[]>([]);
    const [lineCodes, setLineCodes] = useState<LineCode[]>([]);
    const [lineCode, setLineCode] = useState<string | undefined>();
    const [lineCodeData, setLineCodeData] = useState<
        LineCodeResults | undefined
    >();
    console.log(lineCodeData);

    useEffect(() => {
        fetch(
            `${API}&method=GetParameterValuesFiltered&datasetname=Regional&TargetParameter=LineCode&TableName=CAEMP25N`
        )
            .then((res) => res.json())
            .then((data) => {
                setLineCodes(data.BEAAPI.Results.ParamValue);
            });
    }, []);

    const handleStateChange = (e: React.SyntheticEvent) => {
        const selected = (e.target as HTMLSelectElement).value;
        setState(selected);
        setCountyChoices(getStateCounties(selected));
    };

    const getStateCounties = (state: keyof typeof stateFIPS) => {
        let counties: string[] = [];
        Object.keys(countyFIPS).forEach((k) => {
            // first 2 digits of countyFIPS = stateFIPS
            // countyFIPS ending in "000" are stateFIPS
            if (k.slice(0, 2) === state && k.slice(-3) !== "000") {
                counties.push(k);
            }
        });
        return counties;
    };

    const handleLineCodeChange = (e: React.SyntheticEvent) => {
        const selected = (e.target as HTMLSelectElement).value;
        setLineCode(selected);
        fetch(
            `${API}&method=GetData&datasetname=Regional&TableName=CAEMP25N&LineCode=${selected}&GeoFIPS=${county}&year=ALL`
        )
            .then((res) => res.json())
            .then((data) => setLineCodeData(data.BEAAPI.Results));
    };

    return (
        <div className="App">
            <select onChange={handleStateChange} value={state}>
                {Object.keys(stateFIPS)
                    .sort()
                    .map((k) => (
                        <option key={k} value={k}>
                            {stateFIPS[k]}
                        </option>
                    ))}
            </select>
            <select
                onChange={(e) => setCounty(e.target.value)}
                value={county}
                placeholder="County"
            >
                {countyChoices.map((k) => (
                    <option key={k} value={k}>
                        {countyFIPS[k]}
                    </option>
                ))}
            </select>
            <select
                onChange={handleLineCodeChange}
                value={county}
                placeholder="County"
            >
                {lineCodes.length > 0 &&
                    lineCodes.map((e) => (
                        <option key={e.Key} value={e.Key}>
                            {e.Desc}
                        </option>
                    ))}
            </select>
            {lineCodeData && (
                <LineChart
                    labels={lineCodeData.Data.map((e) => e.TimePeriod)}
                    datasets={[
                        {
                            label: lineCodeData.Statistic,
                            data: lineCodeData.Data.map((e) => e.DataValue),
                            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                            borderColor: ["rgba(255, 99, 132, 1)"],
                            borderWidth: 1,
                        },
                    ]}
                />
            )}
        </div>
    );
}

export default App;
