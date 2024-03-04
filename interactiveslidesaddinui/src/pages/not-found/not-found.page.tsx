import React from 'react'
import { notFoundPage } from './not-found.module.sass'

export default function NotFoundPage() {
  return (
    <div className={notFoundPage}>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  )
}
