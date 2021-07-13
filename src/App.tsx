import React from 'react';
import './App.scss';
import Layout from './Layout/Layout';
import PopulationChart from './population_chart/PopulationChart';
import PrefecturesList from './prefectures_list/PrefecturesList';

function App() {
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