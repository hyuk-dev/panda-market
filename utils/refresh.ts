import { NextRouter } from "next/router";


export function refresh (router : NextRouter) {
  router.replace(router.asPath);
}