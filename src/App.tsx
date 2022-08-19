import { useState } from "react";
import { stateFIPS, countyFIPS } from "./FIPS";

function App() {
    const [counties, setCounties] = useState({});

    const getCountySubSet = (state: string) => {
        let subSet: { [key: string]: string } = {};
        Object.entries(countyFIPS).forEach(([k, v]) => {
            if (v.slice(0, 2) === state) {
                subSet[k] = v;
            }
        });
    };

    return (
        <div className="App">
            <select onChange={(e) => getCountySubSet(e.target.value)}>
                {Object.entries(stateFIPS).map(([k, v]) => (
                    <option key={k} value={v}>
                        {k}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default App;
