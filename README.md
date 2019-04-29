# AU medMCQ

Dette er en webapp bygget som en Express-server med React ovenpå.

Den er skabt som en direkte erstatning for StringLearning, da de har indført betalingsmur.

## For de teknisk interesserede

I `/server` findes en RESTful api og forbindelsen til en MongoDB-database.

I `/client` findes React-layoutet, der henter data fra api'en og viser spørgsmålene.

## Client struktur

I `/pages` findes de store components, som vises på hjemmesiden. Disse er hvad brugeren ser, og de indeholder andre components.
I `/containers` findes store byggeklodser, som indeholder mange mindre components.
I `/components` findes de mindste byggeklodser, som indgår i én eller flere andre components eller containers. Disse indeholder enten meget få eller ingen andre components.
