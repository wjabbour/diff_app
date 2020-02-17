import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Configuration from "./Configuration";
import ComparisonTable from './ComparisonTable';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg" style={{backgroundColor: "#4D148C"}}>
            <Link to="/" className="navbar-brand">FedEx</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link" style={{color: "white"}}>Compare</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/configuration" className="nav-link" style={{color: "white"}}>Configure</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={ComparisonTable} />
          <Route path="/configuration" component={Configuration} />
        </div>
      </Router>
      
    )
  }
}

export default App;
