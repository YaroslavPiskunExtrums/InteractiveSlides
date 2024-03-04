// OfficeExtension.config.extendedErrorLogging = true

Office.onReady(async function(info) {
  $(function() {
    if (!localStorage.getItem('slides-tokens')) {
      redirectToLoginPage()
    }


    const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const logoutButton = document.getElementById('logout-button')

    const submitBtn = document.getElementById('submitBtn')
    const presentationNameInput = document.getElementById('presentation-name-input')
    const updateBtn = document.getElementById('updateBtn')
    const presentationName = document.getElementById('presentationName')

    const previewPresentationHolder = document.getElementById('preview-presentation')


    const loader = document.getElementById('loader')

    OfficeExtension.config.extendedErrorLogging = true
    let presentationNameSetting = Office.context.document.settings.get('presentationName')
    if(presentationName) {
      if (presentationNameSetting) {
        presentationName.value = presentationNameSetting
      } else {
        presentationName.value = Office.context.document.url.split('/').at(-1).split('.')[0]
      }
    }


    if(presentationName && previewPresentationHolder && presentationNameInput && submitBtn && updateBtn && loader) {
      if (Office.context.document.settings.get('uploadedLink')) {
        previewPresentationHolder.style.display = 'flex'
        presentationNameInput.style.display = 'none'
        submitBtn.style.display = 'none'
        updateBtn.style.display = 'block'
      } else {
        previewPresentationHolder.style.display = 'none'
        updateBtn.style.display = 'none'
        presentationNameInput.style.display = 'none'
      }
    }

    if (!validatePresentationUniqueID(retrievePresentationUniqueID()))
      createPresentationUniqueID()

    // add click event to the submit button
    $('#submitBtn').on('click', async function() {
      // empty the status text
      $('#blob-status').html('')


      if (presentationNameSetting) {
        await authFetch(`${apiUrl}/api/TaskPanelAddIn/rename-presentation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: presentationName.value,
            uniqueID: retrievePresentationUniqueID(),
          }),
        })
        Office.context.document.settings.set('presentationName', presentationName.value)
        Office.context.document.settings.saveAsync(function(asyncResult) {
          console.log('Presentation name change with status: ' + asyncResult.status)
        })
      }

      // get presentation BLOB and save to the server
      // this is all done asynchronously
      // once everything success it calls closeFile and at that time needs to send embedded object info
      // need to generate a new date/time
      const curDateTime = calcCurrentDateTime()

      await authFetch(`${apiUrl}/api/TaskPanelAddIn/clean-presentation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uniqueID: retrievePresentationUniqueID(),
        }),
      })

      sendFile(curDateTime)
    },
    )


    $('#updateBtn').on('click', async function() {
      presentationNameInput.style.display = 'block'
      submitBtn.style.display = 'block'
      updateBtn.style.display = 'none'
    })

    $('#logout-button').on('click', async function() {
      localStorage.removeItem('slides-tokens')
      redirectToLoginPage()
    })

    const tokens = localStorage.getItem('slides-tokens')

    if (tokens) {
      const accessTokenData = JSON.parse(atob(accessToken.split('.')[1]))
      $('#account-name').text(accessTokenData.username)

      if(!!accessTokenData.is_super_user) {
        $('.control-panel-bottom-panel').show()

        $('#admin-button').on('click', async function() {
          redirectToPage('admin-login.html')
        })

        $('#admin-back-button').on('click', async function() {
          history.length ? history.back() : redirectToPage('login.html')
        })

        $("#login-hash-btn").on('click', async function() {
          const userHash = $("#userHash").val()
          const userResponse = await authFetch(`${apiUrl}/api/super-user/login-hash-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: accessTokenData.id,
              hash: userHash,
            })
          })
          const userData = await userResponse.json()

          if(userData) {
            accessToken = userData.accessToken
            refreshToken  = userData.refreshToken
            localStorage.setItem('slides-tokens', JSON.stringify(userData))
            redirectToPage('login.html')
          }

        })
      }


    }




    $('#open-presentation').on('click', async function() {
      const link = Office.context.document.settings.get('uploadedLink')
      Office.context.ui.displayDialogAsync(`${link}`, {
        height: 720,
        width: 1280,
      }, function(asyncResult) {
        console.log('OPEN NEW WINDOW RESULT', asyncResult)
      })
    })

    $('#copy-to-clipboard').on('click', async function() {
      const link = Office.context.document.settings.get('uploadedLink')
      await navigator.clipboard.writeText(`${link}`)

      const copyIcon = document.getElementById('copy-to-clipboard-copy-icon')
      const copiedIcon = document.getElementById('copy-to-clipboard-copied-icon')

      copyIcon.style.display = 'none'
      copiedIcon.style.display = 'block'
      await sleep(1000)
      copyIcon.style.display = 'block'
      copiedIcon.style.display = 'none'
    })

    // Create a function for writing to the status div.
    function updateStatus(message) {
      var curStatusHTML = $('#blob-status').html()
      $('#blob-status').html(curStatusHTML + message + '</br>')
      console.log(message)
    }

    function b64EncodeUnicode(str) {
      return btoa(encodeURIComponent(str))
    }

    function UnicodeDecodeB64(str) {
      return decodeURIComponent(atob(str))
    }

    // send blob slices to the server
    function sendSlice(slice, state, curDateTime) {
      var data = slice.data

      // If the slice contains data, create an HTTP request.
      if (data) {
        var fileData = b64EncodeUnicode(data)

        var dataToSend = {
          dateTime: curDateTime,
          idx: slice.index,
          uniqueID: retrievePresentationUniqueID(),
          base64BlobData: fileData,
        }

        // validate the presentation unique id, if not valid, then return
        if (!validatePresentationUniqueID(dataToSend.uniqueID)) {
          updateStatus('Invalid presentation unique id, stop sending blob.')
          closeFile(state)
          return
        }


        refreshAccessToken().then(() => {
          // Create a new HTTP request. You need to send the request
          // to a webpage that can receive a post.
          const xhttp = new XMLHttpRequest()
          loader.style.display = 'block'
          // Create a handler function to update the status
          // when the request has been sent.
          xhttp.onreadystatechange = function() {
            if (this.readyState === XMLHttpRequest.DONE) {
              if (this.status === 200) {
                updateStatus('Sent ' + slice.size + ' bytes.')
                state.counter++

                if (state.counter < state.sliceCount) {
                  getSlice(state, curDateTime)
                } else {
                  closeFile(state)

                  updateStatus('Retrieving embedded object info.')
                  // collect addin object information, and send it to the server
                  retrieveEmbeddedObjInfo().then(function(embeddedObjInfo) {
                    sendEmbeddedObjInfo(embeddedObjInfo, curDateTime)
                  })
                }
              } else {
                updateStatus('Sending blob failed.')
                console.log(this.responseText, this.status)
              }
            }
          }

          xhttp.open('POST', `${apiUrl}/api/TaskPanelAddIn/SaveBlob`, true)
          xhttp.setRequestHeader('Content-type', 'application/json')
          xhttp.setRequestHeader('Authorization', accessToken)

          // Send the file as the body of an HTTP POST
          // request to the web server.
          xhttp.send(JSON.stringify(dataToSend))
        }).catch(e => console.log(e))

      }
    }

    // Get a slice from the file and then call sendSlice.
    function getSlice(state, curDateTime) {
      state.file.getSliceAsync(state.counter, function(result) {
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          updateStatus('Sending piece ' + (state.counter + 1) + ' of ' + state.sliceCount)
          sendSlice(result.value, state, curDateTime)
        } else {
          updateStatus(result.status)
        }
      })
    }

    // Although the Office Add-ins sandbox garbage collects out-of-scope references to files,
    // it's still a best practice to explicitly close files.
    function closeFile(state) {
      // Close the file when you're done with it.
      state.file.closeAsync(function(result) {

        // If the result returns as a success, the
        // file has been successfully closed.
        if (result.status === Office.AsyncResultStatus.Succeeded) {
          updateStatus('File closed.')
        } else {
          updateStatus('File couldn\'t be closed.')
        }
      })
    }

    // Get all of the content from a PowerPoint document in 100-KB chunks of text.
    function sendFile(curDateTime) {
      Office.context.document.getFileAsync('compressed',
        { sliceSize: 100000 },
        function(result) {

          if (result.status === Office.AsyncResultStatus.Succeeded) {

            // Get the File object from the result.
            var myFile = result.value
            var state = {
              file: myFile,
              counter: 0,
              sliceCount: myFile.sliceCount,
            }

            updateStatus('Getting file of ' + myFile.size + ' bytes')
            getSlice(state, curDateTime)
          } else {
            updateStatus(result.status)
          }
        })
    }

    // send content addin information to the server
    function sendEmbeddedObjInfo(embeddedObjInfo, curDateTime) {

      updateStatus('Sending embedded object info.')
      let presentationItemsConfig = localStorage.getItem('presentationItems')

      if (presentationItemsConfig) {
        presentationItemsConfig = JSON.parse(presentationItemsConfig)
      } else {
        presentationItemsConfig = []
      }


      embeddedObjInfo.forEach(slide => {
        slide.forEach(shape => {
          shape.config = presentationItemsConfig.find(item => item.name === shape.name)?.config
        })
      })

      var dataToSend = {
        dateTime: curDateTime,
        uniqueID: retrievePresentationUniqueID(),
        embeddedObjInfo: embeddedObjInfo,
      }


      console.log(dataToSend)
      // validate the presentation unique id, if not valid, then return
      if (!validatePresentationUniqueID(dataToSend.uniqueID)) {
        updateStatus('Invalid presentation unique id, stop sending embedded obj info.')
        return
      }

      // Create a new HTTP request. You need to send the request
      // to a webpage that can receive a post.
      var xhttp = new XMLHttpRequest()

      // Create a handler function to update the status
      // when the request has been sent.
      xhttp.onreadystatechange = function() {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            updateStatus('Sending embedded object info success.')
            authFetch(`${apiUrl}/api/TaskPanelAddIn/finish-presentation`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                dateTime: curDateTime,
                uniqueID: retrievePresentationUniqueID(),
              }),
            }).then((response) => response.json()).then((data) => {
              if (data.success) {
                updateStatus('Presentation saving success.')
                Office.context.document.settings.set('uploadedLink', `${apiUrl}${data.link}`)
                Office.context.document.settings.saveAsync(function(asyncResult) {
                  console.log('Status uploading presentation: ' + asyncResult.status)
                })


              } else {
                updateStatus('Presentation saving failed.')
              }
              loader.style.display = 'none'
              presentationNameInput.style.display = 'none'
              submitBtn.style.display = 'none'
              updateBtn.style.display = 'block'
              previewPresentationHolder.style.display = 'flex'
            })
          } else {
            updateStatus('Sending embedded object info failed.')
            console.log(this.responseText, this.status)
          }

        }
      }


      xhttp.open('POST', `${apiUrl}/api/TaskPanelAddIn/SendEmbeddedObjInfo`, true)
      xhttp.setRequestHeader('Content-type', 'application/json')
      xhttp.setRequestHeader('Authorization', accessToken)
      // Send the file as the body of an HTTP POST
      // request to the web server.
      xhttp.send(JSON.stringify(dataToSend))
    }

  })
})

