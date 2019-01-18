// Lav logs-collection
const mongoose = require("mongoose");

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
    answer_question_id: String, // ID for question answered
    answer_answer: Number, // what was answered? 1 || 2 || 3
    answer_correct: Boolean // svarede de rigtigt?
});

let Logs = mongoose.model("Logs", LogSchema);

const saveReq = function(req, res, next) {
    /// Fører statistik over: api/questions, /api/questions/ids/, /api/questions/answer
    if (
        req.path === "/api/questions/ids" ||
        req.path === "/api/questions" ||
        req.path === "/api/questions/answer"
    ) {
        let {
            n,
            specialer,
            unique,
            semester,
            examSeason,
            examYear
        } = req.query;
        let log = new Logs();

        if (
            req.path === "/api/questions/ids" ||
            req.path === "/api/questions"
        ) {
            log.log_type = "fetch_question";
            log.fetch_semester = semester;
            log.fetch_n = n;
            log.fetch_specialty = specialer ? specialer.split(",") : undefined;

            log.fetch_unique = unique;

            if (!n && !semester) {
                log.fetch_type = "all";
            } else if (semester && examSeason && examYear) {
                // Hent det eksamenssæt der bedes om
                log.fetch_type = "set";
                log.fetch_set = `${examYear}/${examSeason}`;
            } else {
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
                    log.fetch_type = "specialty";
                } else {
                    log.fetch_type = "random";
                }
            }

            if (
                req.path === "/api/questions/ids" &&
                req.body.purpose !== "profile-stats"
            ) {
                log.fetch_type = "ids";
            }
        } else if (req.path === "/api/questions/answer") {
            log.fetch_specialty = undefined; // for at undgå tomt array
            log.log_type = "answer";
            log.answer_question_id = req.body.questionId;
            log.answer_correct = req.body.answer === "correct" ? true : false;
            log.answer_answer = req.body.answerNo; // skal postes med
        }
        log.save(err => {
            if (err) res.send(err);
        });
    }
    next();
};

module.exports = saveReq;
