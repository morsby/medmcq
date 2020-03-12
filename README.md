# AU medMCQ

[![Build Status](https://travis-ci.org/morsby/medmcq.svg?branch=master)](https://travis-ci.org/morsby/medmcq)

Dette er en webapp bygget som en Express-server med React ovenpå. Den er lavet af studerende fra Medicin (lægevidenskab) på Aarhus Universitet, og bruges af studerende til repetition af multiple choice question (MCQ) eksaminer fra Aarhus Universitet. Spørgsmålene i appen er fra tidligere eksamenssæt, som udvikles af Institut for Klinisk Medicin (Aarhus Universitet).

Siden er lavet med tilladelse fra Institut for Klinisk Medicin, Health, Aarhus Universitet.

## Opsætning

For at køre appen, skal du placere en fil med navnet ".env.development" med følgende enviromental variables i server mappen:

```
SECRET=thisisasecret
DB_URL=mysql://user:password@ip:port/schema
KEYGRIP_SECRETS="example example example example example example example example"
```

Se mere om omsætningen i dokumentation for dotenv-flow.
  
Derefter skal du køre `npm run install-all`, efterfulgt af `cd server && knex migrate:latest` og derefter `npm run dev` for at starte dit development workflow. Held og lykke!

## Development

I `/server` findes en graphQL api der er forbundet til en mySQL database. Databasen kan opsættes ved brug af migrations, som findes under server. Denne server serverer vores client.

I `/client` findes hjemmesiden, der er bygget i React. Denne henter data fra api'en og viser spørgsmålene.

Når du redigerer i typeDefs på graphQL API'en, skal du køre `npm run generate` for at opdatere typescript typer på både backend og frontend. Dette bruger graphql-code-generator.
