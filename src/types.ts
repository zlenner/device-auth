import { AuthenticationEncoded, RegistrationEncoded } from "./passwordless/types"

export interface RegisterPayload {
    type: "register"
    registration: RegistrationEncoded
    credential_id: string
    challenge: string
    username: string
}

export interface AuthenticatePayload {
    type: "authenticate"
    authentication: AuthenticationEncoded
    credential_id: string
    challenge: string
}

export type EitherPayload = RegisterPayload | AuthenticatePayload