const apiLink = window.location.hostname.indexOf("app.slidex.ai") !== -1 ? `${window.location.origin}/addin` : "http://localhost:5000"
export default apiLink