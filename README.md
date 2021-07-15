# 都道府県の人口チャート
## 公開URL
https://population-chart-coral.vercel.app/
## バージョン
1. React : 17.0.2
2. Typescript : 4.3.5
3. node : 6.14.13
4. node-sass : 6.0.1

## API
RESAS(地域経済分析システム、URL : https://opendata.resas-portal.go.jp/)を利用<br>
API詳細仕様 : https://opendata.resas-portal.go.jp/docs/api/v1/detail/index.html

## App.tsx
### AppProvider
次の二つを子コンポーネントに渡す
- PrefecturesListDataContext
都道府県の一覧をAPIから取得し、そのデータ(PrefectureData)を渡すContex<br>
APIの情報 : https://opendata.resas-portal.go.jp/docs/api/v1/prefectures.html

- CheckboxCheckerContext
prefectures_listで選択された都道府県のデータ（PrefectureData）<br>
prefectures_listで変更した値をpopulation_chartで利用するためのContext


## population_chart
### CreateChartData
PrefectureData[]とPrefecturesPopulationDataを受け取り、描写データの生成とLineのJSXを生成<br>
チェックされている都道府県は、PrefectureData[]のcheckedで判定

### PopulationChart
CheckboxCheckerContextから得たcheckboxの変更情報を受け取り、まだAPIから情報を取ってきていなければfetch<br>
chart_dataにcheckboxで受け取った都道府県の名前がkeyとしてあれば、すでに人口の情報をAPIから取って来ていると判定<br>
APIの情報 : https://opendata.resas-portal.go.jp/docs/api/v1/population/composition/perYear.html

## prefectures_list
PrefectureData[]からチェックボックスを含むリストを生成<br>
handleCheckboxChangeでチェックボックスの変更をprefectures_list_dataへ反映<br>
都道府県の人口データを取得するために、setCheckboxCheckerへcheckedを変更した都道府県のデータを渡す

## Layout
全体のレイアウトを調整する