// SIGNUP and EDIT
// usernameAvailable er stadig i SignupForm

export const emailValid = email => {
    if (!email) return "";
    const validator = new RegExp(
        "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
    );
    let res = validator.test(email);
    return res ? "" : "Ikke en gyldig adresse";
};

export const passwordValid = pwd => {
    if (!pwd) {
        return "";
    } else {
        const uppercase = new RegExp("[A-Z]").test(pwd);
        const lowercase = new RegExp("[a-z]").test(pwd);
        const nums = new RegExp("[0-9]").test(pwd);
        const special = new RegExp("[^A-Za-z0-9]").test(pwd);
        const length = pwd.length >= 8;

        let validator = [uppercase, lowercase, nums, special];

        let strength = 0;
        validator.map(e => {
            if (e) strength++;
            return null;
        });

        if (strength < 3 || !length) {
            return "Skal være mindst 8 tegn og kræver mindst tre af følgende: store bogstaver, små bogstaver, tal, specielle tegn.";
        } else return null;
    }
};

export const passwordRepeatValid = (pwdRepeat, allValues) => {
    if (pwdRepeat !== allValues.password) {
        return "De to adgangskoder matcher ikke";
    } else return null;
};

// LOGIN
export const loginUsernameValid = async username => {
    if (!username) {
        return "Du skal indtaste et brugernavn!";
    }
    return null;
};

export const loginPasswordValid = pwd => {
    if (!pwd) {
        return "Du skal indtaste en adgangskode";
    }
    return null;
};
