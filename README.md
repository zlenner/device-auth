# device-auth

Device-Auth is a simple library that allows you to authenticate users on both the browser and server side.

## Demo

https://github.com/zlenner/device-auth/assets/119705166/b8bba30f-ee0e-4a87-b2c7-81f255142b34

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
Create one instance of DeviceAuth per server, and a route to issue a challenge.

```javascript
import { server } from "device-auth"

device_auth = new server.DeviceAuth()

// Whatever your app is, express fastify etc.
app.get("/issue_challenge", async () => {
  return device_auth.issue_challenge()
})
```

### (2) Use the `authenticate_or_register` function, which takes a challenge as an argument and registers a user. If already registered, the function will authenticate the user instead.

**BROWSER:**
```javascript
import { browser } from "device-auth"

const payload = await browser.authenticate_or_register(challenge)
```

NOTE: On incognito, or if the user has cleared their localStorage, this will register a new user, but the previous user will still be available for sign-in after a new user has been registered.

### (3) Send the payload to the server to complete the sign-in and get a token back.

**BROWSER:**

```javascript
const token = await fetchJsonFromServer.post("/verify", payload)
```

**SERVER:**

If the `payload.type` == `authenticate`, we'll fetch the credential from our database and use the `verify_authentication` method.

If the `payload.type` == `register`, we'll use the `verify_registration` method.

Either way, the server should respond with a token if the authentication/registration was successful.

```javascript
const access_tokens: string[] = []

app.post("/verify", async (request) => {
  const payload = request.body
  if (payload.type == "authenticate") {
    const credential = await database.get(payload.credential_id)
    await device_auth.verify_authentication(payload, credential)
  
  } else if (payload.type == "register") {
    await device_auth.verify_registration(payload)
    await database.store(payload.credential_id, payload.credential)
  }
  // If the code didn't throw an error by now, sign-in succeeded!

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

## Full documentation

The Quickstart is what most people will need. There are more functions available which you can check out through the typescript auto-complete.

## Known issues
1. An attacker can issue infinite challenges until the memory overflows and the app crashes. Can be somewhat mitigated with IP rate-limiting.
