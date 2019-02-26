// Lav logs-collection
const mongoose = require('mongoose');
const _ = require('lodash');
const json2csv = require('json2csv').parse;

const Schema = mongoose.Schema;

var LogSchema = new Schema({
  date: { type: Date, default: Date.now },
  log_type: String, // answer || fetch_question
  fetch_type: String, // set, random, specialty, ids, all
  fetch_semester: Number,
  fetch_n: Number,
  fetch_specialty: [
    {
      type: String
    }
  ],
  fetch_set: String, // Hvilket eksamenssæt bedes der om?
  fetch_unique: Boolean, // kun nye spørgsmål?
  answer_question_id: mongoose.Schema.Types.ObjectId, // ID for question answered
  answer_answer: Number, // what was answered? 1 || 2 || 3
  answer_correct: Boolean, // svarede de rigtigt?
  logged_in: { type: Boolean, default: false }
});

let Logs = mongoose.model('Logs', LogSchema);

const logPathRegex = /api\/logs\/?([^/]*)?\/?(.*)?/;

const saveReq = async (req, res, next) => {
  /// Fører statistik over: api/questions, /api/questions/ids/, /api/questions/answer
  if (
    (req.path === '/api/questions/ids' && req.body.purpose !== 'profile-stats') ||
    req.path === '/api/questions' ||
    req.path === '/api/questions/answer'
  ) {
    let { n, specialer, unique, semester, examSeason, examYear } = req.query;
    let log = new Logs();

    if (req.user) log.logged_in = true;

    if (req.path === '/api/questions/ids' || req.path === '/api/questions') {
      log.log_type = 'fetch_question';
      log.fetch_semester = semester;
      log.fetch_n = n;
      log.fetch_specialty = specialer ? specialer.split(',') : undefined;

      log.fetch_unique = unique;

      // Hvis der ikke er hverken antal, semester eller postes (for at bede om ids)
      if (!n && !semester && req.method === 'GET') {
        log.fetch_type = 'all';
      } else if (semester && examSeason && examYear) {
        // Hent det eksamenssæt der bedes om
        log.fetch_type = 'set';
        log.fetch_set = `${examYear}/${examSeason}`;
      } else if (req.method === 'GET') {
        /* Der ønskes hverken alle spg. eller et sæt; så vi skal udregne
                    hvilke, vi vil have, ud fra diverse parametre
                */

        // Er der ikke givet ønske om antal? Så hent max 9999 spørgsmål
        if (!n) log.fetch_n = -1;

        // Hvis logget ind OG beder om "kun nye spørgsmål"
        //log.fetch_;
        log.fetch_unique = req.user && unique ? true : false;

        // Beder der om specialer?
        if (specialer) {
          log.fetch_type = 'specialty';
        } else {
          log.fetch_type = 'random';
        }
      }

      if (req.path === '/api/questions/ids' && req.method === 'POST') {
        log.fetch_type = 'ids';
      }
    } else if (req.path === '/api/questions/answer') {
      log.fetch_specialty = undefined; // for at undgå tomt array
      log.log_type = 'answer';
      log.answer_question_id = req.body.questionId;
      log.answer_correct = req.body.answer === 'correct' ? true : false;
      log.answer_answer = req.body.answerNo; // skal postes med
    }
    log.save((err) => {
      if (err) res.status(400).send(err);
    });
  }

  /**
   * ROUTING
   * Hvis path er af formen /api/logs/:type/:download?, køres nedenfor
   */
  // TODO: Hent metadata fra spørgsmål ind ved type === "answer" (fx semester, speciale, sæt)
  if (logPathRegex.test(req.path)) {
    if (!req.user || req.user.role !== 'admin') {
      res.status(401).send('Not authorized. Please log in and try again.');
      return;
    }
    let regexPath = req.path.match(logPathRegex);
    let log_type = regexPath[1],
      download = regexPath[2];

    if (log_type === undefined && download === undefined) {
      res.send('You need to specify a log type (fetch_question or answer)');
    }

    const logs = await Logs.find()
      .lean()
      .exec();

    let json = _.filter(logs, { log_type });

    let fields = {
      answer: [
        '_id',
        'log_type',
        'date',
        'answer_question_id',
        'answer_correct',
        'answer_answer',
        'logged_in'
      ],
      fetch_question: [
        '_id',
        'log_type',
        'date',
        'fetch_semester',
        'fetch_type',
        'fetch_n',
        'fetch_specialty',
        'fetch_unique',
        'logged_in'
      ]
    };

    if (log_type === 'fetch_question') {
      json.map((log) => {
        log.fetch_specialty = log.fetch_specialty ? log.fetch_specialty.join(',') : undefined;
        log.fetch_unique = log.logged_in ? log.fetch_unique : undefined;
      });
    }

    let csv = json2csv(json, { fields: fields[log_type] });
    if (download) {
      res.setHeader('Content-disposition', 'attachment; filename=' + log_type + '.csv');
      res.set('Content-Type', 'text/csv');
    }

    res.send('<pre>' + csv + '</pre>');
  } else {
    next();
  }
};

module.exports = saveReq;
