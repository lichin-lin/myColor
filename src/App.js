import React, { Component } from 'react';
import _ from 'lodash';

import brain from 'brain.js/src';
import Swing from 'react-swing';
import Notifications, {notify} from 'react-notify-toast';

import randomColor from 'randomcolor';
import chroma from 'chroma-js';

import { Card, ResultCellList, LikeHateCell, GradientCell} from './AppStyle.js';
import './App.css';

class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.state = {
          stack: null,
          trainData: [],
          likeHateResult: [],
          showLikeHate: false,
          GradientResult: [],
          showGradient: false,
          colorList: randomColor({count: 20, hue: 'light'}),
          net: ''
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

    this.setState({
      net: net
    })
    let myColor = { background: '#6fe8a7', text: "#FFFFFF" };
    notify.show("🚂 🚂 🚂 Trainning Finish", "custom", 1000, myColor);
  }
  likeHateResult () {
    let testData = randomColor({ count: 100 });
    let likeHateResult = []
    for (let i = 0; i < testData.length; i++) {
      let color = chroma(testData[i]).rgb();
      likeHateResult.push({
        color: testData[i],
        result: this.state.net.run({ r: color[0]/255, g: color[1]/255, b: color[2]/255 })
      })
    }
    this.setState({
      likeHateResult: likeHateResult,
      showLikeHate: true,
      showGradient: false,
    })
  }
  GradientResult () {
    let GradientResult = []
    let gradientThreshold = 0.5;
    let FAIL_SAFE = 0;
    for (let i = 0; i < 40; i++) {
      let colors = randomColor({ count: 2 });
      let fC = chroma(colors[0]).rgb()
      let sC = chroma(colors[1]).rgb()
      while (
        (this.state.net.run({ r: fC[0]/255, g: fC[1]/255, b: fC[2]/255 }).like < gradientThreshold ||
        this.state.net.run({ r: sC[0]/255, g: sC[1]/255, b: sC[2]/255 }).like < gradientThreshold) &&
        FAIL_SAFE < 10000
      ) {
        let tryColors = randomColor({ count: 2 });
        fC = chroma(tryColors[0]).rgb();
        sC = chroma(tryColors[1]).rgb();
        FAIL_SAFE++;
        console.log(FAIL_SAFE);
      }
      if (FAIL_SAFE >= 10000) {
        let myColor = { background: 'tomato', text: "#FFFFFF" };
        notify.show("😱 pick more!", "custom", 1000, myColor);
        return;
      }
      GradientResult.push({
        firstColor: chroma(fC).hex(),
        secondColor: chroma(sC).hex(),
        firstColorResult: this.state.net.run({ r: fC[0]/255, g: fC[1]/255, b: fC[2]/255 }),
        secondColorResult: this.state.net.run({ r: sC[0]/255, g: sC[1]/255, b: sC[2]/255 })
      })
    }
    this.setState({
      GradientResult: GradientResult,
      showLikeHate: false,
      showGradient: true
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
                  <span role="img" aria-label="train">🚂</span><span role="img" aria-label="train">🚂</span><span role="img" aria-label="train">🚂</span>
                  <p>Train</p>
                </button>
                <button type="button" onClick={this.likeHateResult.bind(this)}>
                  <p><span role="img" aria-label="like">👍</span> / <span role="img" aria-label="hate">👎</span> Favor</p>
                </button>
                <button type="button" onClick={this.GradientResult.bind(this)}>
                  <p><span role="img" aria-label="gradient">🔷</span> Gradient</p>
                </button>
            </div>
            <ResultCellList>
              {
                this.state.showLikeHate
                ? _.map(
                  _.sortBy(this.state.likeHateResult, (item) => {
                    return item.result.like
                  }).reverse(), (cell, id) =>
                  <LikeHateCell
                    key={id}
                    bgColor={cell.color}
                  >
                    <div>
                      <p>喜歡: {(cell.result.like * 100).toFixed(2)} %</p>
                      <p>討厭: {(cell.result.hate * 100).toFixed(2)} %</p>
                    </div>
                  </LikeHateCell>
                ) : null
              }
            </ResultCellList>
            <ResultCellList>
              {
                this.state.showGradient
                ? _.map(this.state.GradientResult, (cell, id) =>
                  <GradientCell
                    key={id}
                    bgColorFirst={cell.firstColor}
                    bgColorSecond={cell.secondColor}
                  >
                    <div>
                      <p><span role="img" aria-label="first">☝️</span> color: {cell.firstColor}</p>
                      <p><span role="img" aria-label="second">✌️</span> color: {cell.secondColor}</p>
                    </div>
                  </GradientCell>
                ) : null
              }
            </ResultCellList>
        </div>
      </div>
    );
  }
}

export default App;
