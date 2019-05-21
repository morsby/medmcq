const express = require('express');
const router = express.Router();
const superUsers = require('../../utils/superUsers');
const _ = require('lodash');
const Question = require('../../models/question');
const Specialty = require('../../models/specialty');
const Tag = require('../../models/tag');
const axios = require('axios');
const specialer = {
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

const tags = {
  7: [
    // Paraklinik
    { value: 'radiologi', text: 'Radiologi' },
    { value: 'a-gas', text: 'A-gas' },
    { value: 'patologi', text: 'Patologi' },

    // Organer
    { value: 'lever', text: 'Lever' },

    // Klinisk immunologi
    { value: 'blodtransfusion', text: 'Blodtransfusion' },
    { value: 'Transplantation', text: 'Transplantation' },
    { value: 'Immundefekt', text: 'Immundefekter' },

    // Klinisk biokemi
    { value: 'blodprøvetolkning', text: 'Blodprøvetolkning' },
    { value: 'koagulopati', text: 'Koagulopati' },

    // Specifikke sygdomme
    { value: 'syfilis', text: 'Syfilis' },

    // Diverse
    { value: 'journaloptagelse', text: 'Journaloptagelse' },
    { value: 'farmakologi', text: 'Farmakologi' },
    { value: 'statistik', text: 'Statistik' },
    { value: 'forskning', text: 'Forskning' },
    { value: 'molekylærbiologisk_metode', text: 'Molekylærbiologisk metode' },
    { value: 'børn', text: 'Børn' },

    // Slettet
    { value: 'paraklinik', text: '' }
  ],
  8: [
    // Paraklinik
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
    { value: 'ulcus', text: 'Ulcus' },
    { value: 'urininkontinens', text: 'Urininkontinens' },
    { value: 'divertikel', text: 'Divertikel' },
    { value: 'stomi', text: 'Stomi' },
    { value: 'gi_blødning', text: 'GI-blødning' },
    { value: 'infektion', text: 'Infektion' },

    // Andre organer
    { value: 'lunge', text: 'Lunge' },

    // Urologi
    { value: 'nyrer', text: 'Nyrer' },
    { value: 'urinveje', text: 'Urinveje' },
    { value: 'neuromuskulær_blæredysfunktion', text: 'Neuromuskulær blæredysfunktion' },
    { value: 'prostata', text: 'Prostata' },
    { value: 'testis', text: 'Testis, epididymis og scrotum' },
    { value: 'penis', text: 'Penis' },
    { value: 'hæmaturi', text: 'Hæmaturi' },
    { value: 'luts', text: 'LUTS' },
    { value: 'blære', text: 'Blære' },

    // Andet
    { value: 'børn', text: 'Børn' },

    // Plastikkirurgi
    { value: 'hudens_tumorer', text: 'Hudens tumorer' },
    { value: 'lap_plastik', text: 'Lap plastik' },
    { value: 'plastikkirurgisk_teknik', text: 'Plastikkirurgisk teknik' },
    { value: 'forbrændinger', text: 'Forbrændinger, forfrysninger og kemiske skader' },
    { value: 'kosmetisk_kirurgi', text: 'Kosmetisk kirurgi' },
    { value: 'decubitus', text: 'Decubitus' },
    { value: 'ar', text: 'Ar' },
    { value: 'nerveskader', text: 'Nerveskader' },
    { value: 'kraniofaciale_misdannelser', text: 'Kraniofaciale misdannelser' },
    { value: 'exfoliative_hudsygdomme', text: 'Exfoliative hudsygdomme' },
    { value: 'brysthypertrofi_og_brystanomalier', text: 'Brysthypertrofi og brystanomalier' },

    // Onkologi
    { value: 'strålebehandling', text: 'Strålebehandling' },
    { value: 'onkologiske_bivirkninger', text: 'Onkologiske bivirkninger' },
    { value: 'metastaser', text: 'Metastaser' },
    { value: 'stadieinddeling', text: 'Stadieinddeling' },
    { value: 'akutte_onkologiske_tilstande', text: 'Akutte onkologiske tilstande' },

    // Gamle tags -- må ikke slettes
    { value: 'paraklinik', text: '' },
    { value: 'hudlidelser_sår', text: '' },
    { value: 'duodenum_pancreas_milt', text: '' },
    { value: 'teoretisk_spørgsmål', text: '' },
    { value: 'blod_i_afføringen', text: '' }
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
  11: [
    { value: 'paraklinik/paraclinical', text: 'Paraklinik/Paraclinical' },
    { value: 'farmakologi/pharmacology', text: 'Farmakologi/Pharmacology' },
    { value: 'radiologi/radiology', text: 'Radiologi/Radiology' }
  ]
};

const postMetadata = async () => {
  for (let key in specialer) {
    specialer[key].forEach(async (speciale) => {
      await axios.post('http://localhost:3001/api/questions/metadata', {
        type: 'specialty',
        value: speciale.value,
        text: speciale.text,
        semester: Number(key)
      });
    });
  }

  for (let key in tags) {
    tags[key].forEach(async (tag) => {
      await axios.post('http://localhost:3001/api/questions/metadata', {
        type: 'specialty',
        value: tag.value,
        text: tag.text,
        semester: Number(key)
      });
    });
  }
};

router.get('/convert', async (req, res) => {
  postMetadata();

  // convertQuestions();
});

// Opret nyt speciale eller tag
router.post('/', async (req, res) => {
  const { type, value, text, semester } = req.body; // Disse parametre skal alle opgives i post requesten
  if (!type || !value || !text || !semester)
    return res.status(400).send('Du mangler at opgive alle parametre');

  if (type === 'specialty') {
    let specialty = await Specialty.findOne({ value: value, semester: semester });
    if (specialty) return res.status(404).send('Speciale findes allerede');

    specialty = new Specialty();

    specialty.votes = 0;
    specialty.value = value;
    specialty.text = text;
    specialty.semester = semester;

    await specialty.save();
    res.status(200).send({ message: 'Oprettet speciale', specialty: specialty });
  }

  if (type === 'tag') {
    let tag = await Tag.find({ value: value, semester: semester });
    if (tag) return res.status(404).send('Tag findes allerede');

    tag = new Tag();

    tag.votes = 0;
    tag.value = value;
    tag.text = text;
    tag.semester = semester;

    await tag.save();
    res.status(200).send({ message: 'Oprettet tag', tag: tag });
  }
});

// Konvertering af gammelt tagsystem
const convertQuestions = () => {
  const questions = Question.find();

  questions.forEach((q) => {
    q.votes.forEach((vote) => {
      const specialty = Specialty.findOne(vote.specialty);

      specialty.votes = 1;
      specialty.users = vote.users;

      q.newSpecialties.push(specialty);
    });

    q.tagVotes.forEach((tagVote) => {
      const tag = Tag.findOne(tagVote.tag);

      tag.votes = 1;
      tag.users = tagVote.users;

      q.newTags.push(tag);
    });

    q.save();
  });
};

// Stem på metadata
router.put('/vote/:question_id', async (req, res) => {
  const { type, value, vote, user } = req.body; // Vote er et tal, enten 1 eller -1 (for upvote eller downvote)

  let question = await Question.findById(req.params.question_id);
});

module.exports = router;
