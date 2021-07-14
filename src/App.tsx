import React, { createContext, useEffect, useState } from 'react';
import './App.scss';
import Layout from './Layout/Layout';
import PopulationChart from './population_chart/PopulationChart';
import PrefecturesList from './prefectures_list/PrefecturesList';
import { PrefecturesAPIData, PrefecturesData } from './types';


const API_URL_PREFECTURES = "https://opendata.resas-portal.go.jp/api/v1/prefectures"
const API_KEY = process.env.REACT_APP_API_KEY || ""


export const PrefecturesListDataContext = createContext(
  {} as {
    prefectures_list_data: Array<PrefecturesData>,
    setPrefecturesListData: React.Dispatch<React.SetStateAction<PrefecturesData[]>>
  }
)

//APIからデータを受け取り、useContextを使って子供コンポーネントに受け渡すProvider
function AppProvider(props: { children: React.ReactNode }) {
  const [prefectures_list_data, setPrefecturesListData] = useState<Array<PrefecturesData>>([])

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
          const _prefectures_list_data = result.result.map((item: PrefecturesAPIData) => {
            return { checked: false, ...item }
          })
          setPrefecturesListData(_prefectures_list_data)
        },
        (error) => {
          console.log(error)
        }
      )
  }, [])


  return (
    <PrefecturesListDataContext.Provider value={{ prefectures_list_data, setPrefecturesListData }}>
      {props.children}
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