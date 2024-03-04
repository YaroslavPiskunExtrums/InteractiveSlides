import { ApplicationRoutes, ContentRoutes, TaskPaneRoutes } from '@lib/routes/appRouter.type'
import GetStartTaskPane from '@pages/taskPane/GetStartTaskPane'
import Login from '@pages/taskPane/Login'
import Content from '@pages/content/Content'
import TaskPane from '@pages/taskPane/TaskPane'
import Registration from '@pages/taskPane/Registration'
import PresentationRename from '@pages/taskPane/PresentationRename'
import Preview from '@pages/taskPane/Preview'
import SubmitPresentation from '@pages/taskPane/SubmitPresentation'
import GetStartContent from '@pages/content/GetStartContent'
import FigureList from '@pages/content/FigureList'
import AddButtonSetting from '@pages/content/settings/AddButtonSetting'
import MultipleChoiceSetting from '@pages/content/settings/MultipleChoiceSetting'
import RangeSelectorSetting from '@pages/content/settings/RangeSelectorSetting'
import OpenFieldSetting from '@pages/content/settings/OpenFieldSetting'
import CustomerDetailsSetting from '@pages/content/settings/CustomerDetailsSetting'
import CalculatorSetting from '@pages/content/settings/CalculatorSetting'
import DateFieldSetting from '@pages/content/settings/DateFieldSetting'
import PersonalizationSetting from '@pages/content/settings/PersonalizationSetting'
import MultipleChoiceFigure from '@pages/content/figures/MultipleChoiceFigure'
import RangeSelectorFigure from '@pages/content/figures/RangeSelectorFigure'
import OpenFieldFigure from '@pages/content/figures/OpenFieldFigure'
import CustomerDetailsFigure from '@pages/content/figures/CustomerDetailsFigure'
import AddButtonFigure from '@pages/content/figures/AddButtonFigure'
import CalculatorFigure from '@pages/content/figures/CalculatorFigure'
import DateFieldFigure from '@pages/content/figures/DateFieldFigure'
import PersonalizationFigure from '@pages/content/figures/PersonalizationFigure'
import { FiguresEnum } from '@lib/constants/figures.constants'

export const AppRoutesList: ApplicationRoutes = {
  content: { path: '/content/', elem: <Content /> },
  taskPane: { path: '/taskPane/', elem: <TaskPane /> },
}

export const ContentRoutesList: ContentRoutes = {
  getStart: { path: '#getStart', elem: <GetStartContent /> },
  figureList: { path: '#figureList', elem: <FigureList /> },
  multipleChoiceSetting: {
    path: '#multipleChoiceSetting',
    elem: <MultipleChoiceSetting />,
  },
  multipleChoiceFigure: {
    path: '#multipleChoiceFigure',
    elem: <MultipleChoiceFigure />,
  },
  rangeSelectorSetting: {
    path: '#rangeSelectorSetting',
    elem: <RangeSelectorSetting />,
  },
  rangeSelectorFigure: {
    path: '#rangeSelectorFigure',
    elem: <RangeSelectorFigure />,
  },
  openFieldSetting: { path: '#openFieldSetting', elem: <OpenFieldSetting /> },
  openFieldFigure: { path: '#openFieldFigure', elem: <OpenFieldFigure /> },
  customerDetailSetting: {
    path: '#customerDetailSetting',
    elem: <CustomerDetailsSetting />,
  },
  customerDetailFigure: {
    path: '#customerDetailFigure',
    elem: <CustomerDetailsFigure />,
  },
  addButtonSetting: { path: '#addButtonSetting', elem: <AddButtonSetting /> },
  addButtonFigure: { path: '#addButtonFigure', elem: <AddButtonFigure /> },
  calculatorSetting: {
    path: '#calculatorSetting',
    elem: <CalculatorSetting />,
  },
  calculatorFigure: { path: '#calculatorFigure', elem: <CalculatorFigure /> },
  dateFieldSetting: { path: '#dateFieldSetting', elem: <DateFieldSetting /> },
  dateFieldFigure: { path: '#dateFieldFigure', elem: <DateFieldFigure /> },
  personalizationSetting: {
    path: '#personalizationSetting',
    elem: <PersonalizationSetting />,
  },
  personalizationFigure: {
    path: '#personalizationFigure',
    elem: <PersonalizationFigure />,
  },
}

export const TaskPaneRouterList: TaskPaneRoutes = {
  getStart: { path: '#getStart', elem: <GetStartTaskPane /> },
  login: { path: '#login', elem: <Login /> },
  registration: { path: '#registration', elem: <Registration /> },
  presentationRename: {
    path: '#presentationRename',
    elem: <PresentationRename />,
  },
  preview: { path: '#preview', elem: <Preview /> },
  submitPresentation: {
    path: '#submitPresentation',
    elem: <SubmitPresentation />,
  },
}

export const protectedRoutes = [
  TaskPaneRouterList.presentationRename.path,
  TaskPaneRouterList.preview.path,
  TaskPaneRouterList.submitPresentation.path,
]

export const contentFigureList = [
  {
    type: FiguresEnum.multipleChoice,
    link: ContentRoutesList.multipleChoiceFigure.path,
  },
  {
    type: FiguresEnum.rangeSelector,
    link: ContentRoutesList.rangeSelectorFigure.path,
  },
  { type: FiguresEnum.openField, link: ContentRoutesList.openFieldFigure.path },
  {
    type: FiguresEnum.customerDetails,
    link: ContentRoutesList.customerDetailFigure.path,
  },
  { type: FiguresEnum.addButton, link: ContentRoutesList.addButtonFigure.path },
  {
    type: FiguresEnum.calculator,
    link: ContentRoutesList.calculatorFigure.path,
  },
  { type: FiguresEnum.dateField, link: ContentRoutesList.dateFieldFigure.path },
  {
    type: FiguresEnum.personalization,
    link: ContentRoutesList.personalizationFigure.path,
  },
]

export const figuresSettingsList = [
  {
    id: 0,
    title: 'Multiple choice',
    link: ContentRoutesList.multipleChoiceSetting.path,
  },
  {
    id: 1,
    title: 'Range selector',
    link: ContentRoutesList.rangeSelectorSetting.path,
  },
  {
    id: 2,
    title: 'Open field',
    link: ContentRoutesList.openFieldSetting.path,
  },
  {
    id: 3,
    title: 'Customer details',
    link: ContentRoutesList.customerDetailSetting.path,
  },
  {
    id: 4,
    title: 'Add button',
    link: ContentRoutesList.addButtonSetting.path,
  },
  {
    id: 5,
    title: 'Calculator',
    link: ContentRoutesList.calculatorSetting.path,
  },
  {
    id: 6,
    title: 'Date field',
    link: ContentRoutesList.dateFieldSetting.path,
  },
  {
    id: 7,
    title: 'Customization element',
    link: ContentRoutesList.personalizationSetting.path,
  },
]
