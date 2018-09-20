// Return correct credentials
if (
    process.env.NODE_ENV === "production" ||
    process.env.NODE_ENV === "au_server"
) {
    // we're in production, return these keys
    module.exports = require("./prod");
} else {
    // we're in development, return these keys
    module.exports = require("./dev");
}
