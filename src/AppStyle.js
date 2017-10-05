import styled from 'styled-components';

let _WIDTH = '100vw'
let _DESKTOP = '1024px'
let _OFFSET = '20px'
export const Card = styled.div`
  background-color: ${props => props.bgColor ? props.bgColor : 'white'} !important;
`

export const ResultCellList = styled.div`
  display: flex;
  width: ${_WIDTH};
  max-width: 1024px;
  height: auto;
  flex-wrap: wrap;
`
export const LikeHateCell = styled.div`
  border-radius: 50%;
  width: calc(${_DESKTOP} / 4 - ${_OFFSET});
  height: calc(${_DESKTOP} / 4 - ${_OFFSET});
  padding: 20px;
  margin: calc(${_OFFSET} / 2);
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
  @media screen and (max-width: 768px) {
    width: calc(${_WIDTH} / 2 - ${_OFFSET});
    height: calc(${_WIDTH} / 2 - ${_OFFSET});
    > div {
      > p {
        font-size: 14px;
      }
    }
  }
`

export const GradientCell = styled.div`
  border-radius: 5px;
  width: calc(${_DESKTOP} / 4 - ${_OFFSET});
  height: calc((${_DESKTOP} / 4 - ${_OFFSET}) * 4 / 3);
  padding: 20px;
  margin: calc(${_OFFSET} / 2);
  background: linear-gradient(
                45deg,
                ${props => props.bgColorFirst ? props.bgColorFirst : 'grey'},
                ${props => props.bgColorSecond ? props.bgColorSecond : 'grey'});
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
  @media screen and (max-width: 768px) {
    width: calc(${_WIDTH} / 2 - ${_OFFSET});
    height: calc((${_WIDTH} / 2 - ${_OFFSET}) * 4 / 3);
  }
`

export const MyColorHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  > h1 {
    margin: 10px 0;
    margin-top: 50px;
    font-size: 60px;
    color: #02142B;

    background: -webkit-linear-gradient(135deg, #f9fc5a, #ed4236);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    @media screen and (max-width: 768px) {
      margin-top: 10px;
    }
  }
  > p {
    color: #829cce;
    margin: 5px 0;
    background: -webkit-linear-gradient(135deg, #f9fc5a, #ed4236);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  > div {
    display: flex;
    align-items: center;
    a {
      text-decoration: none;
      color: #50514F;
    }
    p {
      color: #50514F;
      cursor: pointer;
      border-radius: 10px;
      margin-right: 10px;
      padding: 5px 15px;
      border: 5px solid #DDD;
    }
  }
`

export const ColorSchemaCell = styled.div`
  border-radius: 5px;
  width: calc(${_DESKTOP} / 4 - 2 * ${_OFFSET});
  height: calc((${_DESKTOP} / 4 - ${_OFFSET}) * 4 / 3);
  padding: ${_OFFSET};
  margin: calc(${_OFFSET});
  background: linear-gradient(
                ${props => props.bgColorFirst ? props.bgColorFirst : 'grey'} 0%,
                ${props => props.bgColorFirst ? props.bgColorFirst : 'grey'} 25%,
                ${props => props.bgColorSecond ? props.bgColorSecond : 'grey'} 25%,
                ${props => props.bgColorSecond ? props.bgColorSecond : 'grey'} 50%,
                ${props => props.bgColorThird ? props.bgColorThird : 'grey'} 50%,
                ${props => props.bgColorThird ? props.bgColorThird : 'grey'} 75%,
                ${props => props.bgColorFour ? props.bgColorFour : 'grey'} 75%,
                ${props => props.bgColorFour ? props.bgColorFour : 'grey'});
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
  @media screen and (max-width: 768px) {
    width: calc(${_WIDTH} / 2 - ${_OFFSET});
    height: calc((${_WIDTH} / 2 - ${_OFFSET}) * 4 / 3);
  }
`

export const passStyle = { background: '#CCC', text: "#646464" };
export const successStyle = { background: '#0AF', text: "#FFFFFF" };
export const failStyle = { background: 'tomato', text: "#FFFFFF" };
