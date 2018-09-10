import _ from "lodash";

export const selectQuestions = (settings, user = null) => {
    let selection;
    let { type, questions, onlyNew, semester, specialer } = settings;

    if (type === "random" || type === "specialer") {
        if (type === "specialer") {
            questions = _.filter(questions, q => {
                return _.intersection(q.specialty, specialer).length > 0;
            });
        }
        // TODO: Giv besvarede spørgsmål en værdi, så spørgsmål der er svaret på færre gange hyppigere vælges

        if (onlyNew && user) {
            // Udtræk de spørgsmål, der ikke allerede er besvaret
            let questionsNew = _.filter(
                questions,
                q =>
                    !Object.keys(user.answeredQuestions[semester]).includes(
                        q._id
                    )
            );
            // Hvis ikke galle spørgsmål er besvaret, medtages alle
            if (questionsNew.length > 0) questions = questionsNew;
        }

        selection = _.sampleSize(questions, settings.n);

        selection = _.map(selection, "_id");
    } else {
        selection = { ...settings };
    }

    return selection;
};

export const smoothScroll = (h, dir = "up") => {
    let top = window.pageYOffset || document.documentElement.scrollTop;
    let bottom = document.body.scrollHeight;
    let px = 20;
    let i = h || top;
    if (dir === "up") {
        if (i > px) {
            setTimeout(() => {
                window.scrollTo(0, i);
                smoothScroll(i - px);
            }, 10);
        } else {
            window.scrollTo(0, 0);
        }
    } else if (dir === "down") {
        if (i < bottom - px) {
            setTimeout(() => {
                window.scrollTo(0, i);
                smoothScroll(i + px, dir);
            }, 10);
        } else {
            window.scrollTo(0, bottom);
        }
    }
};

export const evalAnswer = (question, answer) => {
    if (!question.answer) return; // hvis ikke svaret
    if (answer === question.correctAnswer) return "green"; // hvis korrekt svar
    if (answer === question.answer) return "red"; // hvis forkert svar
    return "grey"; // ikke valgt mulighed
};

export const calculateResults = (answers, numberOfQuestions) => {
    if (answers.length < numberOfQuestions) {
        return { done: false };
    }

    let correct = 0;
    for (var i = 0, l = answers.length; i < l; i++) {
        if (
            typeof answers[i] === "undefined" ||
            typeof answers[i] !== "boolean"
        ) {
            return { done: false };
        } else if (answers[i] === true) {
            correct++;
        }
    }

    return {
        done: true,
        n: answers.length,
        correct,
        percentage: `${Math.round((correct / answers.length) * 10000) / 100}%`
    };
};
