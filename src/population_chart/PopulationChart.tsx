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
import { CheckboxCheckerContext, PrefecturesListDataContext } from '../App';
import { PopulationChartData, PrefectureData, PrefecturesPopulationData } from '../types';

import './PopulationChart.scss';


const API_URL_POPULATION = "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear"
const API_KEY = process.env.REACT_APP_API_KEY || ""
const COLOR_LIST = [
  '#FFE4E1', '#708090', '#778899', '#696969', '#000099',
  '#000066', '#87CEFA', '#B0C4DE', '#00008B', '#191970',
  '#483D8B', '#4B0082', '#0000CD', '#7B68EE', '#4169E1',
  '#6495ED', '#008BBB', '#4682B4', '#1E90FF', '#00BFFF',
  '#22FFFF', '#002200', '#ADD8E6', '#00FFFF', '#5F9EA0',
  '#20B2AA', '#66CDAA', '#00CED1', '#48D1CC', '#550000',
  '#B0E0E6', '#AFEEEE', '#6B8E23', '#556B2F', '#006400',
  '#228B22', '#2E8B57', '#3CB371', '#32CD32', '#9ACD32',
  '#7FFFD4', '#00FA9A', '#00FF7F', '#7CFC00', '#7FFF00',
  '#ADFF2F', '#90EE90', '#98FB98', '#8B008B', '#6A5ACD',
  '#8A2BE2', '#9400D3', '#9932CC', '#BA55D3', '#9370DB',
  '#8FBC8F', '#8B0000', '#8B4513', '#A52A2A', '#B22222',
  '#A0522D', '#CD5C5C', '#D2691E', '#BDB76B', '#DC143C',
  '#FF1493', '#FF69B4', '#FF00FF', '#DA70D6', '#EE82EE',
  '#DDA0DD', '#D8BfD8', '#BC8F8F', '#C71585', '#DB7093',
  '#E9967A', '#F08080', '#FFA07A', '#FFB6C1', '#FFC0CB',
  '#FF4500', '#FF6347', '#FF4F50', '#FA8072', '#FF8C00',
  '#FFA500', '#F4A460', '#E6E6FA', '#B8860B', '#CD853F',
  '#DAA520', '#D2B48C', '#DEB887', '#FFD700',
]


function CreateChartData(
  prefectures_list_data: PrefectureData[],
  population_data: PrefecturesPopulationData
) {
  var pre_data: PopulationChartData = {
    0: { '': 0 },
  }
  var return_Line_list: any = []

  Object.entries(prefectures_list_data).forEach(([key, prefecture_value]) => {
    if (prefecture_value.checked) {
      //Line のリスト生成　strokeの色を変えないと、同じ色のものが生成される　要変更
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
        Object.entries(population_data[prefecture_value.prefName]).forEach(([key, population_value]) => {
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
          },
          (error) => {
            console.log(error)
          }
        )
    }

  }, [checkbox_checker])


  useEffect(() => {
    const [Line_list, chart_data] = CreateChartData(prefectures_list_data, population_data)

    setLineList(Line_list)
    setChartData(chart_data)
  }, [checkbox_checker, population_data])


  return (
    <section className="population-chart-container">
      <p>人口チャート</p>
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
    </section>
  );
}

export default PopulationChart;