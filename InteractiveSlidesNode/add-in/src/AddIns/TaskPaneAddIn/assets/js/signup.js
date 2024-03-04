const emailInput = document.getElementById('sign-up-form-email')
const passwordInput = document.getElementById('sign-up-form-password')
const usernameInput = document.getElementById('sign-up-form-username')
const companyNameInput = document.getElementById('sign-up-form-company-name')
const companyDomainInput = document.getElementById('sign-up-form-company-domain')
const signUpButton = document.getElementById('sign-up-form-sign-up')

Office.onReady(async () => {

  $(async function() {

    const apiUrl = window.location.pathname.startsWith("/addin") ? `${window.location.origin}/addin` : `${window.location.origin}`

    async function authUser(url, userData) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
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



    signUpButton.onclick = async (e) => {
      e.preventDefault()
      const email = emailInput.value
      const password = passwordInput.value
      const username = usernameInput.value
      const company_name = companyNameInput.value
      const company_domain = companyDomainInput.value
      await authUser(`${apiUrl}/api/auth/sign-up-trial`, {
        email, password, username, company_name, company_domain
      })
    }




  })

})
