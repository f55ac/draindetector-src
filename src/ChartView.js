import React from 'react';

import Graph from './Graph.js';
import ChartToolbar from './ChartToolbar.js';
import { firebaseGetDataTimeRange } from './firebaseDrainData.js';

function HeaderView(props) {
    return (
        <div style={{textAlign:"center"}}>
            <h1>{props.text}</h1>
            <p>
                {props.timeStart.toString()} 
                {" "}<strong>to</strong>{" "}
                {props.timeEnd.toString()} 
            </p>
        </div>
    );
}

class ChartView extends React.Component {
    constructor(props) {
        super(props);
        this.onApplyClick=this.onApplyClick.bind(this);
        this.onExportClick=this.onExportClick.bind(this);
        this.onStartChange=this.onStartChange.bind(this);
        this.onEndChange=this.onEndChange.bind(this);
        this.callbackSetNameAndData=this.callbackSetNameAndData.bind(this);

        this.state = { 
            uuid: getSearchParam("uuid"),
            name: null, data: null, exportData: null,
            timeStart: new Date(Date.now() - 3600000),
            timeEnd: new Date()
        };
    }

    componentDidMount() {
        // hack to render graph on load
        this.onApplyClick();
    }

    callbackSetNameAndData(drainName, rawData) {
        let formatted = [];
        for (let element of rawData) {
            formatted.push({ time: new Date(element.epoch).toLocaleString(),
                        cl: parseFloat(element.current_level),
                        tl: parseFloat(element.flood_threshold) });
        }
        this.setState({ name: drainName, data: formatted, exportData: rawData});
    }

    onApplyClick() {
        const timeStart = this.state.timeStart.getTime();
        const timeEnd = this.state.timeEnd.getTime();
        if (timeStart > timeEnd) return;

        const uuid = this.state.uuid;

        firebaseGetDataTimeRange(uuid, timeStart, timeEnd, 
            this.callbackSetNameAndData);
    }
    onExportClick() {
        triggerJsonDownload(this.state.name, this.state.exportData);
    }
    onStartChange(value) {
        this.setState({timeStart: value});
    }
    onEndChange(value) {
        this.setState({timeEnd: value});
    }

    render() {
        return (
            <div>
                <HeaderView
                    text={"Water level graph for " + this.state.name}
                    timeStart={this.state.timeStart}
                    timeEnd={this.state.timeEnd}
                />
                <Graph
                    data={this.state.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    lines={[ { name: "Current water level", dataKey: "cl",
                              strokeWidth:3, stroke:"#8884d8", unit: "m"},
                             { name: "Flood threshold", dataKey: "tl",
                              strokeWidth:3, stroke:"#82ca9d", unit: "m"}
                           ]}
                />
                    
                <ChartToolbar
                    timeStart={this.state.timeStart}
                    timeEnd={this.state.timeEnd}
                    onApplyClick={this.onApplyClick}
                    onExportClick={this.onExportClick}
                    onStartChange={this.onStartChange}
                    onEndChange={this.onEndChange}
                />
            </div>
        );
    }
}

// ==========HELPER/UTILITY FUNCTIONS==========
function getSearchParam(key) {
    const hashstring = window.location.hash;
    let querystring = "";
    if (window.location.search !== "")
        querystring = window.location.search;
    else
        querystring = hashstring.slice(hashstring.indexOf('?'));

    const params = new Proxy(new URLSearchParams(querystring), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
    // Get the value of "some_key" in eg "https://example.com/?some_key=some_value"
    return params[key]; 
}

function triggerJsonDownload(name, object) {
    const date = new Date().toLocaleString();
    const filename = `${name}-${date}.json`;
    
    let link = document.createElement('a');
    link.href = URL.createObjectURL(
        new Blob([JSON.stringify(object)],
        {type: "application/json"})
    );
    link.download = filename;
    link.click();
}


export default ChartView;
