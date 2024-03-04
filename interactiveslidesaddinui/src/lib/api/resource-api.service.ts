import {AuthorizedClient} from "../common/request.client";
import {authResolver} from "../utils/auth.resolver";

class ResourceClientAPIClass extends AuthorizedClient {
  constructor() {
    super(`${process.env.REACT_APP_API_PATH}/v1`, authResolver)
  }

  listResources() {
    return this.get(`/resources`)
  }
}

export const ResourceClientAPI = new ResourceClientAPIClass()
