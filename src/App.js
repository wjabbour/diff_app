import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Configuration from "./Configuration";
import Comparison from './Comparison';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-dark">
            <Link to="/" className="navbar-brand">FedEx</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Compare</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/configuration" className="nav-link">Configure</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br/>
          <Route path="/" exact component={Comparison} />
          <Route path="/configuration" component={Configuration} />
        </div>
      </Router>
      
    )
  }
}

export default App;
