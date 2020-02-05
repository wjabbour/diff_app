import React, { Component } from 'react';
import Comparison from './Comparison';

let reader;

export default class ComparisonTable extends Component {
    constructor (props) {
        super(props);
        this.state = {firstFile: "", secondFile: "", comparisonOutput: ""};
        this.handleFileA = this.handleFileA.bind(this);
        this.handleFileB = this.handleFileB.bind(this);
        this.getConfigurations = this.getConfigurations.bind(this);
        let conf = {
            configurationName: "Will's Config",
            fileType: "X12",
            configurationRules: [
                {
                    segmentName: "GS",
                    segmentNumber: 3
                }
            ]
        }
        localStorage.setItem("configurationRules", JSON.stringify(conf));
    }
    // TODO: this only works if there is one config rule
    getConfigurations() {
        let configurations = [];
        if (localStorage.getItem("configurationRules")) {
            configurations.push(JSON.parse(localStorage.getItem("configurationRules")));
        }
        const options = configurations.map((config) =>
            <option key={config.configurationName}>
                { config.configurationName }
            </option>
        );
        return  (
            <select>
                {options}
            </select>
        );
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
      
    compareFiles = () => {
        let configuration = {};
        let comparison = "";
        let fileA = this.state.firstFile;
        let fileB = this.state.secondFile;
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
        if (!(comparison === "")) {
            this.setState({comparisonOutput: comparison});
        }
        
    }
    
    downloadTxtFile = () => {
        const element = document.createElement("a");
        this.setState({comparisonOutput: "A".bold()});
        const file = new Blob([this.state.comparisonOutput], {type: 'text/html'});
        element.href = URL.createObjectURL(file);
        element.download = "comparison_diff.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }
   
    render() {
        let button;
        let configurationSelect = this.getConfigurations();
        const comparisonOutput = this.state.comparisonOutput;
        if (comparisonOutput) {
        button = <button className="btn btn-primary" onClick={ e => this.downloadTxtFile() }>Download txt</button>
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
                  </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <input
                            name="File1"
                            type="file"
                            id="fileA"
                            accept=".txt"
                            ref="fileUploader"
                            onChange={ e => this.handleFileA(e.target.files[0])}
                            ref={this.inputRef}
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
                    </tr>
                </tbody>
              </table>
              <div className="container">
                  <div className="row">
                      <div className="col-sm"></div>
                      <div className="col-sm"></div>
                      <div className="col-sm">
                          <button onClick={this.compareFiles}>
                              Compare
                          </button>
                          { button }
                      </div>
                  </div>
              </div>
            </div>
        )
    }
}