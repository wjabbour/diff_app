import React, {Component} from 'react';
import './App.css';

let reader;
const handleFileChosen = file => {
  
  reader = new FileReader();
  reader.onload = function(event) {
    var contents = event.target.result;
    console.log(contents);
  }
  reader.readAsText(file);
}



class App extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    const script = document.createElement("script");

    script.src = "./diff_match_patch.js";
    script.async = true;

    document.body.appendChild(script);
}
  
  render() {
    return (
      <div>
        <div>
          <div className="add-media" >
              <input
                name="First File"
                type="file"
                id="file"
                accept=".txt"
                ref="fileUploader"
                onChange={ e => handleFileChosen(e.target.files[0])}
              />
          </div>
        </div>

        <div>
          <div className="add-media" >
              <input
              name="First File"
              type="file"
              id="file"
              accept=".txt"
              ref="fileUploader"
              onChange={ e => handleFileChosen(e.target.files[0])}
              />
          </div>
        </div>

        <button>Compare</button>
      </div>
    )
  }
}

export default App;
