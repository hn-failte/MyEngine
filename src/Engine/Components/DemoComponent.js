import BaseComponent from "./BaseComponent";

export default class DemoComponent extends BaseComponent {
  render() {
    return 'DemoComponent';
  }
  componentDidMount() {
    super.componentDidMount();
  }
}
