class PresentationApiClass {

  private url = window.location.hostname.indexOf("app.slidex.ai") !== -1 ? `${window.location.origin}/addin` : "http://localhost:5000"

  public async sendPresentation(figures: any, session: string) {

    if (!session) {
      console.warn('No session id')
      return
    }

    const response = await fetch(`${this.url}/api/HTML/save-presentation-result`, {
      method: 'POST',
      body: JSON.stringify({
        figures,
        session,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      console.log('Error', response.statusText)
    }
    return await response.json()

  }

  public async finishPresentation(session: string) {
    if (!session) {
      console.warn('No session id')
      return
    }
    const response = await fetch(`${this.url}/api/HTML/finish-presentation`, {
      method: 'POST',
      body: JSON.stringify({
        session,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!response.ok) {
      console.log('Error', response.statusText)
    }
    return await response.json()
  }
  public async finishSession(session: string) {
    if (!session) {
      console.warn('No session id')
      return
    }
    const response = await fetch(`${this.url}/api/HTML/finish-session/${session}`)
    if (!response.ok) {
      console.log('Error', response.statusText)
    }
    return await response.json()
  }
  public async autoSaveFigure(data: {
    sessionId: string,
    id: string | number
    value: string | null
    fullName: string | null
    business: string | null
    phone: string | null
    email: string | null
    additionalFields: string[] | null
    textMessage: string | null
  }) {

    const res = await fetch(`${this.url}/api/HTML/autosave-presentation-answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: data.sessionId,
        figure: {
          value: data.value,
          fullName: data.fullName,
          business: data.business,
          phone: data.phone,
          email: data.email,
          additionalFields: data.additionalFields,
          textMessage: data.textMessage,
          id: data.id,
        }
      }),
    })
    if (!res.ok) {
      console.log('Error', res.statusText)
      throw new Error(res.statusText)
    }
    return res.json()

  }


}

export const PresentationAPIClient = new PresentationApiClass()
