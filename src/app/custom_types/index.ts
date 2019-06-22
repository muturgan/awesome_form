export interface IOneNestedLevelJson {
    [key: string]: string | number | boolean | null | undefined;
}

export interface IServerResponce {
    method: string;
    type: string;
    data: {[key: string]: string} | [];
}

export interface IModatInfoPayload {
    text: string;
    time: number;
    code: number;
    res: IServerResponce | null;
}
