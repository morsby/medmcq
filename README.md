# AU Medicin MCQ

Dette er en webapp bygget som en Express-server med React ovenpå.

Den er skabt som en direkte erstatning for StringLearning, da de har indført betalingsmur.

## For de teknisk interesserede

I `/` findes en RESTful api og forbindelsen til en MongoDB-database.

I `/client` findes React-layoutet, der henter data fra api'en og viser spørgsmålene.


Da jeg vil forsøge at holde omkostninger på at have siden kørende nede, kan det være, de to dele splittes op senere hen – React-layoutet kan hostes gratis fx her på GitHub, mens API'en så kan få lidt mere plads på Heroku (hvor det hele p.t. hostes) – men det afhænger helt af populariteten.
