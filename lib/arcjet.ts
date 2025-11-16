import 'server-only';

import arcjet,  {
    fixedWindow,
    detectBot, 
    shield, 
    slidingWindow , 
    sensitiveInfo, 
    protectSignup
} from "@arcjet/next"
import { env } from "./env"

export {
    fixedWindow , 
    detectBot, 
    shield, 
    slidingWindow, 
    protectSignup , 
    sensitiveInfo
}
export default arcjet({
    key : env.ARCJET_KEY, 
    characteristics : ["fingerprint"],
    rules : [
        shield({ mode: "LIVE" }),
    ]
})