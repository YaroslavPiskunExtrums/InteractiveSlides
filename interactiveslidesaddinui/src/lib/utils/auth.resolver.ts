import {IAuthResolver} from "../../types/api.interface";
import {AUTH_TOKEN_KEY} from "../constants/auth";

export class DefaultAuthResolver implements IAuthResolver {
  getToken(): string {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }
}

export const authResolver = new DefaultAuthResolver();
