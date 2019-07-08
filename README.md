# AU medMCQ

Dette er en webapp bygget som en Express-server med React ovenpå. Den bruges af medicinstuderende på Aarhus Universitet til repetition af multiple choice question (MCQ) eksaminer.

Siden er lavet med tilladelse fra Institut for Klinisk Medicin, Health, Aarhus Universitet.

## TODOs

- [x] Bedre struktur af redux state
- [x] Integrering af voting
- [ ] Forbedret migrering (p.t. er der fx forvirring omkring tags og tilhørsforhold til semestre)
- [ ] En masse opdatering af redux/frontend
- [ ] Optimering af visning af besvarede spørgsmål (loading er langsom). Evt. via [react-window](https://github.com/bvaughn/react-window)? [CSS overflow-x](https://www.w3schools.com/cssref/css3_pr_overflow-x.asp) sat til auto bør også virke, uden ekstra dependencies.

## Opsætning

For at køre appen på windows, kræver det installering af følgende: `npm install -g win-node-env`. Dette skyldes mådes linux og windows håndterer env-variables forskelligt.

## For de teknisk interesserede

I `/server` findes en RESTful api og forbindelsen til en SQL-database.

I `/client` findes React-layoutet, der henter data fra api'en og viser spørgsmålene.

### Client struktur

I `/pages` findes de store components, som vises på hjemmesiden. Disse er hvad brugeren ser, og de indeholder adskillige andre containers eller components.

I `/containers` findes store byggeklodser, som indeholder mange mindre components.

I `/components` findes de mindste byggeklodser, som indgår i én eller flere andre components eller containers. Disse indeholder enten meget få eller ingen andre components.
