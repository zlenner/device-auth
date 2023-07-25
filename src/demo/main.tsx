import { authenticate_or_register } from "../browser";
import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import MockServer from "./MockServer";

const MOCK_SERVER = new MockServer()

// This `use_access_token_from_localstorage` hook is a little complicated, but it's just so we can remember the access token in localstorage, instead of the page forgetting every single time it reloads

// In practice, depending on the auth provider you use (like firebase/supabase/auth0), this will be done by their client libraries.
const use_access_token_from_localstorage = () => {
  const access_token_in_localstorage = localStorage.getItem("access_token")

  // We're going to start with the access token stored in localstorage instead of null.
  const [access_token, set_access_token_in_state] = React.useState<string | null>(access_token_in_localstorage)

  const set_access_token = (access_token: string | null) => {
    if (access_token === null) {
      localStorage.removeItem("access_token")
    } else {
      localStorage.setItem("access_token", access_token)
    }
    set_access_token_in_state(access_token)
  }

  return [access_token, set_access_token] as const;
}

const Example = () => {
  const [challenge, set_challenge] = React.useState<string | null>(null);
  // If access token is null, we are not logged in
  const [access_token, set_access_token] = use_access_token_from_localstorage()

  const load_and_set_challenge = async () => {
    const challenge = await MOCK_SERVER.issue_challenge();
    set_challenge(challenge);
  }

  useEffect(() => {
    load_and_set_challenge()
  }, [])

  if (challenge === null) {
    return <div>Loading...</div>
  }

  const on_sign_in_click = async () => {
    const payload = await authenticate_or_register(challenge);
    // If the sign is invalid, it will throw an error, so we don't need to validate
    
    if (payload.type === "authenticate") {
      set_access_token(await MOCK_SERVER.verify_authentication(payload))
    
    } else if (payload.type === "register") {
      set_access_token(await MOCK_SERVER.verify_registration(payload))
    }
  }

  if (access_token === null) {
    return (
      <button onClick={on_sign_in_click}>Sign In</button>
    )
  }

  return (
    <div>
      <div>Access Token: {access_token}</div>
      <br/>
      <button onClick={() => set_access_token(null)}>Sign Out</button>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="container">
      <h3><a href="https://github.com/zlenner/device-auth">device-auth</a> demo</h3>
      <p>This demo uses an in-browser mock server to complete the sign-in, and stores the returned access token in your localStorage.</p>
      <Example />
    </div>
  </React.StrictMode>
);
