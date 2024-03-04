const loginForm = document.getElementById('login-form')
const loginButton = document.getElementById('login-form-sign-in')
const registerButton = document.getElementById('login-form-sign-up')
const signUpButton = document.getElementById('login-form-sign-up')

Office.onReady(async () => {

  $(async function() {

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

    const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`

    async function authUser(url, email, password) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email, password,
          }),
        })
        if (response.ok) {
          const tokens = await response.json()
          accessToken = tokens.accessToken
          refreshToken = tokens.refreshToken
          localStorage.setItem('slides-tokens', JSON.stringify(tokens))
          redirectToPage('rename-presentation.html')
        }
      } catch (error) {
        console.log(error)
      }
    }

    const loadScreenButton = document.querySelector('.load-screen button')

    loadScreenButton.onclick = (e) => {
      e.preventDefault()
      const loadScreen = document.querySelector('.load-screen')
      localStorage.setItem('slidex-loaded-taskpane', JSON.stringify(1))
      loadScreen.style.display = 'none'
    }

    const loading = localStorage.getItem('slidex-loaded-taskpane')
    if (loading) {
      const loadScreen = document.querySelector('.load-screen')
      loadScreen.style.display = 'none'
    }

    if (localStorage.getItem('slides-tokens')) {
      await refreshAccessToken()
      if (Office.context.document.settings.get('uploadedLink')) {
        redirectToPage('home.html')
      } else {
        redirectToPage('rename-presentation.html')
      }
    }


    loginForm.onsubmit = (e) => {
      e.preventDefault()
    }

    loginButton.onclick = async (e) => {
      e.preventDefault()
      const email = document.getElementById('login-form-email').value
      const password = document.getElementById('login-form-password').value
      await authUser(`${apiUrl}/api/auth/sign-in`, email, password)
    }

    registerButton.onclick = async (e) => {
      e.preventDefault()
      const email = document.getElementById('login-form-email').value
      const password = document.getElementById('login-form-password').value
      await authUser(`${apiUrl}/api/auth/sign-up`, email, password)
    }

    signUpButton.onclick = (e) => {
      e.preventDefault()
      redirectToPage('sign-up.html')
    }

  })

})

