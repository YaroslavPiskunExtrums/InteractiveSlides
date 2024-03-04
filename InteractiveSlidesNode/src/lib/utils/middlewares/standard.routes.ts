import { Router } from 'express'
import path from 'path'

export function createStandardRoutes(): Router {
  const router = Router()

  router.get('/robots.txt', (req, res) => {

    res.type('text/plain')
    res.send('User-agent: *\nAllow: /\nDisallow: /search')
  })

  router.get('/favicon.ico', (req, res) => {
    res.type('image/x-icon')
    res.sendFile(path.join(process.cwd(), 'public/favicon.ico'))
  })

  return router
}
