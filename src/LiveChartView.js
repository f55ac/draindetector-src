import React from 'react';

import Graph from './Graph.js';
import { firebaseGetDataTimeRange } from './firebaseDrainData.js';

function HeaderView(props) {
    return (
        <div style={{textAlign:"center"}}>
            <h1>{props.text}</h1>
            <p>
                Last <strong>30</strong> seconds
            </p>
        </div>
    );
}

class LiveChartView extends React.Component {
    constructor(props) {
        super(props);
        this.updateData=this.updateData.bind(this);
        this.callbackSetNameAndData=this.callbackSetNameAndData.bind(this);

        this.state = { 
            uuid: getSearchParam("uuid"),
            name: null, data: null, exportData: null,
            timeStart: new Date(Date.now() - 3600000),
            timeEnd: new Date()
        };
    }

    updateData() {
        firebaseGetDataTimeRange(
            this.state.uuid,
            new Date(Date.now() - 30 * 1000),
            new Date(),
            this.callbackSetNameAndData
        );
    }

    componentDidMount() {
        // hack to render graph on load
        //this.updateData();
        this.timerID = setInterval(
            () => this.updateData(),
            2000
        );

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

    render() {
        return (
            <div>
                <HeaderView
                    text={"Live water level graph for " + this.state.name}
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

export default LiveChartView;
