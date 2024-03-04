import { AccessTokenDataType, TokensType } from '@/types/tokens.type'
import { refreshAccessToken } from '@lib/api/refreshAccessToken'
import { getFromLocalStorage } from './localStorage'
import { logOutAndNavigate } from './logOutAndNavigate'
import { getUploadedLink } from './addin'
import { TaskPaneRouterList, protectedRoutes } from '@lib/routes/routes.enum'

const checkPathToProtecting = (pathname: string) => {
  return protectedRoutes.some((route) => route === pathname)
}

const getAccessTokenData = (tokens: TokensType) => {
  return tokens.accessToken.split('.')[1]
}

const decodeAccessTokenData = (accessToken: string): AccessTokenDataType => {
  return JSON.parse(atob(accessToken))
}

const getDataFromAccessToken = (tokens: TokensType) => {
  const accessTokenData = getAccessTokenData(tokens)
  const { exp, username } = decodeAccessTokenData(accessTokenData)
  return { exp, username }
}

const navigateToProtectedPage = () => {
  const link = getUploadedLink()
  window.location.hash = link
    ? TaskPaneRouterList.preview.path
    : TaskPaneRouterList.presentationRename.path
}

export const checkProtectedRoute = async (pathname: string | null) => {
  if (!pathname) {
    return
  }

  const isCurrentPathProtected = checkPathToProtecting(pathname)

  const tokens = getFromLocalStorage<TokensType>('slides-tokens')

  if (!isCurrentPathProtected && !tokens) return

  if (!tokens && isCurrentPathProtected) {
    logOutAndNavigate()
    return
  }

  if (!tokens) return

  const { exp, username } = getDataFromAccessToken(tokens)

  const isTokenNotExpired = exp * 1000 > Date.now()

  if (isTokenNotExpired && !isCurrentPathProtected) {
    navigateToProtectedPage()
    return
  }

  const refreshedAccessToken = await refreshAccessToken({ tokens, username })

  if (!refreshedAccessToken) {
    logOutAndNavigate()
    return
  }
}
