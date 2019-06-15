import * as types from 'actions/types';

import { createReducer } from 'redux-starter-kit';
import { normalize, schema } from 'normalizr';

const input = [
  {
    id: 20823,
    text:
      'En 65-årig mand oplyser, at hans alkoholforbrug gennem mange år i perioder er over 5-10 genstande dagligt. Der er talrige spider nævi på thorax forflade samt gynækomasti, øget flankefylde og abdominal venetegning, og der er universelt nedsat muskelfylde.\n\nUL viser lille lever med uregelmæssig overflade. Hvilket udsagn er mest korrekt?',
    answer1:
      'Opfylder kriterierne for diagnosen alkoholisk cirrose, skal undersøges for esofagus varicer.',
    answer2:
      'For at stille diagnosen alkoholisk cirrose kræves, at andre årsager udelukkes, f.eks. hepatitis C og hæmokromatose.',
    answer3: 'Mistanken om alkoholisk cirrose skal efterprøves med leverbiopsi.',
    image: null,
    examSetQno: 72,
    examSetId: 322,
    semester: 1,
    correctAnswers: [2],
    examSet: {
      id: 322,
      year: 2016,
      season: 'E',
      semesterId: 1,
      semester: {
        id: 1,
        value: 7,
        name: 'Inflammation',
        shortName: 'Inf'
      }
    },
    publicComments: [],
    specialties: [],
    tags: []
  },
  {
    id: 20937,
    text:
      '28-årig mand, som er behandlet med kombinations-kemoterapi for akut myeloid leukæmi. På dag 28 efter kurens 1\\. dag er patienten stadig neutropen, og der tages knoglemarvsundersøgelse.\n\nPå figuren ses A) Diagnostiske flow-cytogrammer på dag 1, og B) Flow-cytogrammer på dag 28.\n\nHvad er den mest sandsynlige årsag til neutropeni hos denne patient?',
    answer1: 'Relaps',
    answer2: 'Refraktær sygdom',
    answer3: 'Langsom regeneration',
    image: 'Inf-2017-E-30.jpg',
    examSetQno: 30,
    examSetId: 324,
    semester: 1,
    correctAnswers: [3],
    examSet: {
      id: 324,
      year: 2017,
      season: 'E',
      semesterId: 1,
      semester: {
        id: 1,
        value: 7,
        name: 'Inflammation',
        shortName: 'Inf'
      }
    },
    publicComments: [],
    specialties: [
      {
        questionId: 20937,
        specialtyId: 2,
        maxVotes: 1,
        specialtyName: 'Hæmatologi',
        votes: 1
      }
    ],
    tags: []
  },
  {
    id: 20520,
    text:
      '66 årig patient med kendt lever cirrose får påvist en fokal poces i leveren på 2 cm og henvises til multidisciplinær tumorkonference med henblik på behandlingstilbud.\n\nFigur viser tumor i leveren.\n\nDet mest sandsynlige vil være at tilbyde patienten:',
    answer1: 'resektion af tumoren for at sikre, at alt tumorvæv fjernes',
    answer2:
      'kemoembolisering, hvor man lukker blodforsyningen og samtidig indgiver kemoterapi til tumoren',
    answer3:
      'radiofrekvensablation (RFA), hvor man opvarmer tumorvævet med en nål placeret i tumoren',
    image: 'Inf-2014-F-15.jpg',
    examSetQno: 15,
    examSetId: 318,
    semester: 1,
    correctAnswers: [3],
    examSet: {
      id: 318,
      year: 2014,
      season: 'F',
      semesterId: 1,
      semester: {
        id: 1,
        value: 7,
        name: 'Inflammation',
        shortName: 'Inf'
      }
    },
    publicComments: [
      {
        id: 297,
        text:
          'RFA er førstevalg ved HCC uden metastaser\nresektion foretages ikke når der er cirrose',
        questionId: 20520,
        userId: 35,
        createdAt: '2019-01-06T09:35:48.000Z',
        updatedAt: '2019-04-24T17:38:33.000Z',
        user: {
          username: 'SigneH',
          id: 35
        }
      }
    ],
    specialties: [
      {
        questionId: 20520,
        specialtyId: 1,
        maxVotes: 1,
        specialtyName: 'Gastroenterologi',
        votes: 1
      }
    ],
    tags: []
  },
  {
    id: 20299,
    text:
      'Intro: Du instruerer en hypertensionspatient om selv-måling af BT i hjemmet. Hun spørger om hvor lang tid, hun mindst skal holde sig i hvile før målingerne.\n\nSpørgsmål: Hvad vil du sige?',
    answer1: '5 minutter',
    answer2: '10 minutter',
    answer3: '15 minutter',
    image: null,
    examSetQno: 29,
    examSetId: 315,
    semester: 1,
    correctAnswers: [1],
    examSet: {
      id: 315,
      year: 2013,
      season: 'E',
      semesterId: 1,
      semester: {
        id: 1,
        value: 7,
        name: 'Inflammation',
        shortName: 'Inf'
      }
    },
    publicComments: [],
    specialties: [],
    tags: []
  },
  {
    id: 21297,
    text:
      'I dit ambulatorium møder du en 36 årig kvinde med essentiel hypertension og hypertensive organforandringer i form af let nedsat nyrefunktion med eGFR = 60 ml/min og mikroalbuminuri. Patienten er i behandling med furosemid, ACE-hæmmer og beta-receptorblokerende middel. På grund af systolisk blodtryk over 140 mmHg supplerer du behandlingen med calciumantagonisten, amlodipin 5 mg dgl.\n\nVed næste ambulante kontrol 3 uger senere har patienten tydelige ankelødem bilat.\n\nHvordan vil du handle?',
    answer1: 'Øge dosis af furosemid',
    answer2: 'Seponere behandlingen med amlodipin',
    answer3: 'Kontrollere nyrefunktionen',
    image: null,
    examSetQno: 65,
    examSetId: 313,
    semester: 1,
    correctAnswers: [2],
    examSet: {
      id: 313,
      year: 2012,
      season: 'E',
      semesterId: 1,
      semester: {
        id: 1,
        value: 7,
        name: 'Inflammation',
        shortName: 'Inf'
      }
    },
    publicComments: [
      {
        id: 528,
        text: 'Ødemer er en meget almindelig bivirkning ved amlodipin',
        questionId: 21297,
        userId: 16,
        createdAt: '2018-12-20T09:37:13.000Z',
        updatedAt: '2019-04-24T17:38:33.000Z',
        user: {
          username: 'Kabu',
          id: 16
        }
      }
    ],
    specialties: [
      {
        questionId: 21297,
        specialtyId: 4,
        maxVotes: 1,
        specialtyName: 'Nefrologi',
        votes: 1
      }
    ],
    tags: []
  }
];

const user = new schema.Entity('users');
const publicComment = new schema.Entity('publicComments', { author: user });
const privateComment = new schema.Entity('privateComments', { author: user });
const specialty = new schema.Entity('specialties');
const tag = new schema.Entity('tags');
const examSet = new schema.Entity('examSets');
const question = new schema.Entity('questions', {
  examSet,
  publicComments: [publicComment],
  privateComments: [privateComment],
  specialties: [specialty],
  tags: [tag]
});

//eslint-disable-next-line no-console
console.log(normalize(input, [question]));

const initialState = {};

export default createReducer(initialState, {
  [types.FETCH_QUESTIONS_SUCCESS]: (state, action) => {
    state = { ...state, ...action.payload };
  },

  [types.FETCH_QUESTIONS_FAILURE]: () => {
    return initialState;
  }
});
