import React, { Component } from 'react';
import './App.css';

import { Auth } from './components/Auth';
import { Paint } from './components/Paint';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    }
  }
  onLogin = user => {
    this.setState({
      user,
    });
  }
  render() {
    return (
      <div className="App">
        {
          !this.state.user && <Auth onLogin={this.onLogin} />
        }
        {
          !!this.state.user && <Paint user={this.state.user} />
        }
      </div>
    );
  }
}

export default App;
