//PrefecturesList
export type PrefecturesAPIData = {
    prefCode: number,
    prefName: string,
}

export type PrefectureData = {
    prefCode: number,
    prefName: string,
    checked: boolean
}


//PopulationChart
type PopulationData = {
    year: number,
    value: number
}

export type PrefecturesPopulationData = {
    [key: string]: Array<PopulationData>
}

export type PopulationChartData = {
    [key: number]:{[key: string]: number}
}