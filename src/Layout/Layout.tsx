import React, { ReactNode } from 'react';
import './Layout.scss';

type Props = {
  children: ReactNode,
}


function Layout({ children }: Props) {
  return (
    <div className="layout-container">
      <header>
        <h1>都道府県別　人口チャート</h1>
      </header>
      <div className="children-container">
        {children}
      </div>
    </div>
  );
}

export default Layout;