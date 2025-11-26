import { createAuthClient } from "better-auth/react"
import { toast } from "sonner"
import { emailOTPClient } from "better-auth/client/plugins"
import { adminClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(), 
        adminClient()
    ]
})

export const signInWithGithub = async () => {
    await authClient.signIn.social({
        provider: "github", 
        callbackURL : "/", 
        fetchOptions : {
            onSuccess : () => {
                toast.success("Signed in with GitHub , you will be redirect...")
            }, 
            onError : (error) => {
               toast.error(error.error.message) 
            }
        }
    })
}

