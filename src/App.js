import React from 'react';

import ResponsiveAppBar from './ResponsiveAppBar';
import TableView from './TableView';
import ChartView from './ChartView';
import AboutView from './AboutView';

import './index.css';

import { Route, Routes } from "react-router-dom";


const pages = ["table", "about"];

class App extends React.Component {
    constructor() {
        super();
        this.onChangeViewType = this.onChangeViewType.bind(this);
        this.state = { viewType: "table" };
    }
    
    onChangeViewType(newViewType) {
        console.log(this.state.viewType, newViewType);
        this.setState({ viewType: newViewType });
    }

    render() {
        return (
            <React.Fragment>
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
