import React, { Component } from 'react';
import Comparison from './Comparison';

export default class ComparisonTable extends Component {
    constructor (props) {
        super(props);
        // this array holds references to each of the comparisons in our table
        this.myRefs = [];
        this.state = {
            configurations: [],
            comparisons: []
        }
        // this counter is necessary to assign ids to our comparisons for react to update properly
        this.comparisonCounter = 0;

        this.addComparison = this.addComparison.bind(this);
        this.doCompare = this.doCompare.bind(this);
        this.removeComparison = this.removeComparison.bind(this);
        this.generateReport = this.generateReport.bind(this);
    }
    // TODO: Refactor to make manual call unecessary?
    componentDidMount() {
        // sets state with config but happens async
        this.getConfigurations();
        // so need to manually fetch config rules for our initial Comparison
        let configurations = [];
        if (localStorage.getItem("configurationRules")) {
            configurations.push(JSON.parse(localStorage.getItem("configurationRules")));
        }
        this.initialComparison = 
         <Comparison onRef={ref => (this.myRefs.push(ref))} 
                            doCompare={ this.state.doCompare }
                            configurations={ configurations }
                            compareFiles={ this.compareFiles }
                            initial={ true }
                            key={ this.comparisonCounter.toString() } /> 
        this.comparisonCounter++;
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
    addComparison(e) {
        e.preventDefault();
        const comparisonList = this.state.comparisons;
        this.setState({
            comparisons: comparisonList.concat(
                <Comparison onRef={ref => (this.myRefs.push(ref))}
                            configurations={ this.state.configurations }
                            compareFiles={ this.compareFiles }
                            initial={ false }
                            removeComparison={ this.removeComparison }
                            listId={ this.comparisonCounter.toString() }
                            key={ this.comparisonCounter.toString() } />
            )
        }, () => this.comparisonCounter++)
    }
    removeComparison(e, id) {
        e.preventDefault();
        const comparisons = this.state.comparisons;
        const newComparisons = comparisons.filter(comparison => comparison.key !== id);     
        this.setState({ comparisons: newComparisons });
    }
    // calls the runComparison function on each comparison component, ie each row in our table
    doCompare() {
        this.myRefs.forEach(someRef => {
            someRef.runComparison();
        })
        this.setState({
            doCompare: true
        })
    }
    compareFiles = (fileA, fileB, configuration) => {  
        let comparison = "";
        if (Object.keys(fileA).length === 0 || Object.keys(fileB).length === 0) {
            return comparison;
        } 
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
    generateReport(e) {
        e.preventDefault();
        let reportResult = "";
        const children = this.myRefs;
        children.forEach(child => {
            if (child.state.result.length > 0) {
                reportResult += child.state.result;
                reportResult += "\r\n\r\n\r\n";
            }
        })

        const element = document.createElement("a");
        const file = new Blob([reportResult], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = "comparison_diff.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    render() {
        let generateReportButton = <div></div>;

        if (this.state.doCompare) {
            generateReportButton =  <button onClick={ this.generateReport }>
                                        Generate Report
                                    </button>
        }
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
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.initialComparison }
                    {
                        this.state.comparisons.map(function(comparison, index) {
                            return comparison; 
                        })
                    }
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
                        { generateReportButton }
                    </div>
                </div>
            </div>
            
        )
    }
}