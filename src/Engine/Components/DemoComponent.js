import BaseComponent from "./BaseComponent";

export default class DemoComponent extends BaseComponent {
  render() {
    return +this.state.firstRender;
  }
}
