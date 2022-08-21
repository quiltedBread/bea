import { LineCode, LineCodeResult } from "./types";

export const API =
    "https://apps.bea.gov/api/data/?UserID=B2E7AD45-4F99-4BF2-8222-D0818042762F";

export function formatLineCodeData(data: LineCodeResult[], percent = true) {
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
    if (percent) {
        const initialValue = formatted[0] > 0 ? formatted[0] : 1;
        return formatted.map((x) => (x / initialValue) * 100 - 100);
    }
    return formatted;
}

// export function parseLineCodes(lineCodes: LineCode[]) {
//     // let parsed: LineCode[] = [];
//     lineCodes.forEach((x) => {
//         const raw = x.Desc;
//         x.Desc = raw
//             .replace("[CAEMP25N] ", "")
//             .replace("Private nonfarm employment: ", "")
//             .replaceAll(/\(.*?\)/g, "")
//             .trim();
//     });
//     return lineCodes;
// }

export function parseLineCodes(lineCodes: LineCode[]) {
    lineCodes.forEach((x) => {
        x.Desc = formatLineCodeDesc(x.Desc);
    });
    return lineCodes;
}

export function formatLineCodeDesc(desc: string) {
    return desc
        .replace("[CAEMP25N] ", "")
        .replace("Private nonfarm employment: ", "")
        .replaceAll(/\(.*?\)/g, "")
        .trim();
}
