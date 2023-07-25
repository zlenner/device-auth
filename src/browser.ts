import { client } from '@passwordless-id/webauthn' 
import { generate } from 'dip93'
import { EitherPayload } from 'types'

export const isAvailable = () => {
    const isFirefox = (navigator.userAgent.indexOf('Firefox') !== -1)
    return !isFirefox && client.isAvailable()
}

const isSignedIn = () => {
    return localStorage.getItem("device-auth-has-signed-in") !== null
}

export const signIn = async (challenge: string): Promise<EitherPayload> => {
    if (isSignedIn()) {
        const authentication = await client.authenticate([], challenge, {
            "authenticatorType": "auto",
            "userVerification": "required",
            "timeout": 60000
          })

          return {
            type: "authenticate",
            authentication,
            challenge,
            credential_id: authentication.credentialId
          }
    } else {
        // Challenge can be empty, registration does not require a challenge.
        // But since we've loaded one, why not use it?
        const username = generate(4)
        const registration = await client.register(username, challenge, {
            "authenticatorType": "auto",
            "userVerification": "required",
            "timeout": 60000,
            "attestation": false,
            "debug": false
        })

        localStorage.setItem("device-auth-has-signed-in", "true")

        return {
            type: "register",
            registration,
            challenge,
            credential_id: registration.credential.id
        }
    }    
}

