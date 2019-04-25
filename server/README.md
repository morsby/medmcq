# medmcq-sql-migrator

## Intro

Dette repository har to formål:

1. At flytte data fra mongo til SQL
2. Mockup af den nye API til medMCQ efter SQL-migrering.

## 1: Migrering

**tl;dr**: Migreringsprocessen startes på [/migrate](/migrate). Den tager nogle minutter, særligt pga. alle besvarede spørgsmål.

Dette repository har forbindelser til to databaser: 

1. vores dev-mongoDB
2. en SQL-database.

Formålet er at flytte alle data fra `1` til `2`. 

Dette gøres ved at hente data fra `1` og i varierende grader omdanne til et mere relational format. 

### Brug

1. `npm install`

#### Nulstilling og klargøring af DB:

1. Nulstil databasen: `knex migrate:rollback && knex migrate:latest && knex seed:run`
2. Der skal ændres lidt i koden, før migreringen kører uden fejl. Alle steder er markeret med en `pre-migrate`-kommentar
	1. `Password(BaseModel)` skal erstattes med `BaseModel` i `/models/user.js`
	2. `ExamSetQNo` skal ikke være en requried prop i `/models/question.js`
3. Besøg linket [/migrate](/migrate).


## 2: Backend for medMCQ

Docs til API'en kan findes på [/api/docs](/api/docs) og specifikationen (`JSON`) kan findes på [/api/spec.json](/api/spec.json).

GraphiQl er tilgængelig her [/graphql](/graphql).

## TODOs

- [x] Flytning af brugere
	- [x] Flytning af svar 
- [x] Flytning af selve spørgsmålene
	- [ ] Håndtering af slettede tags
- [ ] Tjek alle models igennem for relationships
- [ ] Validation på brugere og spørgsmål
- [ ] Implementer [accesscontrol](https://www.npmjs.com/package/accesscontrol)
