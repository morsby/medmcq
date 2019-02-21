# AU Medicin MCQ

Dette er en webapp bygget som en Express-server med React ovenpå.

Den er skabt som en direkte erstatning for StringLearning, da de har indført betalingsmur.

## For de teknisk interesserede

I `/` findes en RESTful api og forbindelsen til en MongoDB-database.

I `/client` findes React-layoutet, der henter data fra api'en og viser spørgsmålene.

## TODOs

Hvis et punkt er tildelt en udvikler, vil det fremgå med navn og/eller `branch` efter punktet.

### Andet, vigtigt

- [x] **Dubletter af enkelte brugernavne (case-insensitive) og emails -- hvordan håndteres dette?**
- [x] Bloker mellemrum m.v. i brugernavne (Sigurd - `username-validation`)

### API

- [ ] Oprydning (særligt `routes/questions.js`)
- [ ] Brug Router module (Thomas)
- [ ] async/await syntax (Thomas)
- [ ] Flyt user/auth-validation meddelelser ud af API'en og ind i react (for bedre oversættelser)

### React

- [ ] Ca. 10% af besvarede spørgsmål bliver ikke registreret i profilen? -- stadig?
- [ ] Debounce checkUser ved signup
- [ ] Autocomplete i profil-formularer
- [ ] Undgå at Firefox åbner søge-dialogen, når der svares på spørgsmål med tal
- [ ] Ryd op i Component-logik (større projekt ... - særligt formular-validation og Redux-connects)
- [ ] Print virker ikke i alle browsers
- [x] ~~Få component til at opdatere selv ved dybt nested ny kommentar. (Klares nok i `immutable-redux`)~~ (feedback udgået)
- [x] Bedre immutability i Redux. Se [denne side](https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns) (Sigurd - `immutable-redux`)
- [x] Formindsk Swipe-følsomhed
- [x] ~~Fix gammel SelectQuestions-funktion (utils/quiz)~~ (slettet)
- [x] Check også for unik email? (Mongo vil smide en fejl)
- [x] Lad buttons tage html input
- [x] Hent settings på load

## Planlagte projekter

- [ ] Excel-ark?
- [ ] Side hvor man kan følge med i ændringer
- [ ] Udvikling af algoritme, så "tilfældige spørgsmål" fortrinsvist tager spørgsmål, der er svaret forkert tidligere/ikke tidligere besvaret
- [ ] Mulighed for rettelse af spørgsmål
- [ ] Mulighed for tilføjelse af personlige kommentarer
- [x] Oversættelse til engelsk (Sigurd - `localize`)
- [x] Mulighed for at tilføje/ændre specialer
- [x] Mulighed for at kommentere spørgsmål
