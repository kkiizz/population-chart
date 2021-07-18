import React, { createContext, useEffect, useState } from 'react';
import './App.scss';
import Layout from './Layout/Layout';
import PopulationChart from './population_chart/PopulationChart';
import PrefecturesList from './prefectures_list/PrefecturesList';
import { PrefectureData, PrefecturesAPIData } from './types';


const API_URL_PREFECTURES = "https://opendata.resas-portal.go.jp/api/v1/prefectures"
const API_KEY = process.env.REACT_APP_API_KEY || ""


//Prefectures List Data
export const PrefecturesListDataContext = createContext(
  {} as {
    prefectures_list_data: Array<PrefectureData>,
    setPrefecturesListData: React.Dispatch<React.SetStateAction<PrefectureData[]>>
  }
)

//都道府県リストのチェックボックスの変更を受け取る(prefName)
export const CheckboxCheckerContext = createContext(
  {} as {
    checkbox_checker: PrefectureData,
    setCheckboxChecker: React.Dispatch<React.SetStateAction<PrefectureData>>
  }
)

//Chartの再描写を制御　fetchが終わって、準備ができたら描写
export const ChartChangeContext = createContext(
  {} as {
    chart_change: boolean,
    setChartChange: React.Dispatch<React.SetStateAction<boolean>>
  }
)


//Provider : 都道府県リスト、チェックボックスの変更データ
function AppProvider(props: { children: React.ReactNode }) {
  const [prefectures_list_data, setPrefecturesListData] = useState<Array<PrefectureData>>([])
  const [checkbox_checker, setCheckboxChecker] = useState<PrefectureData>({
    prefCode: 1,
    prefName: "北海道",
    checked: false,
  })
  const [chart_change, setChartChange] = useState<boolean>(true)

  //都道府県リストのデータをAPIから受け取る
  useEffect(() => {
    fetch(
      API_URL_PREFECTURES,
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
          const _prefectures_list_data = result.result.map((value: PrefecturesAPIData) => {
            return ({
              ...value,
              checked: false
            })
          })
          setPrefecturesListData(_prefectures_list_data)
        },
        (error) => {
          window.alert("通信エラー")
          console.log(error)
        }
      )
  }, [])


  return (
    <PrefecturesListDataContext.Provider value={{ prefectures_list_data, setPrefecturesListData }}>
      <CheckboxCheckerContext.Provider value={{ checkbox_checker, setCheckboxChecker }}>
        <ChartChangeContext.Provider value={{ chart_change, setChartChange }}>
          {props.children}
        </ChartChangeContext.Provider>
      </CheckboxCheckerContext.Provider>
    </PrefecturesListDataContext.Provider>
  )
}

function App() {
  return (
    <Layout>
      <AppProvider>
        <div className="container">
          <PrefecturesList />
          <PopulationChart />
        </div>
      </AppProvider>
    </Layout>
  );
}

export default App;