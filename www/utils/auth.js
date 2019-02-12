import { Component } from "react";
import Router from "next/router";
import nextCookie from "next-cookies";
import cookie from "js-cookie";
import { redirectOnError } from "./redirect";

export const login = async ({ token }) => {
  cookie.set("token", token, { expires: 1 });
  Router.push("/profile");
};

export const logout = () => {
  cookie.remove("token");
  // to support logging out from all windows
  window.localStorage.setItem("logout", Date.now());
  Router.push("/login");
};

// Gets the display name of a JSX component for dev tools
const getDisplayName = (Component, pageRole) =>
  Component.displayName || Component.name || "Component";

export const withAuthSync = WrappedComponent =>
  class extends Component {
    static displayName = `withAuthSync(${getDisplayName(WrappedComponent)})`;

    static async getInitialProps(ctx) {
      const token = auth(ctx);

      const componentProps =
        WrappedComponent.getInitialProps &&
        (await WrappedComponent.getInitialProps(ctx));

      return { ...componentProps, token };
    }

    constructor(props) {
      super(props);

      this.syncLogout = this.syncLogout.bind(this);
    }

    componentDidMount() {
      window.addEventListener("storage", this.syncLogout);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.syncLogout);
      window.localStorage.removeItem("logout");
    }

    syncLogout(event) {
      if (event.key === "logout") {
        console.log("logged out from storage!");
        Router.push("/login");
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };

export const auth = ctx => {
  const { token } = nextCookie(ctx);

  if (!token) {
    return redirectOnError(ctx.res);
  }

  // if (SSR) {
  //   //getStoreApi
  //   // { newCookie, state }
  //   // dispatch(state);
  //   // cookie.set('asdasd', newCookie, {  //flag });
  // } else {
  //    // CLient
  //}

  // state.user.role
  // if(state.user.role.includes(pageRole)) {
  //
  // } else {

  //}

  //  }

  return token;
};
