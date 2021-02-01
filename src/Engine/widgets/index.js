import { lazy } from "react";

const widgets = {
  Text: lazy(() => import("../components/Text"))
};

export default widgets;
