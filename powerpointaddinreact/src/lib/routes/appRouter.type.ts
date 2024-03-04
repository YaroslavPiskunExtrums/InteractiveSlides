export interface Route {
  elem: JSX.Element
  path: string
}

export interface AppRoutes {
  [x: string]: JSX.Element
}

export interface RoutesObj {
  [x: string]: Route
}

export interface TaskPaneRoutes extends RoutesObj {
  getStart: Route
  login: Route
  registration: Route
  presentationRename: Route
  preview: Route
  submitPresentation: Route
}

export interface ContentRoutes extends RoutesObj {
  getStart: Route
  figureList: Route
  multipleChoiceSetting: Route
  multipleChoiceFigure: Route
  rangeSelectorSetting: Route
  rangeSelectorFigure: Route
  openFieldSetting: Route
  openFieldFigure: Route
  customerDetailSetting: Route
  customerDetailFigure: Route
  addButtonSetting: Route
  addButtonFigure: Route
  calculatorSetting: Route
  calculatorFigure: Route
  dateFieldSetting: Route
  dateFieldFigure: Route
  personalizationSetting: Route
  personalizationFigure: Route
}

export interface ApplicationRoutes extends RoutesObj {
  taskPane: Route
  content: Route
}
