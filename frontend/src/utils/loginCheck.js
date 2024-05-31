import { getCookie } from "./cookie";

export function loginCheck() {
    let token = getCookie("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  }