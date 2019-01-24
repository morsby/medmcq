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
- [ ] Brug Router module (Thomas - `api-cleaning`)
- [ ] async/await syntax (Thomas - `api-cleaning`)

### React

- [ ] **Ca. 10% af besvarede spørgsmål bliver ikke registreret i profilen?**
- [ ] Debounce checkUser ved signup
- [ ] Autocomplete i profil-formularer
- [ ] Få component til at opdatere selv ved dybt nested ny kommentar. 
- [ ] Undgå at Firefox åbner søge-dialogen, når der svares på spørgsmål med tal
- [ ] Ryd op i Component-logik (større projekt ... - særligt formular-validation og Redux-connects)
- [ ] Print virker ikke i alle browsers
- [x] Formindsk Swipe-følsomhed
- [x] ~~Fix gammel SelectQuestions-funktion (utils/quiz)~~ (slettet)
- [x] Check også for unik email? (Mongo vil smide en fejl)
- [x] Lad buttons tage html input
- [x] Hent settings på load

## Planlagte projekter

- [ ] Excel-ark?
- [ ] Oversættelse til engelsk (hvordan?)
- [ ] Side hvor man kan følge med i ændringer
- [ ] Udvikling af algoritme, så "tilfældige spørgsmål" fortrinsvist tager spørgsmål, der er svaret forkert tidligere/ikke tidligere besvaret
- [ ] Mulighed for at tilføje/ændre specialer
- [ ] Mulighed for rettelse af spørgsmål
- [ ] Mulighed for tilføjelse af personlige kommentarer
- [x] Mulighed for at kommentere spørgsmål
