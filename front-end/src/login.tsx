import { useEffect } from "react";
// imported from firebase auth sdk
import { getAuth } from "firebase/auth";
// ensures compatibility with the older versions of firebase
import firebase from "firebase/compat/app";
// imports pre-built UI for firebase authentication
import * as firebaseui from "firebaseui";
// imports the firebaseui styles using the CDN
import "firebaseui/dist/firebaseui.css";
import { app } from "./firebaseConfig";
export default function Login() {
  useEffect(() => {
    const ui =
      firebaseui.auth.AuthUI.getInstance() ||
      // since Firebase v9 and above service are imported when needed instad of being a namespace
      new firebaseui.auth.AuthUI(getAuth(app));

    ui.start("#firebaseui-auth-container", {
      signInSuccessUrl: "/home",
      signInOptions: [

        {
          provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        },

      ],
      // required to enable one-tap sign-up credential helper
      credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO,
    });
  }, []);

  return <div id="firebaseui-auth-container"></div>;
}