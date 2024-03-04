const finishForm = document.getElementById('finish-form')
const finishButton = document.getElementById('submit-btn')
const presentationStatus = document.getElementById('presentation-status')
const presentationName = document.getElementById('presentation-name')
const image = document.getElementById('image')
const loader = document.getElementById('loader')
Office.onReady(() => {

  $(function() {
    if (!localStorage.getItem('slides-tokens')) {
      redirectToLoginPage()
    }
    if (Office.context.document.settings.get('uploadedLink')) {
      redirectToPage('home.html')
      return
    }
    finishForm.onsubmit = (e) => {
      e.preventDefault()
    }

    loader.style.display = 'none'

    const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`


    let presentationNameSetting = Office.context.document.settings.get('presentationName')

    if (presentationNameSetting) {
      presentationName.value = presentationNameSetting
    } else {
      presentationName.value = Office.context.document.url.split(/[/\\]/g).at(-1).split('.')[0]
    }
    const tokens = localStorage.getItem('slides-tokens')

    if (tokens) {
      const accessTokenData = JSON.parse(atob(accessToken.split('.')[1]))
      $('#account-name').text(accessTokenData.username)

      if (!!accessTokenData.is_super_user) {
        $('.control-panel-bottom-panel').show()

        $('#admin-button').on('click', async function() {
          redirectToPage('admin-login.html')
        })

        $('#admin-back-button').on('click', async function() {
          history.length ? history.back() : redirectToPage('login.html')
        })

        $('#login-hash-btn').on('click', async function() {
          const userHash = $('#userHash').val()
          const userResponse = await authFetch(`${apiUrl}/api/super-user/login-hash-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: accessTokenData.id,
              hash: userHash,
            }),
          })
          const userData = await userResponse.json()

          if (userData) {
            accessToken = userData.accessToken
            refreshToken = userData.refreshToken
            localStorage.setItem('slides-tokens', JSON.stringify(userData))
            redirectToPage('login.html')
          }

        })
      }


    }


    $('#logout-button').on('click', async function() {
      localStorage.removeItem('slides-tokens')
      redirectToLoginPage()
    })


    finishButton.onclick = async (e) => {
      e.preventDefault()

      const sendData = {
        name: presentationName.value,
        uniqueID: retrievePresentationUniqueID(),
      }
      try {
        loader.style.display = 'block'
        const res = await authFetch(`${apiUrl}/api/TaskPanelAddIn/rename-presentation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(sendData),
        })
        Office.context.document.settings.set('presentationName', presentationName.value)
        Office.context.document.settings.saveAsync(function(asyncResult) {
          console.log('Presentation name change with status: ' + asyncResult.status)
        })
        loader.style.display = 'none'
        redirectToPage('home.html')
      } catch (err) {
        console.log(err)
        presentationStatus.innerText = 'Presentation saving failed.'
        finishForm.style.display = 'block'
      }
    }
  })


})


