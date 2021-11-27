import "./Randomizer.css";
import "../../assets/odometer.js/odometer-theme-plaza.css";
import Odometer from "react-odometerjs";
import React from "react";

// const Randomizer = () => {

//   let number = 8;

//   const randomize = () => {
//     let min = Math.ceil(1);
//     let max = Math.floor(9);
//     number = Math.floor(Math.random() * (max - min)) + min;
//     console.log(number);
//   }

//   return (
//     <div>
//       <Odometer value={number} format="(ddd),dd" />
//       <button onClick={randomize}>Randomize</button>
//     </div>
//   )
// }

interface State {
 odometerValue: number;
 numbers: number[];
}

interface Props {
  numbers: number[];
 }

class Randomizer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      odometerValue: 0,
      numbers: []
    };
  }

  componentDidMount() {
    this.setState({ numbers: this.props.numbers });
  }

  randomize = () => {
    const numbers = [...this.state.numbers];
    const index = Math.floor(Math.random()*numbers.length);
    const odometerValue = numbers.splice(index, 1)[0];
    console.log('odometerValue', odometerValue);
    this.setState({ odometerValue, numbers }, () => {
      console.log(this.state)
    });
  }

  render() {
    const { odometerValue } = this.state;
    return (
      <div>
        <Odometer animation="count" format="d" duration={1000} value={odometerValue} />
        <button onClick={() => this.randomize()}>Randomize</button>
      </div>
    );
  }
}

export default Randomizer
