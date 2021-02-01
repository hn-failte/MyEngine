import React, { Suspense } from "react";
import BaseComponent from "./components/BaseComponent";
import widgets from "./widgets";

export default class Engine extends BaseComponent {
  render() {
    const { template } = this.props;
    const renderWidget = root => {
      const { key, widget, children } = root;
      if (key && widget) {
        const Widget = widgets[widget];
        return <Widget></Widget>;
      }
      if (children) {
        children.forEach(child => renderWidget(child));
      }
    };
    return (
      <>
        {template ? (
          <div>
            <Suspense fallback={false}>{renderWidget(template)}</Suspense>
          </div>
        ) : (
          <div>Invalid Template</div>
        )}
      </>
    );
  }
}
