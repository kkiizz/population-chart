import React, { useContext, useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { CheckboxCheckerContext, PrefecturesListDataContext } from '../App';
import { PopulationChartData, PrefectureData, PrefecturesPopulationData } from '../types';

import './PopulationChart.scss';


//適当なデータを生成して出力させてみる 後で変更
const data = [
  {
    "name": "Page A",
    "uv": 4000,
    "pv": 2400,
    "amt": 2400
  },
  {
    "name": "Page B",
    "uv": 3000,
    "pv": 1398,
    "amt": 2210
  },
  {
    "name": "Page C",
    "uv": 2000,
    "pv": 9800,
    "amt": 2290
  },
  {
    "name": "Page D",
    "uv": 2780,
    "pv": 3908,
    "amt": 2000
  },
  {
    "name": "Page E",
    "uv": 1890,
    "pv": 4800,
    "amt": 2181
  },
  {
    "name": "Page F",
    "uv": 2390,
    "pv": 3800,
    "amt": 2500
  },
  {
    "name": "Page G",
    "uv": 3490,
    "pv": 4300,
    "amt": 2100
  }
]

const API_URL_POPULATION = "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear"
const API_KEY = process.env.REACT_APP_API_KEY || ""



function CreateChartData(
  prefectures_list_data: PrefectureData[],
  population_data: PrefecturesPopulationData
) {
  var pre_data: PopulationChartData = {
    0: { '': 0 },
  }
  var return_Line_list: any = []

  prefectures_list_data.map((prefecture_value) => {
    if (prefecture_value.checked) {
      //Line のリスト生成　strokeの色を変えないと、同じ色のものが生成される　要変更
      return_Line_list.push(
        <Line
          type="monotone"
          dataKey={prefecture_value.prefName}
          stroke="#82ca9d"
          key={prefecture_value.prefCode}
        />
      )

      //Chartの描写につかうデータを生成
      if (prefecture_value.prefName in population_data) {
        population_data[prefecture_value.prefName].map((population_value) => {
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
    if (key != "0") {
      chart_data.push({
        "year": key,
        ...value
      })
    }
  })

  return [return_Line_list, chart_data]
}






//適当なデータを挿入して、チャートを表示させている　後で変更
function PopulationChart() {
  const { prefectures_list_data, setPrefecturesListData } = useContext(
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
    if ((checkbox_checker.checked) && ((checkbox_checker.prefName in population_data) == false)) {
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


  useEffect(()=>{
    const [Line_list, chart_data] = CreateChartData(prefectures_list_data, population_data)
    
    setLineList(Line_list)
    setChartData(chart_data)
  },[population_data])


  return (
    <section className="population-chart-container">
      <p>人口チャート</p>
      <ResponsiveContainer>
        <LineChart
          data={chart_data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 40
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Line_list}
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}

export default PopulationChart;