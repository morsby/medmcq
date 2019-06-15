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
  forgotPassword: '/glemt-kodeord', // HVIS DENNE ÆNDRES SKAL OGSÅ ÆNDRES I API'ens config/urls.js
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
    // Paraklinik
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'a-gas', text: 'A-gas', category: 'paraklinik' },
    { value: 'patologi', text: 'Patologi', category: 'paraklinik' },

    // Reumatologi
    {
      value: 'artritis_og_artrose',
      text: 'Artritis og artrose',
      category: 'reumatologi'
    },
    {
      value: 'bindevævssygdomme',
      text: 'Bindevævssygdomme',
      category: 'reumatologi'
    },
    { value: 'vaskulitis', text: 'Vaskulitis', category: 'reumatologi' },
    {
      value: 'lænderygsygdomme',
      text: 'Lænderygsygdomme',
      category: 'reumatologi'
    },

    // Gastroenterologi
    { value: 'reflux', text: 'Reflux', category: 'gastroenterologi' },
    { value: 'ulcus', text: 'Ulcus', category: 'gastroenterologi' },
    {
      value: 'inflammatoriske_tarmsygdomme',
      text: 'Inflammatoriske tarmsygdomme',
      category: 'gastroenterologi'
    },
    { value: 'cøliaki', text: 'Cøliaki', category: 'gastroenterologi' },
    {
      value: 'lever',
      text: 'Lever og galdeveje',
      category: 'gastroenterologi'
    },
    { value: 'pancreas', text: 'Pancreas', category: 'gastroenterologi' },

    // Hæmatologi
    { value: 'anæmi', text: 'Anæmi', category: 'hæmatologi' },
    { value: 'trombocytopeni', text: 'Trombocytopeni', category: 'hæmatologi' },
    { value: 'leukæmi', text: 'Leukæmi', category: 'hæmatologi' },
    { value: 'lymfom', text: 'Lymfom', category: 'hæmatologi' },
    {
      value: 'myelodysplastisk_syndrom',
      text: 'Myelodysplastisk syndrom',
      category: 'hæmatologi'
    },
    {
      value: 'myeloproliferative_neoplasier',
      text: 'Myeloproliferative neoplasier',
      category: 'hæmatologi'
    },
    {
      value: 'myelomatose',
      text: 'Plasmacellesygdomme',
      category: 'hæmatologi'
    },

    // Klinisk immunologi
    {
      value: 'blodtransfusion',
      text: 'Blodtransfusion',
      category: 'klinisk immunologi'
    },
    {
      value: 'Transplantation',
      text: 'Transplantation',
      category: 'klinisk immunologi'
    },
    {
      value: 'Immundefekt',
      text: 'Immundefekter',
      category: 'klinisk immunologi'
    },

    // Klinisk biokemi
    {
      value: 'blodprøvetolkning',
      text: 'Blodprøvetolkning',
      category: 'klinisk biokemi'
    },
    { value: 'koagulopati', text: 'Koagulopati', category: 'klinisk biokemi' },

    // Infektionsmedicin
    {
      value: 'sepsis',
      text: 'Bakteriæmi og sepsis',
      category: 'infektionsmedicin'
    },
    {
      value: 'neuroinfektioner',
      text: 'Neuroinfektioner',
      category: 'infektionsmedicin'
    },
    {
      value: 'luftvejsinfektioner',
      text: 'Luftvejsinfektioner',
      category: 'infektionsmedicin'
    },
    {
      value: 'endocarditis',
      text: 'Endocarditis',
      category: 'infektionsmedicin'
    },
    { value: 'hepatitis', text: 'Hepatitis', category: 'infektionsmedicin' },
    {
      value: 'gastroenteritis',
      text: 'Gastroenteritis',
      category: 'infektionsmedicin'
    },
    {
      value: 'urinvejsinfektioner',
      text: 'Urinvejsinfektioner',
      category: 'infektionsmedicin'
    },
    {
      value: 'syfilis',
      text: 'Seksuelt overførte sygdomme',
      category: 'infektionsmedicin'
    },
    {
      value: 'infektioner_i_hud_knogler_og_bloddele',
      text: 'Infektioner i hud, knogler og bløddele',
      category: 'infektionsmedicin'
    },
    { value: 'hiv', text: 'HIV', category: 'infektionsmedicin' },
    {
      value: 'tuberkulose',
      text: 'Tuberkulose',
      category: 'infektionsmedicin'
    },
    {
      value: 'eksotiske_sygdomme',
      text: 'Eksotiske sygdomme',
      category: 'infektionsmedicin'
    },

    // Diverse
    {
      value: 'journaloptagelse',
      text: 'Journaloptagelse',
      category: 'diverse'
    },
    { value: 'farmakologi', text: 'Farmakologi', category: 'diverse' },
    { value: 'statistik', text: 'Statistik', category: 'diverse' },
    { value: 'forskning', text: 'Forskning', category: 'diverse' },
    {
      value: 'molekylærbiologisk_metode',
      text: 'Molekylærbiologisk metode',
      category: 'diverse'
    },
    { value: 'børn', text: 'Børn', category: 'diverse' },

    // Slettet
    { value: 'paraklinik', text: '' }
  ],
  8: [
    // Paraklinik
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'farmakologi', text: 'Farmakologi', category: 'paraklinik' },

    // Abdominalkirurgi
    {
      value: 'akut_abdomen',
      text: 'Akut abdomen',
      category: 'abdominalkirurgi'
    },
    {
      value: 'oesophagus_ventrikel_duodenum',
      text: 'Øsophagus, ventrikel og duodenum',
      category: 'abdominalkirurgi'
    },
    {
      value: 'tyndtarm_colon_rectum',
      text: 'Tyndtarm, colon og rectum',
      category: 'abdominalkirurgi'
    },
    { value: 'pancreas', text: 'Pancreas', category: 'abdominalkirurgi' },
    {
      value: 'leversygdomme',
      text: 'Lever og galdeveje',
      category: 'abdominalkirurgi'
    },
    { value: 'milt', text: 'Milt', category: 'abdominalkirurgi' },
    {
      value: 'anallidelser',
      text: 'Anallidelser',
      category: 'abdominalkirurgi'
    },
    { value: 'mamma', text: 'Mamma', category: 'abdominalkirurgi' },
    { value: 'hernier', text: 'Hernier', category: 'abdominalkirurgi' },
    {
      value: 'fedmekirurgi',
      text: 'Bariatrisk kirurgi',
      category: 'abdominalkirurgi'
    },
    {
      value: 'endokrinologi',
      text: 'Endokrinologi',
      category: 'abdominalkirurgi'
    },
    { value: 'ulcus', text: 'Ulcus', category: 'abdominalkirurgi' },
    {
      value: 'urininkontinens',
      text: 'Urininkontinens',
      category: 'abdominalkirurgi'
    },
    { value: 'divertikel', text: 'Divertikel', category: 'abdominalkirurgi' },
    { value: 'stomi', text: 'Stomi', category: 'abdominalkirurgi' },
    { value: 'gi_blødning', text: 'GI-blødning', category: 'abdominalkirurgi' },
    { value: 'infektion', text: 'Infektion', category: 'abdominalkirurgi' },

    // Organer
    { value: 'lunge', text: 'Lunge', category: 'organer' },

    // Urologi
    { value: 'nyrer', text: 'Nyrer', category: 'urologi' },
    { value: 'urinveje', text: 'Urinveje', category: 'urologi' },
    {
      value: 'sten_i_urinvejene',
      text: 'Sten i urinvejene',
      category: 'urologi'
    },
    {
      value: 'neuromuskulær_blæredysfunktion',
      text: 'Neuromuskulær blæredysfunktion',
      category: 'urologi'
    },
    { value: 'prostata', text: 'Prostata', category: 'urologi' },
    {
      value: 'testis',
      text: 'Testis, epididymis og scrotum',
      category: 'urologi'
    },
    { value: 'penis', text: 'Penis', category: 'urologi' },
    { value: 'hæmaturi', text: 'Hæmaturi', category: 'urologi' },
    { value: 'luts', text: 'LUTS', category: 'urologi' },
    { value: 'blære', text: 'Blære', category: 'urologi' },

    // Andet
    { value: 'børn', text: 'Børn', category: 'andet' },

    // Plastikkirurgi
    {
      value: 'hudens_tumorer',
      text: 'Hudens tumorer',
      category: 'plastikkirurgi'
    },
    { value: 'lap_plastik', text: 'Lap plastik', category: 'plastikkirurgi' },
    {
      value: 'plastikkirurgisk_teknik',
      text: 'Plastikkirurgisk teknik',
      category: 'plastikkirurgi'
    },
    {
      value: 'forbrændinger',
      text: 'Forbrændinger, forfrysninger og kemiske skader',
      category: 'plastikkirurgi'
    },
    {
      value: 'kosmetisk_kirurgi',
      text: 'Kosmetisk kirurgi',
      category: 'plastikkirurgi'
    },
    { value: 'decubitus', text: 'Decubitus', category: 'plastikkirurgi' },
    { value: 'ar', text: 'Ar', category: 'plastikkirurgi' },
    { value: 'nerveskader', text: 'Nerveskader', category: 'plastikkirurgi' },
    {
      value: 'kraniofaciale_misdannelser',
      text: 'Kraniofaciale misdannelser',
      category: 'plastikkirurgi'
    },
    {
      value: 'exfoliative_hudsygdomme',
      text: 'Exfoliative hudsygdomme',
      category: 'plastikkirurgi'
    },
    {
      value: 'brysthypertrofi_og_brystanomalier',
      text: 'Brysthypertrofi og brystanomalier',
      category: 'plastikkirurgi'
    },
    {
      value: 'postbariatrisk_kirurgi',
      text: 'Postbariatrisk kirurgi',
      category: 'plastikkirurgi'
    },

    // Onkologi
    {
      value: 'strålebehandling',
      text: 'Strålebehandling',
      category: 'onkologi'
    },
    {
      value: 'onkologiske_bivirkninger',
      text: 'Onkologiske bivirkninger',
      category: 'onkologi'
    },
    { value: 'metastaser', text: 'Metastaser', category: 'onkologi' },
    { value: 'stadieinddeling', text: 'Stadieinddeling', category: 'onkologi' },
    {
      value: 'akutte_onkologiske_tilstande',
      text: 'Akutte onkologiske tilstande',
      category: 'onkologi'
    },

    // Gamle tags -- må ikke slettes
    { value: 'paraklinik', text: '' },
    { value: 'hudlidelser_sår', text: '' },
    { value: 'duodenum_pancreas_milt', text: '' },
    { value: 'teoretisk_spørgsmål', text: '' },
    { value: 'blod_i_afføringen', text: '' }
  ],
  9: [
    // Paraklinik
    { value: 'a-gas', text: 'A-gas', category: 'paraklinik' },
    { value: 'ekg', text: 'EKG', category: 'paraklinik' },
    {
      value: 'lfu',
      text: 'Lungefunktionsundersøgelse',
      category: 'paraklinik'
    },
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'farmakologi', text: 'Farmakologi', category: 'paraklinik' },

    // Anæstesi
    { value: 'ABCD', text: 'ABCD', category: 'anæstesi' },
    {
      value: 'sedation_og_anæstesi',
      text: 'Sedation og anæstesi',
      category: 'anæstesi'
    },
    {
      value: 'væske_og_elektrolytbehandling',
      text: 'Væske og elektrolytbehandling',
      category: 'anæstesi'
    },
    {
      value: 'postoperative_smerter',
      text: 'Postoperative smerter',
      category: 'anæstesi'
    },

    // Kardiologi
    { value: 'aks', text: 'Akut koronart syndrom', category: 'kardiologi' },
    {
      value: 'angina_pectoris',
      text: 'Angina pectoris',
      category: 'kardiologi'
    },
    { value: 'hypertension', text: 'Hypertension', category: 'kardiologi' },
    { value: 'lungeemboli', text: 'Lungeemboli', category: 'kardiologi' },
    {
      value: 'hjerteinsufficiens',
      text: 'Hjerteinsufficiens',
      category: 'kardiologi'
    },
    { value: 'klapsygdomme', text: 'Klapsygdomme', category: 'kardiologi' },
    { value: 'arytmier', text: 'Arytmier', category: 'kardiologi' },
    { value: 'aortaaneurisme', text: 'Aortaaneurisme', category: 'kardiologi' },
    {
      value: 'medfødte_hjertesygdomme',
      text: 'Medfødte hjertesygdomme',
      category: 'kardiologi'
    },
    {
      value: 'kardiomyopatier',
      text: 'Kardiomyopatier',
      category: 'kardiologi'
    },
    {
      value: 'pulmonal hypertension',
      text: 'Pulmonal hypertension',
      category: 'kardiologi'
    },
    { value: 'endokarditis', text: 'Endokarditis', category: 'kardiologi' },
    {
      value: 'perikarditis',
      text: 'Perikarditis og tamponade',
      category: 'kardiologi'
    },
    { value: 'synkope', text: 'Synkope', category: 'kardiologi' },
    {
      value: 'aortadissektion',
      text: 'Aortadissektion',
      category: 'kardiologi'
    },
    { value: 'aterosklerose', text: 'Aterosklerose', category: 'kardiologi' },

    // Lungemedicin
    { value: 'lungecancer', text: 'Lungecancer', category: 'lungemedicin' },
    { value: 'kol', text: 'KOL', category: 'lungemedicin' },
    { value: 'astma', text: 'Astma', category: 'lungemedicin' },
    {
      value: 'restriktiv_lungesygdom',
      text: 'Restriktiv lungesygdom',
      category: 'lungemedicin'
    },
    { value: 'tuberkulose', text: 'Tuberkulose', category: 'lungemedicin' },
    { value: 'pneumoni', text: 'Pneumoni', category: 'lungemedicin' },
    { value: 'pneumothorax', text: 'Pneumothorax', category: 'lungemedicin' },
    { value: 'sarkoidose', text: 'Sarkoidose', category: 'lungemedicin' },
    { value: 'allergi', text: 'Allergi', category: 'lungemedicin' },
    {
      value: 'allergisk_alveolitis',
      text: 'Allergisk alveolitis',
      category: 'lungemedicin'
    },
    {
      value: 'pleuraeffusion',
      text: 'Pleuraeffusion',
      category: 'lungemedicin'
    },

    // Karkirurgi
    {
      value: 'underekstremitets-iskæmi',
      text: 'Underekstremitets-iskæmi',
      category: 'karkirurgi'
    },
    {
      value: 'specielle_karsygdomme',
      text: 'Specielle karsygdomme',
      category: 'karkirurgi'
    },
    { value: 'venesygdomme', text: 'Venesygdomme', category: 'karkirurgi' },

    // Thoraxkirurgi
    { value: 'pci_og_cabg', text: 'PCI og CABG', category: 'thoraxkirurgi' },
    {
      value: 'pectus_carinatum_og_excavatum',
      text: 'Pectus carinatum og excavatum',
      category: 'thoraxkirurgi'
    },
    {
      value: 'Thoraxtraumer',
      text: 'Thoraxtraumer',
      category: 'thoraxkirurgi'
    },
    { value: 'oesophagus', text: 'Oesophagus', category: 'thoraxkirurgi' },

    // AP / Symptomkomplekser
    { value: 'dyspnø', text: 'Dyspnø', category: 'symptomkomplekser' }
  ],
  11: [
    {
      value: 'paraklinik/paraclinical',
      text: 'Paraklinik/Paraclinical',
      category: 'tags'
    },
    {
      value: 'farmakologi/pharmacology',
      text: 'Farmakologi/Pharmacology',
      category: 'tags'
    },
    {
      value: 'radiologi/radiology',
      text: 'Radiologi/Radiology',
      category: 'tags'
    }
  ]
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

export const insertOrRemoveFromArray = (array, elem) => {
  array = [...array];
  const index = array.indexOf(elem);
  if (index > -1) {
    array.splice(index, 1);
  } else {
    array.push(elem);
  }
  return array;
};
