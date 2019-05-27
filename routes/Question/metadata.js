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
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'a-gas', text: 'A-gas', category: 'paraklinik' },
    { value: 'patologi', text: 'Patologi', category: 'paraklinik' },
    { value: 'farmakologi', text: 'Farmakologi', category: 'paraklinik' },

    // Organer
    { value: 'lever', text: 'Lever', category: 'organer' },

    // Klinisk immunologi
    { value: 'blodtransfusion', text: 'Blodtransfusion', category: 'klinisk immunologi' },
    { value: 'Transplantation', text: 'Transplantation', category: 'klinisk immunologi' },
    { value: 'Immundefekt', text: 'Immundefekter', category: 'klinisk immunologi' },

    // Klinisk biokemi
    { value: 'blodprøvetolkning', text: 'Blodprøvetolkning', category: 'klinisk biokemi' },
    { value: 'koagulopati', text: 'Koagulopati', category: 'klinisk biokemi' },

    // Specifikke sygdomme
    { value: 'syfilis', text: 'Syfilis', category: 'sygdomme' },

    // Diverse
    { value: 'journaloptagelse', text: 'Journaloptagelse', category: 'diverse' },
    { value: 'statistik', text: 'Statistik', category: 'diverse' },
    { value: 'forskning', text: 'Forskning', category: 'diverse' },
    { value: 'molekylærbiologisk_metode', text: 'Molekylærbiologisk metode', category: 'diverse' },
    { value: 'børn', text: 'Børn', category: 'diverse' }
  ],
  8: [
    // Paraklinik
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'farmakologi', text: 'Farmakologi', category: 'paraklinik' },

    // Abdominalkirurgi
    { value: 'akut_abdomen', text: 'Akut abdomen', category: 'abdominalkirurgi' },
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
    { value: 'leversygdomme', text: 'Lever og galdeveje', category: 'abdominalkirurgi' },
    { value: 'milt', text: 'Milt', category: 'abdominalkirurgi' },
    { value: 'anallidelser', text: 'Anallidelser', category: 'abdominalkirurgi' },
    { value: 'mamma', text: 'Mamma', category: 'abdominalkirurgi' },
    { value: 'hernier', text: 'Hernier', category: 'abdominalkirurgi' },
    { value: 'fedmekirurgi', text: 'Bariatrisk kirurgi', category: 'abdominalkirurgi' },
    { value: 'endokrinologi', text: 'Endokrinologi', category: 'abdominalkirurgi' },
    { value: 'ulcus', text: 'Ulcus', category: 'abdominalkirurgi' },
    { value: 'urininkontinens', text: 'Urininkontinens', category: 'abdominalkirurgi' },
    { value: 'divertikel', text: 'Divertikel', category: 'abdominalkirurgi' },
    { value: 'stomi', text: 'Stomi', category: 'abdominalkirurgi' },
    { value: 'gi_blødning', text: 'GI-blødning', category: 'abdominalkirurgi' },
    { value: 'infektion', text: 'Infektion', category: 'abdominalkirurgi' },

    // Andre organer
    { value: 'lunge', text: 'Lunge', category: 'organer' },
    { value: 'nyrer', text: 'Nyrer', category: 'organer' },

    // Urologi
    { value: 'urinveje', text: 'Urinveje', category: 'urologi' },
    {
      value: 'neuromuskulær_blæredysfunktion',
      text: 'Neuromuskulær blæredysfunktion',
      category: 'urologi'
    },
    { value: 'prostata', text: 'Prostata', category: 'urologi' },
    { value: 'testis', text: 'Testis, epididymis og scrotum', category: 'urologi' },
    { value: 'penis', text: 'Penis', category: 'urologi' },
    { value: 'hæmaturi', text: 'Hæmaturi', category: 'urologi' },
    { value: 'luts', text: 'LUTS', category: 'urologi' },
    { value: 'blære', text: 'Blære', category: 'urologi' },

    // Andet
    { value: 'børn', text: 'Børn', category: 'andet' },

    // Plastikkirurgi
    { value: 'hudens_tumorer', text: 'Hudens tumorer', category: 'plastikkirurgi' },
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
    { value: 'kosmetisk_kirurgi', text: 'Kosmetisk kirurgi', category: 'plastikkirurgi' },
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

    // Onkologi
    { value: 'strålebehandling', text: 'Strålebehandling', category: 'onkologi' },
    { value: 'onkologiske_bivirkninger', text: 'Onkologiske bivirkninger', category: 'onkologi' },
    { value: 'metastaser', text: 'Metastaser', category: 'onkologi' },
    { value: 'stadieinddeling', text: 'Stadieinddeling', category: 'onkologi' },
    {
      value: 'akutte_onkologiske_tilstande',
      text: 'Akutte onkologiske tilstande',
      category: 'onkologi'
    }
  ],
  9: [
    // Paraklinik
    { value: 'a-gas', text: 'A-gas', category: 'paraklinik' },
    { value: 'ekg', text: 'EKG', category: 'paraklinik' },
    { value: 'lfu', text: 'Lungefunktionsundersøgelse', category: 'paraklinik' },
    { value: 'radiologi', text: 'Radiologi', category: 'paraklinik' },
    { value: 'farmakologi', text: 'Farmakologi', category: 'paraklinik' },

    // Anæstesi
    { value: 'ABCD', text: 'ABCD', category: 'anæstesi' },
    { value: 'sedation_og_anæstesi', text: 'Sedation og anæstesi', category: 'anæstesi' },
    {
      value: 'væske_og_elektrolytbehandling',
      text: 'Væske og elektrolytbehandling',
      category: 'anæstesi'
    },
    { value: 'postoperative_smerter', text: 'Postoperative smerter', category: 'anæstesi' },

    // Hjertemedicin
    { value: 'aks', text: 'Akut koronart syndrom', category: 'kardiologi' },
    { value: 'angina_pectoris', text: 'Angina pectoris', category: 'kardiologi' },
    { value: 'hypertension', text: 'Hypertension', category: 'kardiologi' },
    { value: 'lungeemboli', text: 'Lungeemboli', category: 'kardiologi' },
    { value: 'hjerteinsufficiens', text: 'Hjerteinsufficiens', category: 'kardiologi' },
    { value: 'klapsygdomme', text: 'Klapsygdomme', category: 'kardiologi' },
    { value: 'arytmier', text: 'Arytmier', category: 'kardiologi' },
    { value: 'aortaaneurisme', text: 'Aortaaneurisme', category: 'kardiologi' },
    { value: 'medfødte_hjertesygdomme', text: 'Medfødte hjertesygdomme', category: 'kardiologi' },
    { value: 'kardiomyopatier', text: 'Kardiomyopatier', category: 'kardiologi' },
    { value: 'pulmonal hypertension', text: 'Pulmonal hypertension', category: 'kardiologi' },
    { value: 'endokarditis', text: 'Endokarditis', category: 'kardiologi' },
    { value: 'perikarditis', text: 'Perikarditis og tamponade', category: 'kardiologi' },
    { value: 'synkope', text: 'Synkope', category: 'kardiologi' },
    { value: 'aortadissektion', text: 'Aortadissektion', category: 'kardiologi' },

    // Lungemedicin
    { value: 'lungecancer', text: 'Lungecancer', category: 'lungemedicinsk' },
    { value: 'kol', text: 'KOL', category: 'lungemedicinsk' },
    { value: 'astma', text: 'Astma', category: 'lungemedicinsk' },
    { value: 'restriktiv_lungesygdom', text: 'Restriktiv lungesygdom', category: 'lungemedicinsk' },
    { value: 'tuberkulose', text: 'Tuberkulose', category: 'lungemedicinsk' },
    { value: 'pneumoni', text: 'Pneumoni', category: 'lungemedicinsk' },
    { value: 'pneumothorax', text: 'Pneumothorax', category: 'lungemedicinsk' },
    { value: 'sarkoidose', text: 'Sarkoidose', category: 'lungemedicinsk' },
    { value: 'allergi', text: 'Allergi', category: 'lungemedicinsk' },
    { value: 'allergisk_alveolitis', text: 'Allergisk alveolitis', category: 'lungemedicinsk' },

    // Karkirurgi
    { value: 'underekstremitets-iskæmi', text: 'Underekstremitets-iskæmi', category: 'karkirurgi' },
    { value: 'specielle_karsygdomme', text: 'Specielle karsygdomme', category: 'karkirurgi' },
    { value: 'venesygdomme', text: 'Venesygdomme', category: 'karkirurgi' },

    // Thoraxkirurgi
    {
      value: 'pectus_carinatum_og_excavatum',
      text: 'Pectus carinatum og excavatum',
      category: 'thoraxkirurgi'
    },
    { value: 'Thoraxtraumer', text: 'Thoraxtraumer', category: 'thoraxkirurgi' },
    { value: 'oesophagus', text: 'Oesophagus', category: 'thoraxkirurgi' },

    // AP / Symptomkomplekser
    { value: 'dyspnø', text: 'Dyspnø', category: 'symptomkomplekser' }
  ],
  11: [
    {
      value: 'paraklinik/paraclinical',
      text: 'Paraklinik/Paraclinical',
      category: 'paraklinik/paraclinical'
    },
    {
      value: 'farmakologi/pharmacology',
      text: 'Farmakologi/Pharmacology',
      category: 'paraklinik/paraclinical'
    },
    {
      value: 'radiologi/radiology',
      text: 'Radiologi/Radiology',
      category: 'paraklinik/paraclinical'
    }
  ]
};

const postMetadata = async () => {
  console.log('Starting posting...');
  try {
    for (let key in specialer) {
      for (let speciale of specialer[key]) {
        if (!speciale.text) continue;

        await axios.post(`http://localhost:${process.env.PORT || 3001}/api/questions/metadata`, {
          type: 'specialty',
          text: speciale.text,
          value: speciale.value,
          semester: Number(key),
          category: speciale.category
        });
      }
    }

    for (let key in tags) {
      for (let tag of tags[key]) {
        if (!tag.text) continue;

        await axios.post(`http://localhost:${process.env.PORT || 3001}/api/questions/metadata`, {
          type: 'tag',
          text: tag.text,
          value: tag.value,
          semester: Number(key),
          category: tag.category
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
    const { type, text, value, semester, category } = req.body; // Disse parametre skal alle opgives i post requesten
    if (!type || !text || !semester)
      return res.status(400).send('Du mangler at opgive alle parametre');

    if (type === 'specialty') {
      let specialty = await Specialty.findOne({ semester: semester, text: text });
      if (specialty) return res.status(404).send('Speciale findes allerede');

      specialty = new Specialty();

      specialty.text = text;
      specialty.value = value;
      specialty.semester = semester;
      specialty.category = category;

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
      tag.category = category;

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
      category: t.category,
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
    if (metadata.votes < 0 || metadata.users.length < 2) {
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
    if (metadata.votes < 0 || metadata.users.length < 2) {
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
