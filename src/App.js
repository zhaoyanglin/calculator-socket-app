import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import './App.css'

class App extends Component {

  state = {
    endpoint: "ws://real-time-calculator.herokuapp.com:4001",
    firstValue: '',
    secondValue: '',
    result: '',
    operation: '',
    calculations: [],
  };

  componentDidMount = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('new user')
    socket.on('calc', (array) => {
      this.setState({
        calculations: array,
      })
    })
  }

  // sending sockets
  send = () => {
    const socket = socketIOClient(this.state.endpoint);
    socket.emit('add calculation', this.state)
  }
  ///

  //input 
  handleChangFor = (key) => (event) => {
    this.setState({
      [key]: event.target.value
    })
  }
  //
  //operation 
  onChangeOperation = (key) => {
    this.setState({
      operation: key,
    })
  }
  //
  //clear all 
  onclickClear = () => {
    this.setState({
      firstValue: '',
      secondValue: '',
      result: '',
      operation: '',
    })
  }
  //
// calculation
  calculate = () => {
    if (this.state.firstValue === '' || this.state.secondValue === '') {
      alert("PLEASE FILL IN BOTH INPUTS BEFORE CONTINUING!!!!!!!!")
    }
    else if (this.state.operation === '+') {
      this.setState({
        result: Number(this.state.firstValue) + Number(this.state.secondValue)
      }, () => {
        this.send()
      })

    } else if (this.state.operation === '-') {
      this.setState({
        result: this.state.firstValue - this.state.secondValue
      }, () => {
        this.send()
      })

    } else if (this.state.operation === '*') {
      this.setState({
        result: this.state.firstValue * this.state.secondValue

      }, () => {
        this.send()
      })

    } else if (this.state.operation === '/') {
      this.setState({
        result: this.state.firstValue / this.state.secondValue

      }, () => {
          this.send()
      })
    }
  }
  //

  render() {
    // get updated list
    let TopTenList = null;
    TopTenList = this.state.calculations.map((data, i) => {
      return (
        <div>
          <li key={i} >{data}</li>
          <br />
        </div>
      )
    })

    return (
      <div className="App" >

        <div id='calDiv'>

          <div id='firstInputDiv'>
            <input type='number'id='fisrtVal' placeholder='first value' onChange={this.handleChangFor('firstValue')} value={this.state.firstValue} />
          </div>

          <div id='operationButtonDiv'>
            <button onClick={() => this.onChangeOperation('+')}>+</button>
            <br />
            <button onClick={() => this.onChangeOperation('-')}>-</button>
            <br />
            <button onClick={() => this.onChangeOperation('*')}>*</button>
            <br />
            <button onClick={() => this.onChangeOperation('/')}>/</button>
          </div>

          <div id='secondInputDiv'>
            <input type='number' id='secondVal' placeholder='second value' onChange={this.handleChangFor('secondValue')} value={this.state.secondValue} />
          </div>

          <div id='lastDiv'>
            <button onClick={() => this.calculate()} > = </button>
            <button onClick={() => this.onclickClear()}>C</button>
          </div>

        </div>

        <div id='listDiv'>
          <ul>
            {TopTenList}
          </ul>
        </div>

      </div>
    )
  }
}
export default App;
