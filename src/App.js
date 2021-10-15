/* global google */
import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import jwt_decode from "jwt-decode";
import "./App.css";

const App = (props) => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [other, setOther] = useState(null);
  const onOneTapSignedIn = (response) => {
    setIsSignedIn(true);
    const decodedToken = jwt_decode(response.credential);
    setUserInfo({ ...decodedToken });
  };
  const signout = () => {
    // refresh the page
    google.accounts.id.disableAutoSelect();
    window.location.reload();
  };

  const onSuccess = (res) => {
    let userInfo = {};
    let profileObj = res.profileObj;
    userInfo.name = profileObj.name;
    userInfo.email = profileObj.email;
    setUserInfo({...userInfo});
    setIsSignedIn(true);
  };

  const onFailure = (res) => {
    console.log("Login failed: res:", res);
    //alert(`Failed to login.`);
  };

  useEffect(() => {
    window.onGoogleLibraryLoad = () => {
      google.accounts.id.initialize({
        client_id:
          "434425175220-0371a9ld8e3e4cbi0jjdeglkqof87f03.apps.googleusercontent.com",
        cancel_on_tap_outside: false,
        callback: onOneTapSignedIn,
      });
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log(notification.getNotDisplayedReason());
          setOther(1);
        } else if (notification.isSkippedMoment()) {
          console.log(notification.getSkippedReason());
          setOther(1);
        } else if (notification.isDismissedMoment()) {
          console.log(notification.getDismissedReason());
        } else {
          setOther(0);
        }
      });
      google.accounts.id.renderButton({
        type: "standard",
        client_id:
          "434425175220-0371a9ld8e3e4cbi0jjdeglkqof87f03.apps.googleusercontent.com",
        cancel_on_tap_outside: false,
        prompt_parent_id: "g_id_onload",
      });
    };
  });

  return (
    <div className="App">
      <div className="row mx-0 align-items-center">
        {other === 1 ? (
          <div className="inputs col-12 px-0">
            <div className="google-btn-wrap text-center my-2 pt-3">
              <GoogleLogin
                clientId="434425175220-0371a9ld8e3e4cbi0jjdeglkqof87f03.apps.googleusercontent.com"
                onSuccess={onSuccess}
                cookiePolicy={"single_host_origin"}
                //isSignedIn={true}
                theme="dark"
                onFailure={onFailure}
                buttonText="Sign in your account with Google"
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {isSignedIn && userInfo ? (
        <div className="">
          Hello {userInfo.name} ({userInfo.email})
          <div className="g_id_signout" onClick={() => signout()}>
            Sign Out
          </div>
        </div>
      ) : (
        <div className="test2" id="">
          You are not signed in
        </div>
      )}
    </div>
  );
};

export default App;
