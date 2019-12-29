import * as Yup from 'yup';

export const validationRegex = {
  // username validation stammer fra https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  username: /^[a-zA-ZæøåÆØÅ0-9]+([._]?[a-zA-Z0-9]+)*$/,
  password: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/
};

export const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Brugernavnet er for kort')
    .matches(validationRegex.username)
    .required('Du skal indtaste et brugernavn'),
  password: Yup.string()
    .matches(
      validationRegex.password,
      'Kodeordet skal være mindst 6 tegn, indeholde mindst et stort bogstav, et lille bogstav og et tal'
    )
    .required('Du skal angive et kodeord'),
  email: Yup.string().email()
});

export const resetSchema = Yup.object().shape({
  password: Yup.string()
    .matches(validationRegex.password)
    .required(),
  confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Kodeord skal være ens')
});
