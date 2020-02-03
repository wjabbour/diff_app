import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

let reader;

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {firstFile: "", secondFile: "", comparisonOutput: ""};
    this.handleFileA = this.handleFileA.bind(this);
    this.handleFileB = this.handleFileB.bind(this);
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
    let configuration = {
      "GS": [3]
    }
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
    const comparisonOutput = this.state.comparisonOutput;
      if (comparisonOutput) {
    
        button = <button class="btn btn-primary" onClick={ e => this.downloadTxtFile() }>Download txt</button>
      
      }
    return (
      <div>
        <div>
          <div className="add-media" >
              <input
                name="First File"
                type="file"
                id="fileA"
                accept=".txt"
                ref="fileUploader"
                onChange={ e => this.handleFileA(e.target.files[0])}
              />
          </div>
        </div>

        <div>
          <div className="add-media" >
              <input
              name="First File"
              type="file"
              id="fileB"
              accept=".txt"
              ref="fileUploader"
              onChange={ e => this.handleFileB(e.target.files[0])}
              />
          </div>
        </div>
        
        <button onClick={ e => this.compareFiles() }>Compare</button>
        {button}
        
        
      </div>
    )
  }
}

export default App;
