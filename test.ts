import { DeviceAuth } from "./src/server"

const device_auth = new DeviceAuth()

const x = await device_auth.verify_authentication({
    "type": "authenticate",
    "authentication": {
        "credentialId": "FqXWRcqNv_olPyYREswYJwlO52LVKIXiNSTZrVfU1eQ",
        "authenticatorData": "10rwR9hPWxWq20LwZ01DOmOlQ3Lz-RworLnSRwjhieIFAAAAAA==",
        "clientData": "eyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiMDY5ZGNkYzAtODlhZS00NWNkLWExMGItNjFiMTg0YWNlYTY0Iiwib3JpZ2luIjoiaHR0cHM6Ly90YXNrYXNzaXN0YW50cHJldmlldy5uZXRsaWZ5LmFwcCIsImNyb3NzT3JpZ2luIjpmYWxzZX0=",
        "signature": "MEQCIDmzl6DQH42w1K-y6SZtVwuZcIqfYmXwZiGve-IfItrIAiAoaG4L-7qTidLieX1yXsmuTGxXrNZ1y5SZd-5SJvEQ_Q=="
    },
    "challenge": "069dcdc0-89ae-45cd-a10b-61b184acea64",
    "credential_id": "FqXWRcqNv_olPyYREswYJwlO52LVKIXiNSTZrVfU1eQ"
}, {
    algorithm: "ES256",
    id: "FqXWRcqNv_olPyYREswYJwlO52LVKIXiNSTZrVfU1eQ",
    publicKey: "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEtuJMKbigJvJazE_WYHGSC9HpoIQuoVPoIRe4Qk9M0oGha2G2-4hDG-Uz_U3LNuvyDCDYVXqDqDX0tFCxTSNxwg=="
})
