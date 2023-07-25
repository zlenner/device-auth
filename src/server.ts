import { server } from './passwordless';
import { CredentialKey } from './passwordless/types';
import { AuthenticatePayload, RegisterPayload } from 'types';

const crypto = globalThis?.crypto || require('crypto')

export class DeviceAuth {
    challenges: {
        [key: string]: number
    }
    challenge_expire_in: number
    origin: (origin: string) => boolean

    constructor({
        // Default: 15 minutes
        challenge_expire_in = 15 * 60 * 1000,
        allowed_origins = true
    } = {}) {
        this.challenges = {}
        this.challenge_expire_in = challenge_expire_in
        this.origin = this.expected_origin_function_creator(allowed_origins)
    }

    issue_challenge () {
        const uuid = crypto.randomUUID()
        this.challenges[uuid] = Date.now() + this.challenge_expire_in
        return uuid
    }

    async verify_registration (payload: RegisterPayload) {
        this.confirm_challenge_validity(payload.challenge)
        
        const expected = {
            challenge: payload.challenge,
            origin: this.origin
        }
        const registrationParsed = await server.verifyRegistration(payload.registration, expected)
        return registrationParsed
    }

    async verify_authentication (payload: AuthenticatePayload, credential: CredentialKey) {
        // this.confirm_challenge_validity(payload.challenge)

        const expected = {
            challenge: payload.challenge,
            origin: this.origin,
            userVerified: true,
            counter: -1
        }

        const authenticationParsed = await server.verifyAuthentication(payload.authentication, credential, expected)
        return authenticationParsed
    }

    private invalidate_challenge(challenge: string) {
        delete this.challenges[challenge]
    }

    private confirm_challenge_validity(challenge: string) {
        if (!this.is_challenge_valid(challenge)) {
            this.invalidate_challenge(challenge)
            throw new Error("Challenge is invalid or expired.")
        }
        this.invalidate_challenge(challenge)
    }

    private is_challenge_valid (challenge: string) {
        if (typeof this.challenges[challenge] === "undefined") {
            return false
        } else if (Date.now() >= this.challenges[challenge]) {
            return false
        } else {
            return true
        }
    }

    private expected_origin_function_creator (allowed_origins: string[] | boolean = true) {
        return (origin: string) => {
            if (typeof allowed_origins === "boolean") {
                return true
            } else {
                return allowed_origins.includes(origin)
            }
        }
    }
}
