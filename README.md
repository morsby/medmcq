# AU Medicin MCQ

Dette er en webapp bygget som en Express-server med React ovenpå.

Den er skabt som en direkte erstatning for StringLearning, da de har indført betalingsmur.

## For de teknisk interesserede

I `/` findes en RESTful api og forbindelsen til en MongoDB-database.

I `/client` findes React-layoutet, der henter data fra api'en og viser spørgsmålene.

## TODOs

### API

- [ ] Oprydning (særligt `routes/questions.js`)

### React

- [ ] **Ca. 10% af besvarede spørgsmål bliver ikke registreret i profilen?**
- [ ] Hent settings på load
- [x] ~~Fix gammel SelectQuestions-funktion (utils/quiz)~~ (slettet)
- [ ] Lad buttons tage html input
- [ ] Autocomplete i profil-formularer
- [ ] Få component til at opdatere selv ved dybt nested ny kommentar. 
- [ ] Undgå at Firefox åbner søge-dialogen, når der svares på spørgsmål med tal
- [ ] Ryd op i Component-logik (større projekt ... - særligt formular-validation og Redux-connects)
- [ ] Print virker ikke i alle browsers
- [x] Formindsk Swipe-følsomhed


## Planlagte projekter

- [x] Mulighed for at kommentere spørgsmål
- [ ] Side hvor man kan følge med i ændringer
- [ ] Udvikling af algoritme, så "tilfældige spørgsmål" fortrinsvist tager spørgsmål, der er svaret forkert tidligere/ikke tidligere besvaret
- [ ] Mulighed for at tilføje/ændre specialer
- [ ] Mulighed for rettelse af spørgsmål
- [ ] Mulighed for tilføjelse af personlige kommentarer
