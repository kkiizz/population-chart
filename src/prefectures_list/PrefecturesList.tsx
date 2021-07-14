import React, { useContext } from 'react';
import { PrefecturesData } from '../types';
import './PrefecturesList.scss';
import {PrefecturesListDataContext} from '../App';

function PrefecturesList() {
  const {prefectures_list_data, setPrefecturesListData}=useContext(
    PrefecturesListDataContext
  )

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value)
    var _prefectures_list_data = prefectures_list_data
    _prefectures_list_data[index] = {
      ..._prefectures_list_data[index],
      checked:event.target.checked
    }
    
    setPrefecturesListData(
      _prefectures_list_data
    )
  }

  return (
    <section className="prefecture-list-container">
      <p>都道府県を選択</p>
      <ul className="prefecture-list">
        {(() => {
          const checkbox_list = prefectures_list_data.map((value,index) => {
            return (
              <li key={index}>
                <input
                  type="checkbox"
                  name={value.prefName}
                  value={index}
                  onChange={(event) => handleCheckboxChange(event)}
                />
                <label htmlFor={value.prefName}>{value.prefName}</label>
              </li>
            )
          })

          return checkbox_list
        })()}
      </ul>
    </section>
  );
}

export default PrefecturesList;

function PrefecturesListDataProvider(PrefecturesListDataProvider: any): { prefectures_list_data: any; setPrefecturesListData: any; } {
  throw new Error('Function not implemented.');
}
