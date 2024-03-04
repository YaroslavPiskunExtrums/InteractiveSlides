import React, { LazyExoticComponent, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.sass'

import { debug } from './lib/log'
import { IAddinFigure } from './types/IAddinFigure'
import FiguresPage from './pages/figures/figures.page'
import 'react-toastify/dist/ReactToastify.css'
import SaveButtonContainer from './pages/save-button/save-button'
import Notes from './pages/notes/notes'
import FinishPresentationButtonContainer from '@src/pages/finish-presentaion/finish-presentation'

let presentation: {
  slides: { figures: IAddinFigure[]; figuresHolder: string; width: number; height: number }[]
  title: string
  slidesCount?: number
  addinFigures: IAddinFigure[]
  session: string
  saved: string
  save_color: string
  readonly?: boolean
} = null

const pageLoader: Record<string, () => LazyExoticComponent<any>> = {
  NotFound: () => React.lazy(() => import('./pages/not-found/not-found.page')),
}

async function init() {
  // if (__configuration) {
  //   debug('Avoid loading configuration, already loaded')
  //   return
  // }

  presentation = (window as any).presentation

  if (presentation) {
    presentation.slides.forEach((slide, i) => {
      const slot = document.getElementById(slide.figuresHolder) as HTMLElement
      const root = createRoot(slot)

      if (slot && root) {
        root.render(
          <Suspense fallback={<div>Loading...</div>}>
            <FiguresPage
              width={slide.width}
              height={slide.height}
              addinFigures={slide.figures}
              key={i}
              slide={i + 1}
            />
          </Suspense>
        )
      }
    })
  }

  const saveButtonSlot = document.getElementById('save-button') as HTMLElement
  const root = createRoot(saveButtonSlot)
  root.render(
    <Suspense fallback={<div>Loading...</div>}>
      <SaveButtonContainer buttonColor={presentation.save_color} />
      <FinishPresentationButtonContainer buttonColor={presentation.save_color} />
      <Notes buttonColor={presentation.save_color} />
    </Suspense>
  )
}

if (!(window as any).presentation) {
  Object.defineProperty(window, 'presentation', {
    get: function () {
      return presentation
    },
    set: function (value) {
      ;(window as any).presentation = value
      init().catch(debug)
    },
  })
} else {
  init().catch(debug)
}
