import { generate } from 'dip93'
import { client } from './passwordless'
import { AuthenticatePayload, EitherPayload, RegisterPayload } from 'types'

export const is_available = () => {
    const isFirefox = (navigator.userAgent.indexOf('Firefox') !== -1)
    return !isFirefox && client.isAvailable()
}

const has_signed_in = () => {
    return localStorage.getItem("device-auth-has-signed-in") !== null
}

export const authenticate_or_register = async (challenge: string): Promise<EitherPayload> => {
    if (has_signed_in()) {
        return authenticate(challenge)
    } else {
        return register(challenge)
    }
}

export const authenticate = async (challenge: string): Promise<AuthenticatePayload> => {
    const authentication = await client.authenticate([], challenge, {
        "authenticatorType": "auto",
        "userVerification": "required",
        "timeout": 60000
    })

    return {
        type: "authenticate",
        authentication,
        challenge,
        credential_id: authentication.credentialId,
    }
}

export const register = async (challenge: string): Promise<RegisterPayload> => {
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
        credential_id: registration.credential.id,
        username,
    }
}

