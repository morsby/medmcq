// Username opfylder krav fra https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username

module.exports = {
    username: /^[a-zA-ZæøåÆØÅ0-9]+([._]?[a-zA-Z0-9]+)*$/,
};
