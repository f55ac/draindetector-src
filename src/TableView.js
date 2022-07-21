import React from 'react';
import {Link} from "react-router-dom";

import BasicTable from './Table';
import { firebaseGetAllDataLatest } from './firebaseDrainData';

const columns = ["Unique ID", "Name of drain", "Last updated", "Current water level", "Flood threshold", ""];

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
        let live = "/live?uuid=" + element.uuid;
        // separate link for detailed chart
        let chart = "/chart?uuid=" + element.uuid;

        let cl_link= <Link to={live}>{element.data.cl}</Link>;
        let chart_link = <Link to={chart}>Detailed chart</Link>;

        return { uuid: element.uuid, 
                 name: element.name,
                 lastUpdated: element.data.time,
                 cl: cl_link,
                 tl: element.data.tl,
                 chart: chart_link
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
