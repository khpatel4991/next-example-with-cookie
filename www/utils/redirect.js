import Router from "next/router";

export const redirectOnError = res => {
  if (process.browser) {
    Router.push("/login");
  } else {
    res.writeHead(301, { Location: "/login" });
    res.end();
  }
};
