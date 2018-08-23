import _ from "lodash";

// Lightbox css
import "react-image-lightbox/style.css"; // This only needs to be imported once in your app

export const urls = {
  root: "/",
  quiz: "/quiz",
  add: "/add",
  feedback: "/feedback",
  signup: "/opret",
  login: "/login",
  logout: "/logout",
  profile: "/profil",
  editProfile: "/profil/rediger",
  forgotPassword: "/glemt-kodeord", //HVIS DENNE ÆNDRES SKAL OGSÅ ÆNDRES I API'ens config/urls.js
  resetPassword: "/nyt-kodeord"
};

export const semestre = [
  { text: "7. semester (Inflammation)", value: 7 },
  { text: "8. semester (Abdomen)", value: 8 },
  { text: "9. semester (Hjerte-lunge-kar)", value: 9 },
  { text: "11. semester (Familie-samfund / GOP)", value: 11 }
];

export const specialer = {
  7: [
    { value: "gastroenterologi", text: "Gastroenterologi" },
    { value: "hæmatologi", text: "Hæmatologi" },
    { value: "infektionsmedicin", text: "Infektionsmedicin" },
    { value: "nefrologi", text: "Nefrologi" },
    { value: "reumatologi", text: "Reumatologi" },
    { value: "almen_medicin", text: "Almen medicin" },
    { value: "paraklinik", text: "Paraklinik" }
  ],
  8: [
    {
      value: "abdominalkirurgi",
      text: "Abdominalkirurgi"
    },
    { value: "plastikkirurgi", text: "Plastikkirurgi" },
    {
      value: "urologi",
      text: "Urologi"
    },
    { value: "onkologi", text: "Onkologi" },
    { value: "socialmedicin", text: "Socialmedicin" },
    { value: "almen_medicin", text: "Almen medicin" },
    { value: "paraklinik", text: "Paraklinik" }
  ],
  9: [
    { value: "anæstesiologi", text: "Anæstesiologi" },
    {
      value: "kardiologi",
      text: "Kardiologi"
    },
    { value: "lungemedicin", text: "Lungemedicin" },
    { value: "karkirurgi", text: "Karkirurgi" },
    { value: "thoraxkirurgi", text: "Thoraxkirurgi" },
    { value: "almen_medicin", text: "Almen medicin" },
    { value: "paraklinik", text: "Paraklinik" }
  ],
  11: [
    { value: "gyn", text: "Gynækologi/Gynaecology" },
    { value: "obs", text: "Obstetrik/Obstetrics" },
    { value: "pæd/ped", text: "Pædiatri/Pediatrics" },
    {
      value: "retsmedicin/forensic_medicine",
      text: "Retsmedicin/Forensic medicine"
    },
    {
      value: "klinisk_genetik/clinical_genetics",
      text: "Klinisk genetik/Clinical genetics"
    },
    { value: "almen_medicin/gp", text: "Almen medicin/General practice" },
    { value: "paraklinik/paraclinical", text: "Paraklinik/Paraclinical" }
  ]
};

export const breakpoints = {
  mobile: 768
};

export const imageURL = id => "http://div.morsby.dk/tmp.png";
//`https://res.cloudinary.com/dw0rj924o/image/upload/f_auto,q_auto/${id}`;

export const selectQuestions = (settings, answeredQuestions = null) => {
  let selection;
  let { type, questions, onlyNew, semester } = settings;

  if (type === "random" || type === "specialer") {
    if (type === "specialer") {
      questions = _.filter(questions, q => {
        return _.intersection(q.specialty, settings.specialer).length > 0;
      });
    }
    // TODO: Giv besvarede spørgsmål en værdi, så spørgsmål der er svaret på færre gange hyppigere vælges

    if (onlyNew && answeredQuestions) {
      questions = _.filter(
        questions,
        q => !Object.keys(answeredQuestions[settings.semester]).includes(q._id)
      );
      console.log(questions);
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
