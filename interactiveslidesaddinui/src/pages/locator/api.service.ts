export const LocatorAPIService = {
  async list() {
    const response = await fetch('https://api.openbrewerydb.org/v1/breweries')
    if (!response.ok) {
      throw new Error(response.statusText)
    }

    return response.json()
  }
}
