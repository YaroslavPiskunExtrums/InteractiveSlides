const SALESMATION_CONTENT_STATUS_KEY = 'slsmtn_content_status_key'

function updateStatus() {
  // update the office settings
  saveStatusToOfficeSettings()
  // submit the status to the server
  submitStatus()
}


function updateElementsLabels(label) {
  let presentationLabels = Office.context.document.settings.get('labels-options')


  if (presentationLabels) {
    let labelIndex = presentationLabels.find(label => label === label)
    if (!labelIndex) {
      const labelsSelector = document.querySelectorAll('.labelsList')
      labelsSelector.forEach(function(label) {
        presentationLabels.forEach(function(presentationLabel) {
          label.innerHTML += `<option value='${presentationLabel}'>${presentationLabel}</option>`
        })
      })

      Office.context.document.settings.set('labels-options', [...presentationLabels, label])
      Office.context.document.settings.saveAsync()
    }
  }
}


function saveStatusToOfficeSettings() {
  Office.context.document.settings.set(SALESMATION_CONTENT_STATUS_KEY, config)
  Office.context.document.settings.saveAsync(function(asyncResult) {
    console.log('Content AddIn Status saved with status: ' + asyncResult.status)
  })
}

function validateStatus(status) {
  if (status != null)
    return true
  return false
}

function retrieveStatusFromOfficeSettings() {
  return Office.context.document.settings.get(SALESMATION_CONTENT_STATUS_KEY)
}

function submitStatus() {
  // const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`
  
  let presentationItems = localStorage.getItem('presentationItems')

  if (presentationItems) {
    presentationItems = JSON.parse(presentationItems)

    const presentationItem = presentationItems.find(item => item.name === retrieveShapeName())

    if (presentationItem) {
      presentationItem.config = config
      localStorage.setItem('presentationItems', JSON.stringify(presentationItems))
    }
    else {
      presentationItems.push({name: retrieveShapeName(), config})
      localStorage.setItem('presentationItems', JSON.stringify(presentationItems))
    }
  }
  else {
    localStorage.setItem('presentationItems', JSON.stringify([{name: retrieveShapeName(), config}]))
  }
  //
  // if (!validatePresentationUniqueID(dataToSend.uniqueID)) {
  //   console.log('Invalid presentation unique id, stop sending status.')
  //   return
  // }
  //
  // if (!validateShapeName(dataToSend.shapeName)) {
  //   console.log('Invalid shape name, stop sending status.')
  //   return
  // }
  //
  // // Create a new HTTP request. You need to send the request
  // // to a webpage that can receive a post.
  // var xhttp = new XMLHttpRequest()
  //
  // // Create a handler function to update the status
  // // when the request has been sent.
  // xhttp.onreadystatechange = function() {
  //   if (this.readyState === XMLHttpRequest.DONE) {
  //     if (this.status === 200) {
  //       console.log('Sending content addin status success.')
  //     } else {
  //       console.log(this.responseText, this.status)
  //     }
  //   }
  // }
  //
  // xhttp.open('POST', `${apiUrl}/api/ContentAddIn/UpdateAddInStatus`, true)
  // xhttp.setRequestHeader('Content-type', 'application/json')
  //
  // // Send the file as the body of an HTTP POST
  // // request to the web server.
  // xhttp.send(JSON.stringify(dataToSend))
}
