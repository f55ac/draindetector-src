import "./index.css";
import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

class Graph extends React.Component {

  render() {
    return (
      <div style={{ marginLeft:"auto", marginRight:"auto", width:"90%", height:700 }}>
      <ResponsiveContainer>
          <LineChart
            data={this.props.data}
            margin={this.props.margin}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={this.props.xaxis} />
            <YAxis unit={this.props.lines[0].unit} />
            <Tooltip />
            <Legend />
            {this.props.lines.map((line) => {
                return <Line key={line.name}
                             type="monotone"
                             name={line.name} 
                             dataKey={line.dataKey}
                             strokeWidth={line.strokeWidth}
                             stroke={line.stroke}
                             unit={line.unit} 
                             isAnimationActive={line.isAnimationActive}
                        />
             })}
          </LineChart>
      </ResponsiveContainer>
      </div>
    );
  }
}

export default Graph;
