import { AppRoutes, RoutesObj } from '@lib/routes/appRouter.type'
import { AppRoutesList, ContentRoutesList, TaskPaneRouterList } from '@lib/routes/routes.enum'

const createRouteObj = (routesList: RoutesObj) => {
  return Object.values(routesList).reduce<AppRoutes>((acc, route) => {
    return { ...acc, [route.path]: route.elem }
  }, {})
}

const appRouter: AppRoutes = createRouteObj(AppRoutesList)

const taskPaneRouter: AppRoutes = createRouteObj(TaskPaneRouterList)

const contentRouter: AppRoutes = createRouteObj(ContentRoutesList)

export { appRouter, taskPaneRouter, contentRouter }
