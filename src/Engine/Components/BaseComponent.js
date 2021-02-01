import React from "react";
import { is } from "immutable";

export default class BaseComponent extends React.Component {
  state = {
    firstRender: false, // 首次渲染
    value: void 0
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
  componentDidUpdate(prevProps, prevState) {
    this.didUpdate(prevProps, prevState, 'prevProps, prevState');
  }
  componentDidMount() {
    this.didMount(this.props, this.state, 'props, state');
    this.setState({
    });
  }
  didMount(props, state) {
    console.info("didMount", props, state);
  }
  didUpdate(prevProps, prevState) {
    console.info("didUpdate", prevProps, prevState);
  }
  onChange() {
    console.info("onChange");
  }
  render() {
    return <>{this.props.children}</>;
  }
}
