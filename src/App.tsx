import React, { useEffect } from "react";
import { useState } from "react";
import { stateFIPS, countyFIPS } from "./FIPS";
import { Dict } from "./types";

function App() {
    const [state, setState] = useState<keyof typeof stateFIPS | undefined>();
    const [county, setCounty] = useState<keyof typeof countyFIPS | undefined>();
    const [countyChoices, setCountyChoices] = useState<string[]>([]);

    const handleStateChange = (e: React.SyntheticEvent) => {
        const val = (e.target as HTMLSelectElement).value;
        setState(val);
        setCountyChoices(getStateCounties(val));
    };

    const getStateCounties = (state: keyof typeof stateFIPS) => {
        let counties: string[] = [];
        Object.entries(countyFIPS).forEach(([k, v]) => {
            if (k.slice(0, 2) === state) {
                counties.push(k);
            }
        });
        return counties;
    };

    return (
        <div className="App">
            <select onChange={handleStateChange} value={state}>
                {Object.keys(stateFIPS).map((k) => (
                    <option key={k} value={k}>
                        {stateFIPS[k]}
                    </option>
                ))}
            </select>
            {/* <select
                onChange={(e) => setCounty(e.target.value)}
                value={county}
                placeholder="County"
            >
                {counties.map((k) => (
                    <option key={k} value={k}>
                        {k}
                    </option>
                ))}
            </select> */}
        </div>
    );
}

export default App;
