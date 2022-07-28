import React from 'react';

import Graph from './Graph.js';
import { firebaseGetDataRealtime } from './firebaseDrainData.js';

function HeaderView(props) {
    return (
        <div style={{textAlign:"center"}}>
            <h1>{props.text}</h1>
            <p>
                Last {props.duration}
            </p>
            <button onClick={props.handleChartToggle}>Pause/Play</button>
        </div>
    );
}

class LiveChartView extends React.Component {
    constructor(props) {
        super(props);
        this.updateData=this.updateData.bind(this);
        this.callbackSetNameAndData=this.callbackSetNameAndData.bind(this);
        this.onChartToggle=this.onChartToggle.bind(this);

        this.state = { 
            uuid: getSearchParam("uuid"),
            name: null, data: null, exportData: null,
            timeStart: new Date(Date.now() - 30*1000),
            timeEnd: new Date()
        };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.updateData(), 1000);
    }

    componentWillUnmount() {
        if (this.timerID) 
            clearInterval(this.timerID);
    }

    updateData() {
        firebaseGetDataRealtime( this.state.uuid, this.callbackSetNameAndData );
    }

    callbackSetNameAndData(drainName, rawData) {
        let base = (this.state.data ? this.state.data.map(elem=>elem) : new Array());
        if (base.length > 30)
            base = base.slice(base.length-29, base.length);
        
        base.push({
            Distance: rawData.Distance,
            Timestamp: new Date(rawData.Timestamp).toLocaleTimeString()
        });
        this.setState({ name: drainName, data: base, exportData: rawData});
    }

    onChartToggle() {
        if (this.timerID) {
            clearInterval(this.timerID);
            this.timerID = null;
        }
        else {
            this.timerID = setInterval(
                () => this.updateData(),
                1000
            );
        }
    }

    render() {
        return (
            <div>
                <HeaderView
                    text={"Live water level graph for " + this.state.name}
                    duration={"30 seconds"}
                    handleChartToggle={this.onChartToggle}
                />
                <Graph
                    data={this.state.data}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    xaxis="Timestamp"
                    lines={[ { name: "Current water level", dataKey: "Distance",
                              strokeWidth:3, stroke:"#8884d8", unit: "cm",
                              isAnimationActive:false }
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
