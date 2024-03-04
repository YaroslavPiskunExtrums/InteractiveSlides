const SALESMATIONDEVICEID_KEY = 'SalesmationDeviceID'
const SALESMATIONADDINID_KEY = 'SalesmationAddinID'
const IDTOKENSPLITER = '|'

function generateSalesmationDeviceID() {

  const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`


  // need to get a generated unique device id from the server, after that create unique id
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (this.status == 200) {
        // save id to the localstorage...
        localStorage.setItem(SALESMATIONDEVICEID_KEY, JSON.parse(this.responseText).deviceId)
        createPresentationUniqueID()
      } else {
        console.log(this.responseText, this.status)
      }
    }
  }
  xhttp.open('POST', `${apiUrl}/api/DeviceID/GenerateDeviceId`, true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send()

}

function generateTempPresentationUrl(deviceId) {
  const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`

  // need to get a temp generated unique id from the server
  var xhttp = new XMLHttpRequest()
  xhttp.onreadystatechange = function() {
    if (this.readyState == XMLHttpRequest.DONE) {
      if (this.status == 200) {
        // using `|` for spliting tokens in the unique id
        savePresentationUniqueID(deviceId + IDTOKENSPLITER + JSON.parse(this.responseText).tempUrl)
      } else {
        console.log(this.responseText, this.status)
      }
    }
  }
  xhttp.open('POST', `${apiUrl}/api/DeviceID/GenerateTempPresentationUrl`, true)
  xhttp.setRequestHeader('Content-type', 'application/json')
  xhttp.send()

}

// retrieve device id from localstorage
function retrieveDeviceID() {
  return localStorage.getItem(SALESMATIONDEVICEID_KEY)
}

// create and save unique id
function createPresentationUniqueID() {
  var deviceId = retrieveDeviceID()
  if (deviceId == null) {
    generateSalesmationDeviceID()
  } else {
    if (Office.context.document.url !== '')
      savePresentationUniqueID(deviceId + IDTOKENSPLITER + Office.context.document.url)
    else
      generateTempPresentationUrl(deviceId)
  }
}

// save unique id to office settings
function savePresentationUniqueID(uniqueID) {
  Office.context.document.settings.set(SALESMATIONADDINID_KEY, uniqueID)
  Office.context.document.settings.saveAsync(function(asyncResult) {
    console.log('Presentation Unique ID saved with status: ' + asyncResult.status)
  })
}

// retrieve unique id from office settings, if there is no saved unique id, null will be returned
function retrievePresentationUniqueID() {
  return Office.context.document.settings.get(SALESMATIONADDINID_KEY)
}

function validateDeviceID(deviceID) {
  if (retrieveDeviceID() !== deviceID)
    return false
  return true
}

function validatePresentationUrl(url) {
  if (Office.context.document.url == '' && url != '')
    return true
  if (Office.context.document.url != url)
    return false
  return true
}

// validate unique id with the url
function validatePresentationUniqueID(uniqueID) {
  if (uniqueID == null)
    return false
  var idTokens = uniqueID.split(IDTOKENSPLITER)
  if (idTokens.length < 2) {
    return false
  } else {
    return validateDeviceID(idTokens[0]) && validatePresentationUrl(idTokens[1])
  }
}
