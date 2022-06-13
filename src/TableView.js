import React from 'react';
import {Link} from "react-router-dom";

import BasicTable from './Table';
import { firebaseGetAllDataLatest } from './firebaseDrainData';

const columns = ["Unique ID", "Name of drain", "Last updated", "Current water level", "Flood threshold"];

class TableView extends React.Component {
    constructor(props) {
        super(props);
        this.callbackSetData = this.callbackSetData.bind(this);

        this.state = { columns: columns, data: null}
    }
    componentDidMount() {
        firebaseGetAllDataLatest(this.callbackSetData);
    }

    callbackSetData(rows) {
        let processedRows= [];
        rows.forEach((row) => processedRows.push(this.createCellData(row)));
        this.setState({ data: processedRows });
    }

    createCellData(element) {
        // current water level cell needs to link to chart
        let link = "/chart?uuid=" + element.uuid;
        let cell = <Link to={link}>{element.data.cl}</Link>;

        return { uuid: element.uuid, 
                 name: element.name,
                 lastUpdated: element.data.time,
                 cl: cell, 
                 tl: element.data.tl 
               };
    }

    render() {
        if (this.state.data === null) return;
        return (
            <div style={{textAlign:"center"}}>
                <h1>Table of drains</h1>
                <BasicTable 
                    columns={this.state.columns}
                    rows={this.state.data}
                /> 
            </div>
        );
    }
}

export default TableView;
