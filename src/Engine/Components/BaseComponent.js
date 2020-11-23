import React from "react";
import { is } from "immutable";

export default class BaseComponent extends React.Component {
  state = {
    firstRender: false // 首次渲染
  };
  // React 性能优化
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    let thisState = this.state || {};
    let thisProps = this.props || {};
    nextProps = nextProps || {};
    nextState = nextState || {};
    if (
      Object.keys(thisState).length !== Object.keys(nextState).length ||
      Object.keys(thisProps).length !== Object.keys(nextProps).length
    ) {
      return true;
    }
    for (let key in nextProps) {
      if (!is(nextProps[key], thisProps[key])) {
        return true;
      }
    }
    for (let key in nextState) {
      if (!is(nextState[key], thisState[key])) {
        return true;
      }
    }
    return false;
  }
  componentDidUpdate(prevProps, prevState) {}
  componentDidMount() {
    this.setState({
      firstRender: true
    });
  }
  render() {
    return <>{this.props.children}</>;
  }
}
