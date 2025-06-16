export default function debug(message) {
    if (process.env.npm_lifecycle_event === "dev") {
        console.log(`\x1b[94mDEBUG: \x1b[0m${message}`);
    }
    
    return message;
}