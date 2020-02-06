import React, { Component } from 'react';

let reader;
export default class Comparison extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
            firstFile: {},
            secondFile: {},
            configuration: {},
            result: null
        }
        this.handleFileA = this.handleFileA.bind(this);
        this.handleFileB = this.handleFileB.bind(this);
        this.handleSelectUpdate = this.handleSelectUpdate.bind(this);
    }
    componentDidMount() {
        this.props.onRef(this);
    }
    componentWillUnmount() {
        this.props.onRef(undefined);
    }
    runComparison() {
        let myResult = this.props.compareFiles(this.state.firstFile, this.state.secondFile, this.parseConfig(this.state.configuration));
        console.log(myResult);
        this.setState({
            result: myResult
        })
    }
    parseConfig() {
        const configuration = this.state.configuration;
        
        if (Object.keys(configuration).length === 0) {
            return {};
        } else {
            let parsedConfig = {};
            configuration.configurationRules.forEach(rule => {
                if (parsedConfig.hasOwnProperty(rule.segmentName)) {
                    parsedConfig[rule.segmentName].push(rule.segmentNumber);
                } else {
                    parsedConfig[rule.segmentName] = [(rule.segmentNumber)];
                }
            });
            return parsedConfig;
        }
    }
    handleFileA = file => {
        let fileContents = "";
        reader = new FileReader();
        reader.onload = event => {
            fileContents = event.target.result;
            fileContents = fileContents.split('\n');
            let lineRep = [];
            fileContents.forEach(line => {
                lineRep.push(line.split("*"));
            });
            let myFile = {
                name: file.name,
                lines: lineRep
            }
            this.setState({firstFile: myFile});
        }
        reader.readAsText(file);
    }
    handleFileB = file => {
        let fileContents = "";
        reader = new FileReader();
        reader.onload = event => {
            fileContents = event.target.result;
            fileContents = fileContents.split('\n');
            let lineRep = [];
            fileContents.forEach(line => {
                lineRep.push(line.split("*"));
            });
            let myFile = {
                name: file.name,
                lines: lineRep
            }
            this.setState({secondFile: myFile});
        }
        reader.readAsText(file);
    }
    handleSelectUpdate(e) {
        this.setState({
            configuration: JSON.parse(e.target.value)
        })
    }
    downloadTxtFile = () => {
        const element = document.createElement("a");
        const file = new Blob([this.state.result], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = "comparison_diff.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
    createConfigurationSelect() {
        const configurationOptions = this.props.configurations.map((config) =>
            <option key={config.configurationName} value={ JSON.stringify(config) }>
                { config.configurationName }
            </option>
        );
        return  (
            <select onChange={this.handleSelectUpdate}>
                <option hidden defaultValue={{label: "", value: {}}}></option>
                { configurationOptions }
            </select>
        );
    }
    render() {
        let configurationSelect = this.createConfigurationSelect();
        let outcome = <div></div>;
        if (typeof this.state.result === 'string') {
            if (this.state.result.length !== 0) {
                outcome =   <div className="d-flex align-items-center">
                                <i className="material-icons mr-1">error_outline</i>
                                <button className="btn btn-secondary mr-1">View</button>
                                <button onClick={ e => this.downloadTxtFile() } className="btn btn-secondary">Save Report</button>
                            </div>
            } else {
                outcome = <i className="material-icons mr-1">done</i>
            }
        } else {
            if (!this.props.initial) {
                outcome =   <div>
                                <div>
                                    <button>-</button>
                                </div>  
                            </div>
            }
        }
        return(
            <tr> 
                <td>
                    <input
                    name="File1"
                    type="file"
                    id="fileA"
                    accept=".txt"
                    ref="fileUploader"
                    onChange={ e => this.handleFileA(e.target.files[0])}
                    />
                </td>
                <td>
                    <input
                    name="File2"
                    type="file"
                    id="fileB"
                    accept=".txt"
                    ref="fileUploader"
                    onChange={ e => this.handleFileB(e.target.files[0])}
                    />
                </td>
                <td>
                    { configurationSelect }
                </td>
                <td>
                    { outcome }
                </td>
            </tr> 
        );
    }
}
