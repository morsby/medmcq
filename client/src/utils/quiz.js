import _ from "lodash";

export const selectQuestions = (settings, answeredQuestions = null) => {
  let selection;
  let { type, questions, onlyNew, semester, specialer } = settings;

  if (type === "random" || type === "specialer") {
    if (type === "specialer") {
      questions = _.filter(questions, q => {
        return _.intersection(q.specialty, specialer).length > 0;
      });
    }
    // TODO: Giv besvarede spørgsmål en værdi, så spørgsmål der er svaret på færre gange hyppigere vælges

    if (onlyNew && answeredQuestions) {
      // Udtræk de spørgsmål, der ikke allerede er besvaret
      questions = _.filter(
        questions,
        q => !Object.keys(answeredQuestions[semester]).includes(q._id)
      );
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
