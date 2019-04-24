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
    { value: 'klinisk_immunologi', text: 'Klinisk immunologi' },
    { value: 'paraklinik', text: '' }
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
  7: [
    { value: 'radiologi', text: 'Radiologi' },
    { value: 'a-gas', text: 'A-gas' },

    // Klinisk immunologi
    { value: 'blodtransfusion', text: 'Blodtransfusion' },
    { value: 'Transplantation', text: 'Transplantation' },
    { value: 'Immundefekt', text: 'Immundefekter' },

    // Klinisk biokemi
    { value: 'blodprøvetolkning', text: 'Blodprøvetolkning' },
    { value: 'koagulopati', text: 'Koagulopati' },

    // Diverse
    { value: 'journaloptagelse', text: 'Journaloptagelse' },
    { value: 'farmakologi', text: 'Farmakologi' },
    { value: 'statistik', text: 'Statistik' },
    { value: 'forskning', text: 'Forskning' },
    { value: 'molekylærbiologisk_metode', text: 'Molekylærbiologisk metode' },
    { value: 'paraklinik', text: '' }
  ],
  8: [
    { value: 'radiologi', text: 'Radiologi' },
    { value: 'farmakologi', text: 'Farmakologi' },

    // Abdominalkirurgi
    { value: 'akut_abdomen', text: 'Akut abdomen' },
    { value: 'oesophagus_ventrikel_duodenum', text: 'Øsophagus, ventrikel og duodenum' },
    { value: 'tyndtarm_colon_rectum', text: 'Tyndtarm, colon og rectum' },
    { value: 'pancreas', text: 'Pancreas' },
    { value: 'leversygdomme', text: 'Lever og galdeveje' },
    { value: 'milt', text: 'Milt' },
    { value: 'anallidelser', text: 'Anallidelser' },
    { value: 'mamma', text: 'Mamma' },
    { value: 'hernier', text: 'Hernier' },
    { value: 'fedmekirurgi', text: 'Bariatrisk kirurgi' },
    { value: 'endokrinologi', text: 'Endokrinologi' },

    // Urologi
    { value: 'nyrer', text: 'Nyrer' },
    { value: 'urinveje', text: 'Urinveje' },
    { value: 'blære', text: 'Blære' },
    { value: 'neuromuskulær_blæredysfunktion', text: 'Neuromuskulær blæredysfunktion' },
    { value: 'prostata', text: 'Prostata' },
    { value: 'testis', text: 'Testis, epididymis og scrotum' },
    { value: 'penis', text: 'Penis' },

    // Andet
    { value: 'børn', text: 'Børn' },

    // Plastikkirurgi
    { value: 'hudens_tumorer', text: 'Hudens tumorer' },
    { value: 'plastikkirurgisk_teknik', text: 'Plastikkirurgisk teknik' },
    { value: 'forbrændinger', text: 'Forbrændinger, forfrysninger og kemiske skader' },
    { value: 'kosmetisk_kirurgi', text: 'Kosmetisk kirurgi' },
    { value: 'decubitus', text: 'Decubitus' },
    { value: 'ar', text: 'Ar' },
    { value: 'nerveskader', text: 'Nerveskader' },
    { value: 'kraniofaciale_misdannelser', text: 'Kraniofaciale misdannelser' },

    // Onkologi
    { value: 'strålebehandling', text: 'Strålebehandling' },
    { value: 'onkologiske_bivirkninger', text: 'Onkologiske bivirkninger' },
    { value: 'metastaser', text: 'Metastaser' },
    { value: 'stadieinddeling', text: 'Stadieinddeling' },

    // Almen medicin / Symptomkomplekser
    { value: 'blod_i_afføringen', text: 'Blod i afføringen' },
    { value: 'gi_blødning', text: 'GI-blødning' },
    { value: 'hæmaturi', text: 'Hæmaturi' },
    { value: 'luts', text: 'LUTS' },

    // Gamle tags -- må ikke slettes
    { value: 'paraklinik', text: '' },
    { value: 'hudlidelser_sår', text: '' },
    { value: 'duodenum_pancreas_milt', text: '' },
    { value: 'teoretisk_spørgsmål', text: '' }
  ],
  9: [
    // Paraklinik
    { value: 'a-gas', text: 'A-gas' },
    { value: 'ekg', text: 'EKG' },
    { value: 'lfu', text: 'Lungefunktionsundersøgelse' },
    { value: 'radiologi', text: 'Radiologi' },
    { value: 'farmakologi', text: 'Farmakologi' },

    // Anæstesi
    { value: 'ABCD', text: 'ABCD' },
    { value: 'sedation_og_anæstesi', text: 'Sedation og anæstesi' },
    { value: 'væske_og_elektrolytbehandling', text: 'Væske og elektrolytbehandling' },
    { value: 'postoperative_smerter', text: 'Postoperative smerter' },

    // Hjertemedicin
    { value: 'aks', text: 'Akut koronart syndrom' },
    { value: 'angina_pectoris', text: 'Angina pectoris' },
    { value: 'hypertension', text: 'Hypertension' },
    { value: 'lungeemboli', text: 'Lungeemboli' },
    { value: 'hjerteinsufficiens', text: 'Hjerteinsufficiens' },
    { value: 'klapsygdomme', text: 'Klapsygdomme' },
    { value: 'arytmier', text: 'Arytmier' },
    { value: 'aortaaneurisme', text: 'Aortaaneurisme' },
    { value: 'medfødte_hjertesygdomme', text: 'Medfødte hjertesygdomme' },
    { value: 'kardiomyopatier', text: 'Kardiomyopatier' },
    { value: 'pulmonal hypertension', text: 'Pulmonal hypertension' },
    { value: 'endokarditis', text: 'Endokarditis' },
    { value: 'perikarditis', text: 'Perikarditis og tamponade' },
    { value: 'synkope', text: 'Synkope' },
    { value: 'aortadissektion', text: 'Aortadissektion' },

    // Lungemedicin
    { value: 'lungecancer', text: 'Lungecancer' },
    { value: 'kol', text: 'KOL' },
    { value: 'astma', text: 'Astma' },
    { value: 'restriktiv_lungesygdom', text: 'Restriktiv lungesygdom' },
    { value: 'tuberkulose', text: 'Tuberkulose' },
    { value: 'pneumoni', text: 'Pneumoni' },
    { value: 'pneumothorax', text: 'Pneumothorax' },
    { value: 'sarkoidose', text: 'Sarkoidose' },
    { value: 'allergi', text: 'Allergi' },
    { value: 'allergisk_alveolitis', text: 'Allergisk alveolitis' },

    // Karkirurgi
    { value: 'underekstremitets-iskæmi', text: 'Underekstremitets-iskæmi' },
    { value: 'specielle_karsygdomme', text: 'Specielle karsygdomme' },
    { value: 'venesygdomme', text: 'Venesygdomme' },

    // Thoraxkirurgi
    { value: 'pectus_carinatum_og_excavatum', text: 'Pectus carinatum og excavatum' },
    { value: 'Thoraxtraumer', text: 'Thoraxtraumer' },
    { value: 'oesophagus', text: 'Oesophagus' },

    // AP / Symptomkomplekser
    { value: 'dyspnø', text: 'Dyspnø' }
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
