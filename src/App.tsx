import React, { useEffect, useState } from 'react';
import './App.scss';
import Layout from './Layout/Layout';
import PopulationChart from './population_chart/PopulationChart';
import PrefecturesList from './prefectures_list/PrefecturesList';


const API_URL_PREFECTURES = "https://opendata.resas-portal.go.jp/api/v1/prefectures"
const API_KEY = process.env.REACT_APP_API_KEY || ""


function App() {
  const [prefectures_list_data, setPrefecturesListData] = useState()
  
  useEffect(()=>{
    fetch(
      API_URL_PREFECTURES,
      {
        method:"GET",
        headers:{
          "X-API-KEY":API_KEY,
        }
      }
    )
    .then(res=>res.json())
    .then(
      (result)=>{
        setPrefecturesListData(result.result)
        console.log(result)
      },
      (error)=>{
        console.log(error)
      }
    )
  },[])

  return (
    <Layout>
      <div className="container">
        <PrefecturesList />
        <PopulationChart />
      </div>
    </Layout>
  );
}

export default App;