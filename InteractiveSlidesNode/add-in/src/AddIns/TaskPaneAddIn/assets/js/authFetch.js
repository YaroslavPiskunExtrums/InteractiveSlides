const tokens = localStorage.getItem('slides-tokens')
let accessToken = null
let refreshToken = null
if (tokens) {
  const parsedTokens = JSON.parse(tokens)
  accessToken = parsedTokens.accessToken
  refreshToken = parsedTokens.refreshToken
}

function redirectToPage(page) {
  let path = window.location.pathname.split('/')
  path[path.length - 1] = page
  window.location.pathname = path.join('/')
}

const cleanLocalStorage = () => {
  localStorage.removeItem('slides-tokens')
  localStorage.removeItem('default_styles')
}

function redirectToLoginPage() {
  redirectToPage('login.html')
}


async function refreshAccessToken(withRedirect = true) {
  const tokenData = accessToken.split('.')[1]

  const tokenDataDecoded = JSON.parse(atob(tokenData))
  const apiUrl = window.location.pathname.startsWith('/addin') ? `${window.location.origin}/addin` : `${window.location.origin}`

  if (tokenDataDecoded.exp * 1000 <= Date.now()) {
    try {
      const response = await fetch(`${apiUrl}/api/auth/regenerate-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken,
          username: tokenDataDecoded.username,
        }),
      })


      if (response.ok) {
        const tokesResult = await response.json()
        accessToken = tokesResult.accessToken
        localStorage.setItem('slides-tokens', JSON.stringify({ accessToken, refreshToken }))
        return accessToken
      } else {
        cleanLocalStorage()
        if (withRedirect) redirectToLoginPage()
      }
    } catch (error) {
      console.error(error)
      cleanLocalStorage()
      if (withRedirect) redirectToLoginPage()
    }
  }
  return null
}


async function authFetch(url, options, withRedirect = true) {

  await refreshAccessToken(withRedirect)

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: accessToken,
      },
    })
    if (response.status === 401 || response.status === 403) {
      cleanLocalStorage()
      if (withRedirect) redirectToLoginPage()
    }
    return response
  } catch (error) {
    console.error(error)
  }

}
