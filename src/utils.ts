import { LineCodeResult } from "./types";

export function formatLineCodeData(data: LineCodeResult[]) {
    let formatted: number[] = [];
    for (let i = 0; i < data.length; i++) {
        const value = parseFloat(data[i].DataValue.replace(",", ""));
        if (isNaN(value)) {
            if (i === 0) {
                formatted.push(0);
            } else {
                formatted.push(formatted[formatted.length - 1]);
            }
        } else {
            formatted.push(value);
        }
    }
    return formatted;
}
