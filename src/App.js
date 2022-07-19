import React from 'react';

import ResponsiveAppBar from './ResponsiveAppBar';
import TableView from './TableView';
import ChartView from './ChartView';
//import LiveChartView from './LiveChartView';
import AboutView from './AboutView';
import NotificationRequestPrompt from './NotificationRequestPrompt';

import './index.css';

import { Route, Routes } from "react-router-dom";


const pages = ["table", "about"];

class App extends React.Component {
    render() {
        return (
            <React.Fragment>
            <NotificationRequestPrompt />
            <ResponsiveAppBar pages={pages} />
            <Routes>
                <Route path='/' element={<TableView />}/>
                <Route path='/table' element={<TableView />}/>
                <Route path='/chart' element={<ChartView />}/>
                <Route path='/about' element={<AboutView />}/>
            </Routes>
            </React.Fragment>
        );
    }
}

export default App;
