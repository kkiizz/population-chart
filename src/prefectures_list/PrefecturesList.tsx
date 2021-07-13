import { stringify } from 'querystring';
import React from 'react';
import './PrefecturesList.scss';

function PrefecturesList() {
  return (
    <section className="prefecture-list-container">
      <p>都道府県を選択</p>
      <ul className="prefecture-list">
        {(() => {
          //適当なデータを挿入している　要変更
          let checkbox_list = []

          for (var i=0; i<47; i++){
            checkbox_list.push(
              <li key={i}>
                <input
                 type="checkbox" 
                 name={String(i)}
                />
                <label htmlFor={String(i)}>和歌山県</label>
              </li>
            )
          }
          return checkbox_list
        })()}
      </ul>
    </section>
  );
}

export default PrefecturesList;