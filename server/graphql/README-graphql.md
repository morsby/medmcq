# Readme GraphQl

Overgang til ren GraphQl API:

- Der skal benyttes [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/)
- Resolvers' `context` indeholder `req.user` fra express som `context.user` og `dataloaders`.
- Skal gerne understøtte følgende schema [https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql-simple#expected-graphql-schema]
  - Hermed kan bruges [react-admin](https://github.com/marmelab/react-admin/tree/master/packages/ra-data-graphql-simple#expected-graphql-schema)
- Resolvers skal så vidt muligt være eksplicitte, let-læselige, og det skal være tydeligt, hvor data hentes fra jf. [https://medium.com/paypal-engineering/graphql-resolvers-best-practices-cd36fdbcef55]
- Der skal dokumenteres
