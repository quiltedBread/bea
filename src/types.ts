export interface Dict {
    [key: string]: string;
}

export interface LineCode {
    Key: string;
    Desc: string;
}

export interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
}

export interface LineCodeResult {
    Code: string;
    GeoFips: string;
    GeoName: string;
    TimePeriod: string;
    CL_UNIT: string;
    UNIT_MULT: string;
    DataValue: string;
}
export interface LineCodeResults {
    Statistic: string;
    UnitOfMeasure: string;
    PublicTable: string;
    NoteRef: string;
    Data: LineCodeResult[];
}
