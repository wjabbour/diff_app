import React, { Component } from 'react';
import Comparison from './Comparison';

export default class ComparisonTable extends Component {
    constructor (props) {
        super(props);
        
        this.state = {
            configurations: [],
            comparisons: [],
            doCompare: false
        }

        // let conf = {
        //     configurationName: "Will's Config",
        //     fileType: "X12",
        //     configurationRules: [
        //         {
        //             segmentName: "GS",
        //             segmentNumber: 3
        //         }
        //     ]
        // }
        //localStorage.setItem("configurationRules", JSON.stringify(conf));
        this.addComparison = this.addComparison.bind(this);
        this.doCompare = this.doCompare.bind(this);
    }
    componentDidMount() {
        this.getConfigurations();
    }

    // TODO: this only works if there is one config rule
    getConfigurations() {
        let configurations = [];
        if (localStorage.getItem("configurationRules")) {
            configurations.push(JSON.parse(localStorage.getItem("configurationRules")));
        }
        this.setState({
            configurations: configurations
        })
    }
    addComparison() {

    }
    doCompare() {
        this.setState({
            doCompare: true
        })
    }
    compareFiles = (fileA, fileB, configuration) => {    
        let comparison = "";
        for(let i = 0; i < fileA.lines.length; i++) {
            for(let j = 1; j < fileA.lines[i].length; j++) {
                // if segment name is in conf
                if (configuration.hasOwnProperty(fileA.lines[i][0])) {
                    if (configuration[fileA.lines[i][0]].includes(j)) {
                        continue;
                    }
                }
                if(!(fileA.lines[i][j] === fileB.lines[i][j])) {
                    comparison += `${fileA.name} Line ${i + 1}, Section ${fileA.lines[i][0]}-${j}: ${fileA.lines[i][j]}\r\n${fileB.name} Line ${i + 1}, Section ${fileB.lines[i][0]}-${j}: ${fileB.lines[i][j]}\r\n`
                }
            }
        }
        return comparison;
    }
    render() {
        return (
            <div>
                <h5>
                    <b>
                        Please select files to compare and a specific
                        configuration for ignore information
                    </b>
                </h5>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">File 1</th>
                            <th scope="col">File 2</th>
                            <th scope="col">Configuration</th>
                        </tr>
                    </thead>
                    <tbody>
                        <Comparison doCompare={ this.state.doCompare } configurations={ this.state.configurations } compareFiles={ this.compareFiles }/>
                    </tbody>
                </table>
                <div className="container">
                    <div style={{marginTop: "50px"}} className="d-flex flex-row-reverse">
                        <button onClick={this.doCompare}>
                                Compare
                        </button>
                        <button onClick={this.addComparison}>
                                Add Comparison
                        </button>
                    </div>
                </div>
            </div>
            
        )
    }
}