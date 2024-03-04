import {AuthorizedClient} from "../common/request.client";
import {authResolver} from "../utils/auth.resolver";

class CommonAPIService extends AuthorizedClient {
  constructor() {
    super(`${process.env.REACT_APP_API_PATH}/v1`, authResolver)
  }
}

export const CommonAPI = new CommonAPIService()
