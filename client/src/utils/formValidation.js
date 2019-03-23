// SIGNUP and EDIT
// usernameAvailable er stadig i SignupForm

export const emailValid = (email) => {
  if (!email) return '';
  const validator = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
  );
  let res = validator.test(email);
  return res ? '' : 'Ikke en gyldig adresse / Not a valid address';
};

export const passwordValid = (pwd) => {
  if (!pwd) {
    return '';
  } else {
    const uppercase = new RegExp('[A-Z]').test(pwd);
    const lowercase = new RegExp('[a-z]').test(pwd);
    const nums = new RegExp('[0-9]').test(pwd);
    const special = new RegExp('[^A-Za-z0-9]').test(pwd);
    const length = pwd.length >= 8;

    let validator = [uppercase, lowercase, nums, special];

    let strength = 0;
    validator.map((e) => {
      if (e) strength++;
      return null;
    });

    if (strength < 3 || !length) {
      return 'Skal være mindst 8 tegn og kræver mindst tre af følgende: store bogstaver, små bogstaver, tal, specielle tegn. / Must be at least 8 characters and requires three of the following: capital letters, non-capital letters, numbers and special characters.';
    } else return null;
  }
};

export const passwordRepeatValid = (pwdRepeat, allValues) => {
  if (pwdRepeat !== allValues.password) {
    return 'De to adgangskoder matcher ikke / The two passwords do not match';
  } else return null;
};

// LOGIN
export const loginUsernameValid = (username) => {
  if (!username) {
    return 'Du skal indtaste et brugernavn / You must provide a username';
  }
  return null;
};

export const loginPasswordValid = (pwd) => {
  if (!pwd) {
    return 'Du skal indtaste en adgangskode / You must enter a password';
  }
  return null;
};
