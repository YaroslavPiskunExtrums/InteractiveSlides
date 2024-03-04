import { HttpError } from '@lib/utils/middlewares/http-error.js'
import cors from 'cors'
import express from 'express'
import { Application, Router } from 'express'
import 'express-async-errors'
import path from 'path'
import { contentAddIn } from '@app/routes/content-add-in/router.js'
import { deviceIdRouter } from '@app/routes/device-id/router.js'
import { createHtmlRouter } from '@app/routes/html/router.js'
import { errorMiddleware } from '@lib/express.js'
import { createAuthMiddleware, roleMiddleware } from '@lib/utils/middlewares/auth.middleware.js'
import { injectTraceID } from '@lib/utils/middlewares/trace.middleware.js'
import { taskpanelAddInController } from '@app/routes/taskpanel-add-in/router.js'
import { authRouter } from '@app/routes/auth/router.js'
import { companiesRouter } from '@app/routes/companies/router.js'
import { createIntegrationsRouter } from '@app/routes/integrations/router.js'
import * as process from 'process'
import { createSaasUsersRouter } from '@app/routes/saas-users/router.js'
import { superUserRouter } from '@app/routes/super-user/router.js'
import { slidesNotesRouter } from '@app/routes/slides-notes/router.js'
import { RoleEnum } from './lib/constants/Roles.js'
import { tagsRouter } from './routes/tags/routes.js'
import { SendGridService } from './lib/services/email/email.service.js'
import { userRouter } from './routes/user/router.js'

function createSystemRoutes(): Router {
  const router = Router()

  router.use('/', createAuthMiddleware())

  return router
}

export async function createServer(): Promise<Application> {

  const app = express()

  app.set('view engine', 'ejs')


  app.use(
    // cors({
    //   origin: function(origin, callback) {
    //     if (origin && /localhost/.test(origin)) {
    //       callback(null, origin)
    //     } else {
    //       callback(null, false)
    //     }
    //   },
    // }),
    cors(),
  )


  app.use((req, res, next) => {
    console.log("REQUEST URL__", req.url)
    if (req.url.startsWith('//')) {
      req.url = req.url.replace(/\/+/g, '/')
    }
    next()
  })

  app.use(express.json({ limit: '20mb' }))
  app.use(injectTraceID())


  app.get('/api/health', (req, res) => {
    res.send('OK')
  })
  app.get('/hubspot/webhook', (req, res) => {

    console.log('req.query', req.query)

    const { hs_object_id, name, userId, portalId } = req.query as {
      hs_object_id: string,
      name: string,
      userId: string,
      portalId: string
    }

    const companyName = encodeURIComponent(name)
    const user_Id = encodeURIComponent(userId)
    const hsObjectId = encodeURIComponent(hs_object_id)
    const portal_Id = encodeURIComponent(portalId)

    res.json(
      {
        'primaryAction': {
          'type': 'IFRAME',
          'width': 890,
          'height': 748,
          'uri': `${process.env.SELF_HOST}/api/integrations/hubspot/get-company-sessions?name=${companyName}&userId=${user_Id}&hs_object_id=${hsObjectId}&portalId=${portal_Id}`,
          'label': 'Presentation Sessions',
        },
      },
    )
  })
  app.get('/hubspot/webhook/deals', (req, res) => {

    console.log('DEALS QUERY', req.query)

    const { hs_object_id, dealname, userId, portalId } = req.query as { hs_object_id: string, dealname: string, userId: string, portalId: string }


    // const { hs_object_id, name, userId } = req.query as { hs_object_id: string, name: string, userId: string }

    const dealName = encodeURIComponent(dealname)
    const user_Id = encodeURIComponent(userId)
    const hsObjectId = encodeURIComponent(hs_object_id)
    const portal_Id = encodeURIComponent(portalId)

    res.json(
      {
        'primaryAction': {
          'type': 'IFRAME',
          'width': 890,
          'height': 748,
          'uri': `${process.env.SELF_HOST}/api/integrations/hubspot/get-deals-sessions?name=${dealName}&userId=${user_Id}&hs_object_id=${hsObjectId}&portalId=${portal_Id}`,
          'label': 'Presentation Sessions',
        },
      },
    )
  })
  app.get('/', express.static(path.join(process.cwd(), 'public', 'index.html')))


  app.use('/api/HTML', createHtmlRouter())
  app.use('/api/DeviceID', deviceIdRouter())
  app.use('/api/ContentAddIn', contentAddIn())
  app.use('/api/TaskPanelAddIn', createAuthMiddleware(), taskpanelAddInController())
  app.use('/api/auth', authRouter())




  app.use('/api/companies', companiesRouter())
  app.use('/api/integrations', createIntegrationsRouter())
  app.use('/api/saas-users', createSaasUsersRouter())
  app.use('/api/super-user', roleMiddleware([RoleEnum.ADMIN]), superUserRouter())
  app.use('/api/slide-note', slidesNotesRouter())
  app.use('/api/tags', createAuthMiddleware(), tagsRouter())

  app.use('/api/user', userRouter())


  app.use('/', express.static(path.join(process.cwd(), 'public')))


  app.all('**', (req, res) => {
    throw new HttpError(404, `[CCS] Route is not found`, { path: req.path })
  })

  app.use(errorMiddleware)

  return app
}
