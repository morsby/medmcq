import _ from 'lodash';

export const urls = {
  root: '/',
  quiz: '/quiz',
  add: '/add',
  about: '/om-siden',
  contact: '/kontakt',
  signup: '/opret',
  login: '/login',
  logout: '/logout',
  profile: '/profil',
  editProfile: '/profil/rediger',
  forgotPassword: '/glemt-kodeord', //HVIS DENNE ÆNDRES SKAL OGSÅ ÆNDRES I API'ens config/urls.js
  resetPassword: '/nyt-kodeord',
  print: '/print'
};

export const semestre = [
  { text: '7. semester (Inflammation)', value: 7, name: 'Inflammation' },
  { text: '8. semester (Abdomen)', value: 8, name: 'Abdomen' },
  { text: '9. semester (Hjerte-lunge-kar)', value: 9, name: 'HLK' },
  { text: '11. semester (Familie-samfund / GOP)', value: 11, name: 'GOP' }
];

/**
 * Function to get the semester from the 'semestre' array.
 * @param  {Number} semester Semesteret (7 || 8 || 9 || 11)
 * @return {Object}          Objektet der svarer til semesteret.
 */
export const getSemester = (semester) => _.find(semestre, { value: semester });

export const specialer = {
  7: [
    { value: 'gastroenterologi', text: 'Gastroenterologi' },
    { value: 'hæmatologi', text: 'Hæmatologi' },
    { value: 'infektionsmedicin', text: 'Infektionsmedicin' },
    { value: 'nefrologi', text: 'Nefrologi' },
    { value: 'reumatologi', text: 'Reumatologi' },
    { value: 'almen_medicin', text: 'Almen medicin' },
    { value: 'klinisk_biokemi', text: 'Klinisk biokemi' },
    { value: 'klinisk_mikrobiologi', text: 'Klinisk mikrobiologi' },
    { value: 'klinisk_immunologi', text: 'Klinisk immunologi' }
  ],
  8: [
    {
      value: 'abdominalkirurgi',
      text: 'Abdominalkirurgi'
    },
    { value: 'plastikkirurgi', text: 'Plastikkirurgi' },
    {
      value: 'urologi',
      text: 'Urologi'
    },
    { value: 'onkologi', text: 'Onkologi' },
    { value: 'socialmedicin', text: 'Socialmedicin' },
    { value: 'almen_medicin', text: 'Almen medicin' },
    { value: 'traumatologi', text: 'Traumatologi' }
  ],
  9: [
    { value: 'anæstesiologi', text: 'Anæstesiologi' },
    {
      value: 'kardiologi',
      text: 'Kardiologi'
    },
    { value: 'lungemedicin', text: 'Lungemedicin' },
    { value: 'karkirurgi', text: 'Karkirurgi' },
    { value: 'thoraxkirurgi', text: 'Thoraxkirurgi' },
    { value: 'almen_medicin', text: 'Almen medicin' }
  ],
  11: [
    { value: 'gyn', text: 'Gynækologi/Gynaecology' },
    { value: 'obs', text: 'Obstetrik/Obstetrics' },
    { value: 'pæd/ped', text: 'Pædiatri/Pediatrics' },
    {
      value: 'retsmedicin/forensic_medicine',
      text: 'Retsmedicin/Forensic medicine'
    },
    {
      value: 'klinisk_genetik/clinical_genetics',
      text: 'Klinisk genetik/Clinical genetics'
    },
    { value: 'almen_medicin/gp', text: 'Almen medicin/General practice' }
  ]
};

export const tags = {
  7: [{ value: 'paraklinik', text: 'Paraklinik' }, { value: 'radiologi', text: 'Radiologi' }],
  8: [
    { value: 'paraklinik', text: 'Paraklinik' },
    { value: 'teoretisk_spørgsmål', text: 'Teoretisk spørgsmål' },
    { value: 'oesophagus_ventrikel_duodenum', text: 'Øsophagus, ventrikel og duodenum' },
    { value: 'duodenum_pancreas_milt', text: 'Duodenum, pancreas og milt' },
    { value: 'leversygdomme', text: 'Leversygdomme' },
    { value: 'tyndtarm_colon_rectum', text: 'Tyndtarm, colon og rectum' },
    { value: 'børn', text: 'Børn' },
    { value: 'anallidelser', text: 'Anallidelser' },
    { value: 'hudlidelser_sår', text: 'Hudlidelser og sår' }
  ],
  9: [
    { value: 'lungecancer', text: 'Lungecancer' },
    { value: 'kol', text: 'KOL' },
    { value: 'astma', text: 'Astma' },
    { value: 'restriktiv_lungesygdom', text: 'Restriktiv lungesygdom' },
    { value: 'tuberkulose', text: 'Tuberkulose' },
    { value: 'pneumoni', text: 'Pneumoni' },
    { value: 'pneumothorax', text: 'Pneumothorax' },
    { value: 'sarkoidose', text: 'Sarkoidose' },
    { value: 'sllergi', text: 'Allergi' },
    { value: 'medfødte_hjertesygdomme', text: 'Medfødte hjertesygdomme' },
    { value: 'aks', text: 'Akut koronart syndrom' },
    { value: 'angina_pectoris', text: 'Angina pectoris' },
    { value: 'hypertension', text: 'Hypertension' },
    { value: 'lungeemboli', text: 'Lungeemboli' },
    { value: 'hjerteinsufficiens', text: 'Hjerteinsufficiens' },
    { value: 'klapsygdomme', text: 'Klapsygdomme' },
    { value: 'arytmier', text: 'Arytmier' },
    { value: 'aortaaneurisme', text: 'Aortaaneurisme' },
    { value: 'kardiomyopatier', text: 'Kardiomyopatier' },
    { value: 'pulmonal hypertension', text: 'Pulmonal hypertension' },
    { value: 'endokarditis', text: 'Endokarditis' },
    { value: 'perikarditis', text: 'Perikarditis' },
    { value: 'synkope', text: 'Synkope' },
    { value: 'underekstremitets-iskæmi', text: 'Underekstremitets-iskæmi' },
    { value: 'specielle_karsygdomme', text: 'Specielle karsygdomme' },
    { value: 'pectus_carinatum_og_excavatum', text: 'Pectus carinatum og excavatum' },
    { value: 'Thoraxtraumer', text: 'Thoraxtraumer' },
    { value: 'ABCD', text: 'ABCD' },
    { value: 'sedation_og_anæstesi', text: 'Sedation og anæstesi' },
    { value: 'væske_og_elektrolytbehandling', text: 'Væske og elektrolytbehandling' },
    { value: 'postoperative_smerter', text: 'Postoperative smerter' },
    { value: 'a-gas', text: 'A-gas' },
    { value: 'radiologi', text: 'Radiologi' },
    { value: 'ekg', text: 'EKG' },
    { value: 'lfu', text: 'Lungefunktionsundersøgelse' }
  ],
  11: [{ value: 'paraklinik/paraclinical', text: 'Paraklinik/Paraclinical' }]
};

export const breakpoints = {
  mobile: 768
};

export const imageURL = (image) => {
  if (image.match('cloudinary')) {
    return image;
  } else {
    return `/images/${image}`;
  }
};
export const truncateText = (text, length = 30) => {
  if (!text) return;
  if (text.length + 3 > length) {
    return text.substring(0, length) + ' ...';
  } else return text;
};

export const allowedNs = {
  min: 1,
  max: 300
};

export const validationRegex = {
  // username validation stammer fra https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  username: /^[a-zA-ZæøåÆØÅ0-9]+([._]?[a-zA-Z0-9]+)*$/
};
