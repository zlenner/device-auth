# Device-Auth Library Documentation

Device-Auth is a simple library that allows you to authenticate users on both the browser and server side. This documentation will guide you through the process of setting up and using the library.

## Demo

[Here!](https://zlenner.github.io/device-auth/)

This demo uses an in-browser mock server to complete the sign-in, and stores the returned access token in your localStorage.

## Installation

To install the library, run the following command:

```
npm install device-auth
```

## Quickstart

### (1) Issue a challenge in the server.

**BROWSER:**
```javascript
const challenge = await fetchJsonFromServer.get("/issue_challenge")
```

**SERVER:**
Create a new instance of DeviceAuth for each server, and create a route to issue a challenge.

```javascript
import { server } from "device-auth"

device_auth = new server.DeviceAuth()

// Whatever your app is, express fastify etc.
app.get("/issue_challenge", async () => {
  return JSON.stringify(device_auth.issue_challenge())
})
```

### (2) The browser component only exposes one function, `signIn`, which takes a challenge as an argument and registers a user. If already registered, the function will authenticate the user instead.

**BROWSER:**
 We'll use that here.

```javascript
import { browser } from "device-auth"

const payload = await browser.signIn(challenge)
```

NOTE: On incognito, or if the user has cleared their localStorage, this will register a new user, but the previous user will still be available for sign-in after a new user has been registered.

### (3) Send the payload to the server to complete the sign-in and get a token back.

**BROWSER:**

```javascript
const token = await fetchJsonFromServer.post("/verify", payload)
```

**SERVER:**

If the `payload.type` == `authenticate`, we'll use the `verify_authentication` method.

If the `payload.type` == `register`, we'll use the `verify_registration` method.

Either way, the server should respond with a token if the authentication/registration was successful.

```javascript
const access_tokens: string[] = []

app.post("/verify", async (request) => {
  const payload = request.body
  if (payload.type == "authenticate") {
    await device_auth.verify_authentication(payload)
  } else if (payload.type == "register") {
    await device_auth.verify_registration(payload)
  }
  // If the code didn't throw an error by now, verification succeeded!

  // Generate a token and return it to the client.
  // Use something more secure than this on your app!
  const token = Math.random().toString(36)
  access_tokens.push(token)

  return token
})
```

### (4) You're a member of the app (club)! You now have access to all the secrets of the club :D

**BROWSER:**

```javascript
const secret_thing = await fetchJsonFromServer.post("/get-secret-thing", { token })
```

**SERVER:**

```javascript
app.post("/get-secret-thing", async (request) => {
  if (!access_tokens.includes(request.body.token)) {
    throw new Error("You don't have access!!!")
  }
  // Woosh, this request was made by a member of the club.

  return "Psst, the secret is ____________"
})
```


### Known issues
1. An attacker can issue infinite challenges until the memory overflows and the app crashes. Can be prevented with IP rate-limiting.
