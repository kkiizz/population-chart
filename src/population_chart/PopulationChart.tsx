import React, { useContext, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ChartChangeContext, CheckboxCheckerContext, PrefecturesListDataContext } from '../App';
import { PopulationChartData, PrefectureData, PrefecturesPopulationData } from '../types';

import './PopulationChart.scss';


const API_URL_POPULATION = "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear"
const API_KEY = process.env.REACT_APP_API_KEY || ""
const COLOR_LIST = [
  '#FFE4E1', '#708090', '#778899', '#696969', '#000099',
  '#3333ff', '#003366', '#333399', '#00008B', '#191970',
  '#483D8B', '#4B0082', '#0000CD', '#7B68EE', '#4169E1',
  '#6495ED', '#008BBB', '#4682B4', '#1E90FF', '#00BFFF',
  '#009999', '#006633', '#66cc00', '#3399ff', '#5F9EA0',
  '#20B2AA', '#66CDAA', '#00CED1', '#48D1CC', '#99cc00',
  '#00cc66', '#66cc99', '#6B8E23', '#556B2F', '#006400',
  '#228B22', '#2E8B57', '#3CB371', '#32CD32', '#9ACD32',
  '#00cc66', '#669933', '#339966', '#33cc99', '#7FFF00',
  '#6699cc', '#00cc66', '#339966', '#8B008B', '#6A5ACD',
  '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#9370DB',
  '#8FBC8F', '#8B0000', '#8B4513', '#A52A2A', '#B22222',
]


function CreateChartData(
  prefectures_list_data: PrefectureData[],
  population_data: PrefecturesPopulationData
) {
  var pre_data: PopulationChartData = {
    0: { '': 0 },
  }
  var return_Line_list: any = []

  Object.entries(prefectures_list_data).forEach(([_key, prefecture_value]) => {
    //チェックボックスにチェックが入っているものだけを処理
    if (prefecture_value.checked) {
      //Line のリスト生成
      return_Line_list.push(
        <Line
          type="monotone"
          dataKey={prefecture_value.prefName}
          stroke={COLOR_LIST[prefecture_value.prefCode]}
          strokeWidth={4}
          key={prefecture_value.prefCode}
        />
      )

      //Chartの描写につかうデータを生成
      if (prefecture_value.prefName in population_data) {
        Object.entries(population_data[prefecture_value.prefName]).forEach(([_key, population_value]) => {
          if (population_value.year in pre_data) {
            pre_data[population_value.year] = {
              ...pre_data[population_value.year],
              [prefecture_value.prefName]: population_value.value
            }
          } else {
            pre_data = {
              ...pre_data,
              [population_value.year]: {
                [prefecture_value.prefName]: population_value.value,
              }
            }
          }
        })
      }
    }
  })

  const chart_data: any = []
  Object.entries(pre_data).forEach(([key, value]) => {
    if (key !== "0") {
      chart_data.push({
        "year": key,
        ...value
      })
    }
  })

  return [return_Line_list, chart_data]
}





function PopulationChart() {
  const { prefectures_list_data } = useContext(
    PrefecturesListDataContext
  )
  const { checkbox_checker } = useContext(
    CheckboxCheckerContext
  )
  const { chart_change, setChartChange } = useContext(
    ChartChangeContext
  )


  const [population_data, setPopulationData] = useState<PrefecturesPopulationData>({})
  const [Line_list, setLineList] = useState([])
  const [chart_data, setChartData] = useState([])


  useEffect(() => {
    var _population_data = population_data
    if ((checkbox_checker.checked) && ((checkbox_checker.prefName in population_data) === false)) {
      fetch(
        API_URL_POPULATION + encodeURI(`?prefCode=${checkbox_checker.prefCode}&cityCode=-`),
        {
          method: "GET",
          headers: {
            "X-API-KEY": API_KEY,
          }
        }
      )
        .then(res => res.json())
        .then(
          (result) => {
            _population_data = {
              ..._population_data,
              [checkbox_checker.prefName]: result.result.data[0].data
            }
            //prefCodeの総人口をpopulation_dataに保存
            setPopulationData(_population_data)

            //Chartの描写に必要な情報を生成 CreateChartDataに渡すデータは、fetchして変更した値を利用する
            const [Line_list, chart_data] = CreateChartData(prefectures_list_data, _population_data)

            setLineList(Line_list)
            setChartData(chart_data)
            setChartChange(true)
          },
          (error) => {
            console.log(error)
          }
        )
    } else {
      //Chartの描写に必要な情報を生成
      const [Line_list, chart_data] = CreateChartData(prefectures_list_data, _population_data)

      setLineList(Line_list)
      setChartData(chart_data)
      setChartChange(true)
    }
  }, [checkbox_checker])


  return (
    <section>
      <p>人口チャート</p>
      <div className="population-chart-container">
        {(() => {
          if (chart_change) {
            return (
              <ResponsiveContainer>
                <LineChart
                  data={chart_data}
                  margin={{
                    top: 30,
                    right: 60,
                    left: 20,
                    bottom: 40
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="year"
                    label={{
                      value: '年度', position: "right", offset: 20
                    }}
                  />
                  <YAxis
                    label={{
                      value: '人口数', position: 'top', offset: 10
                    }}
                  />
                  <Tooltip
                    viewBox={{ x: 400, y: 0, width: 400, height: 400 }}
                  />
                  <Legend />
                  {Line_list}
                </LineChart>
              </ResponsiveContainer>
            )
          } else {
            return <h1>Loading ...</h1>
          }
        })()}
      </div>
    </section>
  );
}

export default PopulationChart;