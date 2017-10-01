import styled from 'styled-components';

let _WIDTH = '100vw'
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
  width: calc(${_WIDTH} / 4 - ${_OFFSET});
  height: calc(${_WIDTH} / 4 - ${_OFFSET});
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
  }
`

export const GradientCell = styled.div`
  border-radius: 5px;
  width: calc(${_WIDTH} / 4 - ${_OFFSET});
  height: calc((${_WIDTH} / 4 - ${_OFFSET}) * 4 / 3);
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

export const passStyle = { background: '#CCC', text: "#646464" };
export const successStyle = { background: '#0AF', text: "#FFFFFF" };
export const failStyle = { background: 'tomato', text: "#FFFFFF" };
