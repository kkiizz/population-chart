import React, { ReactNode } from 'react';
import './Layout.scss';

function Layout(props:{ children:ReactNode }) {
  return (
    <div className="layout-container">
      <header>
        <h1>都道府県別　人口チャート</h1>
      </header>
      <div className="children-container">
        {props.children}
      </div>
    </div>
  );
}

export default Layout;