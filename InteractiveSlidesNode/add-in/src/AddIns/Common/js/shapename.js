const SALESMATION_SHAPE_NAME_PREFIX = 'slsmtn'
const SALESMATION_SHAPE_NAME_KEY = 'slsmtn_shape_name_key'

// get the current date time string
function calcCurrentDateTime() {
  let currentDate = new Date()
  //month starts from 0
  let dateString = currentDate.getFullYear() + '-' + (currentDate.getMonth() + 1) + '-' + currentDate.getDate() + ' ' +
    currentDate.getHours() + ':' + currentDate.getMinutes() + ':' + currentDate.getSeconds() + '.' + currentDate.getMilliseconds()
  return dateString
}

// use powerpoint js api to set the shape name
// and return the shape name
// must use .then() to get the shape name
function setContentAddInName() {
  return new Promise(function(resolve, reject) {
    //PowerPoint.run(async function(context) {
    Office.context.document.getSelectedDataAsync(
      Office.CoercionType.SlideRange,
      async function(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
          console.log('The selected data is:', asyncResult.value)

          const { slides: [selectedSlide] } = asyncResult.value

          PowerPoint.run(async function(context) {

            const slides = context.presentation.slides

            await context.sync() // need to call context.sync() before calling the property
            let slide = slides.getItemAt(selectedSlide.index - 1)
            let shapes = slide.shapes
            let shapeCountResult = shapes.getCount()


            await context.sync() // need to call context.sync() before calling the property
            let shapeCount = shapeCountResult.value
            let shape = shapes.getItemAt(shapeCount - 1)
            shape.load('id,name,width,height,type,left,top')
            await context.sync()


            slide.load('shapes')

            await context.sync()


            const cachedName = retrieveShapeName()
            if (cachedName && cachedName.indexOf(SALESMATION_SHAPE_NAME_PREFIX) !== -1) {
              resolve(cachedName)
              return
            }

            shape.name = SALESMATION_SHAPE_NAME_PREFIX + '.' + calcCurrentDateTime()

            await context.sync()
            saveShapeName(shape.name)
            resolve(shape.name)
          })
        }
      },
    )
  })
}

function getLastShape() {
  return new Promise(function(resolve, reject) {
    //PowerPoint.run(async function(context) {
    Office.context.document.getSelectedDataAsync(
      Office.CoercionType.SlideRange,
      async function(asyncResult) {
        if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {

          const { slides: [selectedSlide] } = asyncResult.value

          PowerPoint.run(async function(context) {

            const slides = context.presentation.slides

            await context.sync() // need to call context.sync() before calling the property
            let slide = slides.getItemAt(selectedSlide.index - 1)
            let shapes = slide.shapes
            let shapeCountResult = shapes.getCount()

            await context.sync() // need to call context.sync() before calling the property
            let shapeCount = shapeCountResult.value
            let shape = shapes.getItemAt(shapeCount - 1)
            shape.load('id,name,width,height,type,left,top')
            await context.sync()
            if (!shape.name.startsWith(SALESMATION_SHAPE_NAME_PREFIX)) return null
            await context.sync()
            resolve({ name: shape.name, slide: selectedSlide.index - 1, id: shape.id })
          })
        }
      },
    )
  })
}

function renameLastShape(data, config) {
  console.log('config', config)
  const lsItems = localStorage.getItem('presentationItems')
  if (!data) return
  const item = { ...data, config }

  if (!lsItems) {
    localStorage.setItem('presentationItems', JSON.stringify([item]))
    return
  }

  const parsedLsItems = JSON.parse(lsItems)

  const copiedItem = parsedLsItems.find(lsItem => lsItem.name === item.name)

  const isShouldChangeName = Boolean(copiedItem)

  if (!isShouldChangeName) {
    localStorage.setItem('presentationItems', JSON.stringify([...parsedLsItems, item]))
    return
  }

  const newName = SALESMATION_SHAPE_NAME_PREFIX + '.' + calcCurrentDateTime()
  localStorage.setItem('presentationItems', JSON.stringify([
    ...parsedLsItems,
    { ...item, name: newName, config: copiedItem.config }
  ]))
  Office.context.document.getSelectedDataAsync(
    Office.CoercionType.SlideRange,
    async function(asyncResult) {
      if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {

        const { slides: [selectedSlide] } = asyncResult.value

        PowerPoint.run(async function(context) {

          const slides = context.presentation.slides

          await context.sync() // need to call context.sync() before calling the property
          let slide = slides.getItemAt(selectedSlide.index - 1)
          let shapes = slide.shapes
          let shapeCountResult = shapes.getCount()

          await context.sync() // need to call context.sync() before calling the property
          let shapeCount = shapeCountResult.value
          let shape = shapes.getItemAt(shapeCount - 1)
          shape.name = newName
          await context.sync()

        })
      }
    },
  )
}

// use powerpoint js api to retrieve all shape information - unsupported shapes because the addin shapes are unsupported
// and returns the info in promise
// must use .then() to get the info
function retrieveEmbeddedObjInfo() {
  return new OfficeExtension.Promise(function(resolve, reject) {
    PowerPoint.run(async function(context) {
      var embeddedObjInfo = []
      context.presentation.load('slides')
      await context.sync()

      const slides = context.presentation.slides

      const slideCountResult = slides.getCount()

      await context.sync() // need to call context.sync() before calling the property
      const slideCount = slideCountResult.value


      await context.sync()

      for (let i = 0; i < slideCount; i++) {
        let slideEmbeddedObjInfo = []
        let slide = slides.getItemAt(i)


        slide.load('shapes')

        await context.sync()

        let shapes = slide.shapes
        let shapeCountResult = shapes.getCount()


        await context.sync() // need to call context.sync() before calling the property
        let shapeCount = shapeCountResult.value

        for (var j = 0; j < shapeCount; j++) {
          let shape = shapes.getItemAt(j)


          shape.load('id,name,width,height,type,left,top')



          await context.sync()
          if (shape.type === 'Unsupported' && shape.name.startsWith(SALESMATION_SHAPE_NAME_PREFIX)) {





            slideEmbeddedObjInfo.push({
              name: shape.name,
              height: shape.height,
              width: shape.width,
              left: shape.left,
              top: shape.top,
            })
          }
        }
        embeddedObjInfo.push(slideEmbeddedObjInfo)
      }

      resolve(embeddedObjInfo)
    })
  })
}

// save shape name to the office settings
function saveShapeName(shapeName) {
  Office.context.document.settings.set(SALESMATION_SHAPE_NAME_KEY, shapeName)
  Office.context.document.settings.saveAsync(function(asyncResult) {
    console.log('Shape Name saved with status: ' + asyncResult.status)
  })
}


// retrieve shape name from the office settings
function retrieveShapeName() {
  return Office.context.document.settings.get(SALESMATION_SHAPE_NAME_KEY)
}

// validate the shape name
function validateShapeName(shapeName) {
  if (shapeName == null)
    return false
  if (shapeName.startsWith(SALESMATION_SHAPE_NAME_PREFIX))
    return true
  return false
}
