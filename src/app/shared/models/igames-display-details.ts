export interface IGameDisplayDetails {
    currentPeriod: number;
    maxPeriod: number;
    minPeriod: number;
    displayPeriods: IPeriodDisplay[];
}

export interface IPeriodDisplay {
    period: number;
    displayPeriod: string;
}