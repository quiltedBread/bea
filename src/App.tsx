import { useState, useEffect } from "react";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Paper } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import { LineCode, LineCodeResults } from "./types";
import {
    API,
    parseLineCodes,
    formatLineCodeDesc,
    formatLineCodeData,
    stateFIPS,
    countyFIPS,
} from "./utils";
import LineChart from "./components/LineChart";

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
    // TODO toggle chart settings between start year and %/count mode
    // const [chartMode, setChartMode] = useState<string>("");
    // const [chartYear, setChartYear] = useState<string>("");
    const [error, setError] = useState<string>("");

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
        setLineCode("");
        setLineCodeResults(undefined);
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
            .then((data) => {
                if (Object.hasOwn(data.BEAAPI.Results, "Error")) {
                    setError("Results Not Found");
                } else {
                    setTotalResults(data.BEAAPI.Results);
                    setError("");
                }
            });
        if (lineCode) {
            // refetch linecode data
            fetch(
                `${API}&method=GetData&datasetname=Regional&TableName=CAEMP25N&LineCode=${lineCode}&GeoFIPS=${selected}&year=ALL`
            )
                .then((res) => res.json())
                .then((data) => {
                    if (Object.hasOwn(data.BEAAPI.Results, "Error")) {
                        setError("Results Not Found");
                    } else {
                        setLineCodeResults(data.BEAAPI.Results);
                        setError("");
                    }
                });
        }
    };

    const handleLineCodeChange = (e: SelectChangeEvent) => {
        const selected = e.target.value as string;
        setLineCode(selected);
        fetch(
            `${API}&method=GetData&datasetname=Regional&TableName=CAEMP25N&LineCode=${selected}&GeoFIPS=${county}&year=ALL`
        )
            .then((res) => res.json())
            .then((data) => {
                if (Object.hasOwn(data.BEAAPI.Results, "Error")) {
                    setError("Results Not Found");
                } else {
                    setLineCodeResults(data.BEAAPI.Results);
                    setError("");
                }
            });
    };

    return (
        <>
            <header>
                <a href="https://github.com/quiltedBread/bea" target="_blank">
                    <GitHubIcon />
                </a>
            </header>
            <div className="content-wrapper">
                <div className="content">
                    <p>
                        This application uses the BEA (Bureau of Economic
                        Analysis)&nbsp;
                        <a
                            href="https://www.bea.gov/data/employment/employment-county-metro-and-other-areas"
                            target="_blank"
                        >
                            regional dataset
                        </a>
                        . Selecting a state, county and industry will render a
                        chart comparing the selected industry and total
                        employment within the county.
                    </p>
                    <div className="disclaimer">
                        <i>
                            Note: This API is rate limited and extensive use may
                            result in a time-out period of one hour.
                        </i>
                    </div>
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
                        <InputLabel id="linecode-select-label">
                            Industry
                        </InputLabel>
                        <Select
                            labelId="linecode-select-label"
                            onChange={handleLineCodeChange}
                            value={lineCode}
                            label="Industry"
                            id="linecode-select"
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
                    {error.length > 0 && <div className="error">{error}</div>}
                    {lineCodeResults && totalResults && (
                        <Paper
                            elevation={3}
                            sx={{ padding: "10px", margin: "10px 0" }}
                        >
                            <LineChart
                                labels={lineCodeResults.Data.map(
                                    (e) => e.TimePeriod
                                )}
                                datasets={[
                                    {
                                        label: formatLineCodeDesc(
                                            totalResults.Statistic
                                        ),
                                        data: formatLineCodeData(
                                            totalResults.Data
                                        ),
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
        </>
    );
}

export default App;
