import React, { Component } from 'react';
import _ from 'lodash';

import brain from 'brain.js/src';
import Swing from 'react-swing';
import Notifications, {notify} from 'react-notify-toast';

import styled from 'styled-components';
import randomColor from 'randomcolor';
import chroma from 'chroma-js';

import './App.css';

const Card = styled.div`
  background-color: ${props => props.bgColor ? props.bgColor : 'white'} !important;
`

const ResultCubeList = styled.div`
  display: flex;
  width: 660px;
  height: auto;
  flex-wrap: wrap;
`
const ResultCube = styled.div`
  border-radius: 50%;
  width: 200px;
  height: 200px;
  padding: 20px;
  margin: 10px;
  background: ${props => props.bgColor ? props.bgColor : 'grey'};
  display: flex;
  align-items: center;
  justify-content: center;

  > div {
    border-radius: 5px;
    width: 90%;
    height: auto;
    padding: 5px;
    background: rgba(255, 255, 255, 0.5);
    color: #50514F;
    > p {
      font-size: 15px;
      font-weight: bold;
      margin: 2.5px 0;
    }
  }
`
class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
          stack: null,
          trainData: [],
          testResult: [],
          colorList: randomColor({count: 20, hue: 'light'})
      };
  }
  toggleData (e) {
    console.log('card throwout', e.target.classList[1])
    let targetColor = chroma(e.target.classList[1]).rgb();
    let _data = {
      input: { r: targetColor[0]/255, g: targetColor[1]/255, b: targetColor[2]/255 },
      output: { like: 0, hate: 0 }
    };
    if (e.throwDirection === Swing.DIRECTION.LEFT) {
      _data.output.hate = 1;
      let myColor = { background: 'tomato', text: "#FFFFFF" };
      notify.show("😱 不喜翻 bye", "custom", 1000, myColor);
    } else if (e.throwDirection === Swing.DIRECTION.RIGHT) {
      _data.output.like = 1;
      let myColor = { background: '#0AF', text: "#FFFFFF" };
      notify.show("🚀 喜翻 like", "custom", 1000, myColor);
    } else {
      // pass
    }
    this.state.trainData.push(_data);
  }
  startTrain () {
    console.log(this.state.trainData);
    var net = new brain.NeuralNetwork();

    net.train([
      {input: { r: 255/255, g: 165/255, b: 0 }, output: {like: 0, hate: 0}},  // orange
      {input: { r: 255/255, g: 255/255, b: 0/255 }, output: {like: 0, hate: 0}},  // yellow
      {input: { r: 0/255, g: 128/255, b: 0/255 }, output: {like: 0, hate: 0}},  // green
      {input: { r: 0/255, g: 255/255, b: 255/255 }, output: {like: 0, hate: 0}},  // cyan
      {input: { r: 0/255, g: 0/255, b: 255/255 }, output: {like: 0, hate: 0}},  // blue
      {input: { r: 238/255, g: 130/255, b: 238/255 }, output: {like: 0, hate: 0}},  // violet
      {input: { r: 255/255, g: 0/255, b: 255/255 }, output: {like: 0, hate: 0}},  // magenta
      {input: { r: 255/255, g: 0/255, b: 0/255 }, output: {like: 0, hate: 0}},  // red
    ].concat(this.state.trainData), {
      // log: true
    });
    console.log('green: ', net.run({ r: 158/255, g: 247/255, b: 158/255 }));
    console.log('blue: ', net.run({ r: 0/255, g: 77/255, b: 218/255 }));
    console.log('red: ', net.run({ r: 255/255, g: 130/255, b: 130/255 }));

    let testData = randomColor({ count: 100 });
    let testResult = []
    for (let i = 0; i < testData.length; i++) {
      let color = chroma(testData[i]).rgb();
      testResult.push({
        color: testData[i],
        result: net.run({ r: color[0]/255, g: color[1]/255, b: color[2]/255 })
      })
    }
    console.log(testResult);
    this.setState({
      testResult: testResult
    })
  }
  render() {
    return (
      <div className="App">
        <Notifications />
        <div>
            <div id="viewport">
                <Swing
                    className="stack"
                    tagName="div"
                    setStack={(stack)=> this.setState({stack:stack})}
                    ref="stack"
                    // throwout={(e)=>console.log('throwout',e)}
                >
                  {
                    _.map(this.state.colorList, (color, id) =>
                      <Card
                        key={id}
                        ref={color}
                        bgColor={color}
                        className={`card ${color}`}
                        throwout={(e) => this.toggleData(e)}
                      ></Card>
                    )
                  }
                </Swing>
            </div>
            <div className="control">
                <button type="button" onClick={this.startTrain.bind(this)}>
                  <p>Train</p>
                  <span role="img">🚂</span><span role="img">🚂</span><span role="img">🚂</span>
                </button>
            </div>
            <ResultCubeList>
              {
                _.map(
                  _.sortBy(this.state.testResult, (item) => {
                    return item.result.like
                  }).reverse(), (cube, id) =>
                  <ResultCube
                    key={id}
                    bgColor={cube.color}
                  >
                    <div>
                      <p>喜歡: {(cube.result.like * 100).toFixed(2)} %</p>
                      <p>討厭: {(cube.result.hate * 100).toFixed(2)} %</p>
                    </div>
                  </ResultCube>
                )
              }
            </ResultCubeList>
        </div>
      </div>
    );
  }
}

export default App;
