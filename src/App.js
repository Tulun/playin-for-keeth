import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from './components/home/Home'

import './App.css'

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      delay: 300,
      result: "No result",
      showQR: false,
    }

    this.handleScan = this.handleScan.bind(this)
  }

  handleScan(data) {
    if (data) {
      const pasredData = JSON.stringify(data)
      this.setState({
        result: data,
        contract: pasredData.contract,
        hexData: pasredData.data,
      });
    }
  }
  
  handleError(err) {
    console.error(err);
  }

  scanQR(){

  }

  render() {

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <p className="mb-0">
              Playing for keETHs
            </p>
          </header>
           
          {/* <Route path="/:contract" component={Home} /> */}
          {/* Temp for testing. */}
          {/* <Route path="/" component={Home} /> */}
          <Route path="*" component={Home} />
        </div>
      </Router>
    );
  }
}

export default App;
