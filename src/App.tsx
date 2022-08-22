import React, { useEffect } from "react";
import { useState } from "react";
import { stateFIPS, countyFIPS } from "./FIPS";
import { LineCode, LineCodeResults } from "./types";
import {
    API,
    parseLineCodes,
    formatLineCodeDesc,
    formatLineCodeData,
} from "./utils";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import LineChart from "./components/LineChart";
import { Paper } from "@mui/material";

function App() {
    const [state, setState] = useState<string>("");
    const [county, setCounty] = useState<string>("");
    const [countyChoices, setCountyChoices] = useState<string[]>([]);
    const [lineCodes, setLineCodes] = useState<LineCode[]>([]);
    const [lineCode, setLineCode] = useState<string>("");
    const [lineCodeResults, setLineCodeResults] = useState<
        LineCodeResults | undefined
    >();
    const [totalResults, setTotalResults] = useState<
        LineCodeResults | undefined
    >();
    useEffect(() => {
        fetch(
            `${API}&method=GetParameterValuesFiltered&datasetname=Regional&TargetParameter=LineCode&TableName=CAEMP25N`
        )
            .then((res) => res.json())
            .then((data) => {
                setLineCodes(parseLineCodes(data.BEAAPI.Results.ParamValue));
            });
    }, []);

    const handleStateChange = (e: SelectChangeEvent) => {
        const selected = e.target.value as string;
        setState(selected);
        setCounty("");
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

    const handleCountyChange = (e: SelectChangeEvent) => {
        const selected = e.target.value as string;
        setCounty(selected);
        // get total employment data for county
        fetch(
            `${API}&method=GetData&datasetname=Regional&TableName=CAEMP25N&LineCode=10&GeoFIPS=${selected}&year=ALL`
        )
            .then((res) => res.json())
            .then((data) => setTotalResults(data.BEAAPI.Results));
    };

    const handleLineCodeChange = (e: SelectChangeEvent) => {
        const selected = e.target.value as string;
        setLineCode(selected);
        fetch(
            `${API}&method=GetData&datasetname=Regional&TableName=CAEMP25N&LineCode=${selected}&GeoFIPS=${county}&year=ALL`
        )
            .then((res) => res.json())
            .then((data) => setLineCodeResults(data.BEAAPI.Results));
    };

    return (
        <div className="App">
            <header>BEA Demo</header>
            <p className="description">
                This application uses the BEA (Bureau of Economic Analysis)
                regional dataset. Selecting a state, county and industry will
                render a chart comparing the growth rates of the selected
                industry and the total employment of the county.
            </p>
            <p className="description">
                Notes: This API is rate limited and extensive usage may result
                time-out period of one hour. If the BEA is missing data, the
                chart is backfilled with the first available year's value.
            </p>
            <div className="content">
                <FormControl sx={{ margin: "10px 0px" }}>
                    <InputLabel id="state-select-label">State</InputLabel>
                    <Select
                        labelId="state-select-label"
                        onChange={handleStateChange}
                        value={state}
                        label="State"
                        id="state-select"
                        autoWidth
                    >
                        {Object.keys(stateFIPS)
                            .sort()
                            .map((k) => (
                                <MenuItem key={k} value={k}>
                                    <div
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {stateFIPS[k]}
                                    </div>
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ marginBottom: "10px" }}
                    disabled={countyChoices.length < 1}
                >
                    <InputLabel id="county-select-label">County</InputLabel>
                    <Select
                        labelId="county-select-label"
                        onChange={handleCountyChange}
                        value={county}
                        label="County"
                        id="county-select"
                        autoWidth
                    >
                        {countyChoices.map((k) => (
                            <MenuItem key={k} value={k}>
                                <div
                                    style={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    {countyFIPS[k]}
                                </div>
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl
                    sx={{ marginBottom: "10px" }}
                    disabled={countyChoices.length < 1}
                >
                    <InputLabel id="linecode-select-label">Industry</InputLabel>
                    <Select
                        labelId="linecode-select-label"
                        onChange={handleLineCodeChange}
                        value={lineCode}
                        label="Industry"
                        id="linecode-select"
                        // autoWidth
                    >
                        {lineCodes.length > 0 &&
                            lineCodes.map((e) => (
                                <MenuItem key={e.Key} value={e.Key}>
                                    <div
                                        style={{
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                        }}
                                    >
                                        {e.Desc}
                                    </div>
                                </MenuItem>
                            ))}
                    </Select>
                </FormControl>
                {lineCodeResults && totalResults && (
                    <Paper elevation={3} sx={{ padding: "10px" }}>
                        <LineChart
                            labels={lineCodeResults.Data.map(
                                (e) => e.TimePeriod
                            )}
                            datasets={[
                                {
                                    label: formatLineCodeDesc(
                                        totalResults.Statistic
                                    ),
                                    data: formatLineCodeData(totalResults.Data),
                                    backgroundColor: [
                                        "rgba(83, 182, 228, 0.2)",
                                    ],
                                    borderColor: ["rgba(83, 182, 228, 1)"],
                                    borderWidth: 3,
                                },
                                {
                                    label: formatLineCodeDesc(
                                        lineCodeResults.Statistic
                                    ),
                                    data: formatLineCodeData(
                                        lineCodeResults.Data
                                    ),
                                    backgroundColor: [
                                        "rgba(244, 181, 75, 0.2)",
                                    ],
                                    borderColor: ["rgba(244, 181, 75, 1)"],
                                    borderWidth: 3,
                                },
                            ]}
                        />
                    </Paper>
                )}
            </div>
        </div>
    );
}

export default App;
