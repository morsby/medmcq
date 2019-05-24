const express = require('express');
const router = express.Router();
const superUsers = require('../../utils/superUsers');
const _ = require('lodash');
const Question = require('../../models/question');
const Specialty = require('../../models/specialty');
const Tag = require('../../models/tag');
const axios = require('axios');
const mongoose = require('mongoose');

String.prototype.toObjectId = function() {
  var ObjectId = require('mongoose').Types.ObjectId;
  return new ObjectId(this.toString());
};

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
    { value: 'børn', text: 'Børn' }
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
    { value: 'akutte_onkologiske_tilstande', text: 'Akutte onkologiske tilstande' }
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
  console.log('Starting posting...');
  try {
    for (let key in specialer) {
      for (let speciale of specialer[key]) {
        if (!speciale.text) continue;

        await axios.post('http://localhost:3001/api/questions/metadata', {
          type: 'specialty',
          text: speciale.text,
          value: speciale.value,
          semester: Number(key)
        });
      }
    }

    for (let key in tags) {
      for (let tag of tags[key]) {
        if (!tag.text) continue;

        await axios.post('http://localhost:3001/api/questions/metadata', {
          type: 'tag',
          text: tag.text,
          value: tag.value,
          semester: Number(key)
        });
      }
    }

    console.log('Done posting');
  } catch (error) {
    console.log(new Error(error));
  }
};

// Konvertering af gammelt tagsystem
const convertQuestions = async () => {
  let counting = 1;
  const questions = await Question.find();
  const specialties = await Specialty.find();
  const tags = await Tag.find();

  for (let q of questions) {
    console.log('Converting question ' + counting);
    let newTags = [];
    let newSpecialties = [];

    for (let vote of q.votes) {
      const specialty = _.find(specialties, { value: vote.specialty, semester: q.semester });
      if (!specialty) continue;

      let users = [];
      for (let user of vote.users) {
        users.push({ user, vote: 1 });
      }

      newSpecialties.push({
        specialty: specialty._id,
        votes: vote.users.length,
        users
      });
    }

    for (let tagVote of q.tagVotes) {
      const tag = _.find(tags, { value: tagVote.tag, semester: q.semester });
      if (!tag) continue;

      let users = [];
      for (let user of tagVote.users) {
        users.push({ user, vote: 1 });
      }

      newTags.push({ tag: tag._id, votes: tagVote.users.length, users });
    }

    q.newSpecialties = newSpecialties;
    q.newTags = newTags;
    counting++;
    await q.save();
  }
  console.log('Done converting!');
};

const cleanupQuestions = async () => {
  console.log('Starting cleanup ...');
  const questions = await Question.find();
  let count = 1;

  for (let q of questions) {
    console.log('Cleaning question ' + count);
    q.tags = undefined;
    q.votes = undefined;
    q.tagVotes = undefined;
    q.specialty = undefined;

    await q.save();
    count++;
  }

  console.log('... Done cleanup');
};

router.get('/convert', async (req, res) => {
  try {
    res
      .status(200)
      .send('Started conversion, this will take a while... DO NOT REFRESH THIS PAGE EVER!');
    await postMetadata();
    await convertQuestions();
    // await cleanupQuestions();

    console.log('All done!');
  } catch (error) {
    console.log(new Error(error));
  }
});

router.post('/question/:id', async (req, res) => {
  const { user, value, type } = req.body;
  const question = await Question.findById(req.params.id);

  if (type === 'specialty') {
    const specialty = await Specialty.findOne({ value: value });
    question.newSpecialties.push({
      specialty: specialty,
      votes: 1,
      users: [{ user: user, vote: 1 }]
    });
  }
  if (type === 'tag') {
    const tag = await Tag.findOne({ value: value });
    question.newTags.push({ tag: tag, votes: 1, users: [{ user: user, vote: 1 }] });
  }

  const result = await question.save();
  res.status(200).send(result);
});

// Opret nyt speciale eller tag
router.post('/', async (req, res) => {
  try {
    const { type, text, value, semester } = req.body; // Disse parametre skal alle opgives i post requesten
    if (!type || !text || !semester)
      return res.status(400).send('Du mangler at opgive alle parametre');

    if (type === 'specialty') {
      let specialty = await Specialty.findOne({ semester: semester, text: text });
      if (specialty) return res.status(404).send('Speciale findes allerede');

      specialty = new Specialty();

      specialty.text = text;
      specialty.value = value;
      specialty.semester = semester;

      await specialty.save();
      res.status(200).send({ message: 'Oprettet speciale', specialty: specialty });
    }

    if (type === 'tag') {
      let tag = await Tag.findOne({ text: text, semester: semester });
      if (tag) return res.status(404).send('Tag findes allerede');

      tag = new Tag();

      tag.text = text;
      tag.value = value;
      tag.semester = semester;

      await tag.save();
      res.status(200).send({ message: 'Oprettet tag', tag: tag });
    }
  } catch (error) {
    console.log(new Error(error));
  }
});

router.get('/', async (req, res) => {
  const { sem } = req.query;

  const tags = await Tag.find({ semester: sem });
  const specialties = await Specialty.find({ semester: sem });

  res.status(200).send({ tags, specialties });
});

router.get('/count', async (req, res) => {
  const tags = await Tag.find({ semester: req.query.sem });
  const specialities = await Specialty.find({ semester: req.query.sem });
  let tagCount = [];
  let specialtyCount = [];

  // Count specialties
  for (let s of specialities) {
    const count = await Question.find({
      'newSpecialties.specialty': s._id
    }).countDocuments();

    specialtyCount.push({
      _id: s._id,
      semester: s.semester,
      text: s.text,
      count
    });
  }

  // Count tags
  for (let t of tags) {
    const count = await Question.find({
      'newTags.tag': t._id
    }).countDocuments();

    tagCount.push({
      _id: t._id,
      semester: t.semester,
      text: t.text,
      count
    });
  }

  const count = { specialtyCount, tagCount };

  res.status(200).send(count);
});

router.get('/all', async (req, res) => {
  const questions = await Question.find();

  res.status(200).send({ questions });
});

// Stem på metadata
router.put('/vote', async (req, res) => {
  const { type, questionId, metadataId, vote, user } = req.body; // Vote er et tal, enten 1 eller -1 (for upvote eller downvote)

  if (!user) return res.status(404).send('Not logged in');

  let question = await Question.findById(questionId);
  if (type === 'specialty') {
    let metadata = _.find(question.newSpecialties, { _id: mongoose.Types.ObjectId(metadataId) });
    let currentUser = _.findIndex(metadata.users, { user: mongoose.Types.ObjectId(user) });
    if (currentUser === -1) {
      metadata.users.push({ user: user, vote: vote });
    } else {
      // User already voted
      metadata.votes -= metadata.users[currentUser].vote;
      metadata.users[currentUser].vote = vote;
    }

    metadata.votes += vote;
    // Hvis vote kommer under 1, så fjern specialet
    if (metadata.votes < 1) {
      let metadataIndex = _.findIndex(question.newSpecialties, {
        _id: mongoose.Types.ObjectId(metadataId)
      });
      question.newSpecialties.splice(metadataIndex, 1);
    }
  }

  // Similar to the above, but with tags
  if (type === 'tag') {
    let metadata = _.find(question.newTags, { _id: mongoose.Types.ObjectId(metadataId) });
    let currentUser = _.findIndex(metadata.users, { user: mongoose.Types.ObjectId(user) });
    if (currentUser === -1) {
      metadata.users.push({ user: user, vote: vote });
    } else {
      // User already voted
      metadata.votes -= metadata.users[currentUser].vote;
      metadata.users[currentUser].vote = vote;
    }

    metadata.votes += vote;
    // Hvis vote kommer under 1, så fjern tagget
    if (metadata.votes < 1) {
      let metadataIndex = _.findIndex(question.newTags, {
        _id: mongoose.Types.ObjectId(metadataId)
      });

      question.newTags.splice(metadataIndex, 1);
    }
  }

  const result = await question.save();
  res.status(200).send(result);
});

module.exports = router;
