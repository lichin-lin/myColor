import React, { Component } from 'react';
import _ from 'lodash';

import brain from 'brain.js/dist';
import Swing from 'react-swing';
import Notifications, {notify} from 'react-notify-toast';

import randomColor from 'randomcolor';
import chroma from 'chroma-js';

import {
  Card,
  ResultCellList,
  LikeHateCell,
  GradientCell,
  ColorSchemaCell,
  passStyle,
  successStyle,
  failStyle,
  MyColorHeader } from './AppStyle.js';
import GitHubButton from 'react-github-button'
import 'react-github-button/assets/style.css'
import './App.css';

function colorNetwork(color) {
  let colorRGB = {r: color[0]/255, g: color[1]/255, b: color[2]/255}
  return colorRGB
}
class App extends Component {
  constructor(props, context) {
      super(props, context);
      this.show = notify.createShowQueue();
      this.state = {
          stack: null,
          trainData: [],
          likeHateResult: [],
          showLikeHate: false,
          GradientResult: [],
          showGradient: false,
          colorSchemaResult: [],
          showColorSchema: false,
          colorList: randomColor({count: 20}),
          net: '',
          modalIsOpen: false
      };
      this.openModal = this.openModal.bind(this);
      this.afterOpenModal = this.afterOpenModal.bind(this);
      this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }
  closeModal() {
    this.setState({modalIsOpen: false});
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
      this.show("😱 不喜翻 bye", "custom", 1000, failStyle);
    } else if (e.throwDirection === Swing.DIRECTION.RIGHT) {
      _data.output.like = 1;
      this.show("🚀 喜翻 like", "custom", 1000, successStyle);
    } else {
      this.show('跳過 pass', "custom", 1000, passStyle);
    }
    this.state.trainData.push(_data);
  }
  startTrain () {
    if (this.state.trainData.length < 5) {
      this.show('再多滑幾張增加準確度, swipe more for better result', "custom", 3000, passStyle);
      return;
    } else {
      var net = new brain.NeuralNetwork();

      net.train([
        // {input: { r: 255/255, g: 165/255, b: 0 }, output: {like: 0, hate: 0}},  // orange
        // {input: { r: 238/255, g: 130/255, b: 238/255 }, output: {like: 0, hate: 0}},  // violet
        {input: { r: 255/255, g: 255/255, b: 0/255 }, output: {like: 0, hate: 0}},  // yellow
        {input: { r: 255/255, g: 0/255, b: 255/255 }, output: {like: 0, hate: 0}},  // magenta
        {input: { r: 0/255, g: 255/255, b: 255/255 }, output: {like: 0, hate: 0}},  // cyan
        {input: { r: 0/255, g: 255/255, b: 0/255 }, output: {like: 0, hate: 0}},  // green
        {input: { r: 255/255, g: 0/255, b: 0/255 }, output: {like: 0, hate: 0}},  // red
        {input: { r: 0/255, g: 0/255, b: 255/255 }, output: {like: 0, hate: 0}},  // blue
      ].concat(this.state.trainData), {
        // log: true
      });
      this.setState({
        net: net
      })
      this.show("🚂 🚂 🚂 Training Finish", "custom", 1000, successStyle);
    }
  }

  likeHateResult () {
    let testData = randomColor({ count: 40 });
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
      showColorSchema: false
    })
    this.show("like/hate 訓練結束", "custom", 3000, successStyle);
  }

  GradientResult () {
    let GradientResult = []
    let likeThreshold = 0.5;
    let hateThreshold = 0.25;
    let FAIL_SAFE = 0;
    for (let i = 0; i < 40; i++) {
      let colors = randomColor({ count: 2 });
      let fC = chroma(colors[0]).rgb()
      let sC = chroma(colors[1]).rgb()
      while (
        FAIL_SAFE < 10000 &&
        (this.state.net.run(colorNetwork(fC)).like < likeThreshold ||
        this.state.net.run(colorNetwork(sC)).like < likeThreshold) ||
        (this.state.net.run(colorNetwork(fC)).hate > hateThreshold ||
        this.state.net.run(colorNetwork(sC)).hate > hateThreshold)
      ) {
        let tryColors = randomColor({ count: 2 });
        fC = chroma(tryColors[0]).rgb();
        sC = chroma(tryColors[1]).rgb();
        FAIL_SAFE++;
        console.log(FAIL_SAFE, '/10000');
      }
      if (FAIL_SAFE >= 20000) {
        this.show("😱 出了狀況重整網頁再來一次, refresh the page and do it again!", "custom", -1, failStyle);
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
      showGradient: true,
      showColorSchema: false
    })
    this.show("Gradient 訓練結束", "custom", 3000, successStyle);
  }
  colorSchemaResult () {
    console.log('yo');
    let ColorSchemaResult = []
    let likeThreshold = 0.25;
    let hateThreshold = 0.25;
    let FAIL_SAFE = 0;
    for (let i = 0; i < 8; i++) {
      let colors = randomColor({ count: 4 });
      let fC = chroma(colors[0]).rgb()
      let sC = chroma(colors[1]).rgb()
      let tC = chroma(colors[2]).rgb()
      let foC = chroma(colors[3]).rgb()
      while (
        FAIL_SAFE < 10000 &&
        (this.state.net.run(colorNetwork(fC)).like < likeThreshold ||
        this.state.net.run(colorNetwork(sC)).like < likeThreshold ||
        this.state.net.run(colorNetwork(tC)).like < likeThreshold ||
        this.state.net.run(colorNetwork(foC)).like < likeThreshold) ||
        (this.state.net.run(colorNetwork(fC)).hate > hateThreshold ||
        this.state.net.run(colorNetwork(sC)).hate > hateThreshold ||
        this.state.net.run(colorNetwork(tC)).hate > hateThreshold ||
        this.state.net.run(colorNetwork(foC)).hate > hateThreshold)
      ) {
        let tryColors = randomColor({ count: 4 });
        fC = chroma(tryColors[0]).rgb();
        sC = chroma(tryColors[1]).rgb();
        tC = chroma(tryColors[2]).rgb();
        foC = chroma(tryColors[3]).rgb();
        FAIL_SAFE++;
        console.log(FAIL_SAFE, '/10000');
      }
      if (FAIL_SAFE >= 20000) {
        this.show("😱 出了狀況重整網頁再來一次, refresh the page and do it again!", "custom", -1, failStyle);
        return;
      }
      ColorSchemaResult.push({
        firstColor: chroma(fC).hex(),
        secondColor: chroma(sC).hex(),
        thirdColor: chroma(tC).hex(),
        fourColor: chroma(foC).hex(),
        firstColorResult: this.state.net.run(colorNetwork(fC)),
        secondColorResult: this.state.net.run(colorNetwork(sC)),
        thirdColorResult: this.state.net.run(colorNetwork(tC)),
        fourColorResult: this.state.net.run(colorNetwork(foC)),
      })
    }
    this.setState({
      colorSchemaResult: ColorSchemaResult,
      showLikeHate: false,
      showGradient: false,
      showColorSchema: true
    })
  }
  render() {
    console.log(this.state)
    return (
      <div className="App">
        <Notifications />
        <div>
            <MyColorHeader>
              <h1>myColor</h1>
              <p>swipe the cards left or right,<br/> let neural network generate lovely colors for you.</p>
              <div>
                <a href="https://github.com/lichin-lin/myColor#how-to" target="_blank"><p>使用說明 docs</p></a>
              <GitHubButton type="stargazers" size="large" namespace="lichin-lin" repo="myColor" />
              </div>
            </MyColorHeader>
            <div id="viewport">
                <Swing
                    className="stack"
                    tagName="div"
                    setStack={(stack)=> this.setState({stack:stack})}
                    ref="stack">
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
                  <span role="img" aria-label="train">🚂</span>
                <p>Train Colors</p>
                </button>
                <button type="button" onClick={this.likeHateResult.bind(this)}>
                  <p><span role="img" aria-label="like">👍</span> / <span role="img" aria-label="hate">👎</span> Favor</p>
                </button>
                <button type="button" onClick={this.GradientResult.bind(this)}>
                  <p><span role="img" aria-label="gradient">🔷</span> Gradient</p>
                </button>
                <button type="button" onClick={this.colorSchemaResult.bind(this)}>
                  <p><span role="img" aria-label="colorSchema">🌈</span> colorSchema</p>
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
                      <p>喜歡: {(cell.result.like * 100).toFixed(1)} %</p>
                      <p>討厭: {(cell.result.hate * 100).toFixed(1)} %</p>
                      <p>color: {cell.color}</p>
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
            <ResultCellList>
              {
                this.state.showColorSchema
                ? _.map(this.state.colorSchemaResult, (cell, id) =>
                  <ColorSchemaCell
                    key={id}
                    bgColorFirst={cell.firstColor}
                    bgColorSecond={cell.secondColor}
                    bgColorThird={cell.thirdColor}
                    bgColorFour={cell.fourColor}
                  >
                    <div>
                      <p><span role="img" aria-label="first">1️⃣</span> : {cell.firstColor}</p>
                      <p><span role="img" aria-label="second">2️⃣</span> : {cell.secondColor}</p>
                      <p><span role="img" aria-label="third">3️⃣</span> : {cell.thirdColor}</p>
                      <p><span role="img" aria-label="four">4️⃣</span> : {cell.fourColor}</p>
                    </div>
                  </ColorSchemaCell>
                ) : null
              }
            </ResultCellList>
        </div>
      </div>
    );
  }
}

export default App;
