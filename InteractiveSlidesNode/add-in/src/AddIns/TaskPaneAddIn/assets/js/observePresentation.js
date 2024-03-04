const observeBtn = document.getElementById('observeBtn')
const backBtn = document.getElementById('backBtn')

Office.onReady(() => {
  $(function() {
    backBtn.onclick = () => {
      redirectToPage('home.html')
    }

    observeBtn.onclick = async () => {
      const linkToPresentation = Office.context.document.settings.get('uploadedLink')
      if (!linkToPresentation) {
        redirectToPage('home.html')
      }
      Office.context.ui.displayDialogAsync(`${window.location.origin}${linkToPresentation}`, { height: 720, width: 1280 }, function(asyncResult) {
        console.log('DIALOG RESULT', asyncResult)
      })
    }
  })
})
