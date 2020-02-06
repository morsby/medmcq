# AU medMCQ

[![Build Status](https://travis-ci.org/morsby/medmcq.svg?branch=master)](https://travis-ci.org/morsby/medmcq)

Dette er en webapp bygget som en Express-server med React ovenpå. Den er lavet af studerende fra Medicin (lægevidenskab) på Aarhus Universitet, og bruges af studerende til repetition af multiple choice question (MCQ) eksaminer fra Aarhus Universitet. Spørgsmålene i appen er fra tidligere eksamenssæt, som udvikles af Institut for Klinisk Medicin (Aarhus Universitet).

Siden er lavet med tilladelse fra Institut for Klinisk Medicin, Health, Aarhus Universitet.

## Opsætning

For at køre appen, skal du placere en fil med navnet ".env.development" med følgende enviromental variables:

- DB_URL
- SECRET
- SENDGRID
- KEYGRIP_SECRETS
  Se mere om omsætningen i dokumentation for dotenv-flow.

## For de teknisk interesserede

I `/server` findes en graphQL api der er forbundet til en mySQL database. Databasens kan opsættes ved brug af migrations, som findes under server. Denne server serverer vores client.

I `/client` findes hjemmesiden, der er bygget i React. Denne henter data fra api'en og viser spørgsmålene.
