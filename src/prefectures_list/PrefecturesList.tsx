import React, { useContext } from 'react';
import './PrefecturesList.scss';
import { ChartChangeContext, CheckboxCheckerContext, PrefecturesListDataContext } from '../App';

function PrefecturesList() {
  const { prefectures_list_data, setPrefecturesListData } = useContext(
    PrefecturesListDataContext
  )
  const { setCheckboxChecker } = useContext(
    CheckboxCheckerContext
  )
  const { setChartChange } = useContext(
    ChartChangeContext
  )

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const index = Number(event.target.value)
    var _prefectures_list_data = prefectures_list_data

    _prefectures_list_data[index] = {
      ..._prefectures_list_data[index],
      checked: event.target.checked
    }

    setPrefecturesListData(
      _prefectures_list_data
    )

    setCheckboxChecker(_prefectures_list_data[index])
    setChartChange(false)
  }


  return (
    <section>
      <div className="prefecture-list-container">
        <p>都道府県を選択</p>
        <ul className="prefecture-list">
          {(() => {
            const checkbox_list = prefectures_list_data.map((value, index) => {
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
      </div>
    </section>
  );
}

export default PrefecturesList;