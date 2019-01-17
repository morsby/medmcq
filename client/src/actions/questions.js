import axios from "axios";
import * as types from "./types";

export const getQuestions = (settings, selection) => async dispatch => {
    let { type, semester, specialer, n, onlyNew, set } = settings;
    dispatch({ type: types.IS_FETCHING });
    let res = { data: [] };

    // Hvis der ikke bedes om helt specifikke spørgsmål
    if (type !== "ids") {
        // Bedes der om et eksamenssæt?
        if (type === "set") {
            set = set.split("/");

            res = await axios.get(
                `/api/questions?semester=${semester}&examYear=${
                    set[0]
                }&examSeason=${set[1]}`
            );
        } else if (
            // Bedes der om tilfældige spørgsmål (evt. inden for et/flere speciale(r)?)
            (type === "random" || type === "specialer") &&
            selection.length > 0
        ) {
            // Lav tomme strings til API-request
            let querySpecialer = "",
                unique = "";

            // Spcialeønsker? Lav det til en streng!
            if (type === "specialer") {
                querySpecialer = "&specialer=" + specialer.join(",");
            }

            // Nye spørgsmål? lav det til en streng!
            if (onlyNew) unique = "&unique=t";

            res = await axios.get(
                `/api/questions?semester=${semester}&n=${n}${querySpecialer}${unique}`
            );
        }
    } else {
        res = await axios.post("/api/questions/ids", {
            ids: selection
        });
    }
    dispatch({
        type: types.FETCH_QUESTIONS,
        payload: res.data,
        questionType: type
    });
};

export const answerQuestion = (
    id,
    answer,
    correct,
    semester,
    user = null
) => dispatch => {
    let post = {
        questionId: id,
        answer: correct.correct ? "correct" : "wrong",
        semester
    };
    if (user) axios.post("/api/questions/answer", post);

    dispatch({ type: types.ANSWER_QUESTION, payload: { id, answer, correct } });
};

export const postQuestion = post => async dispatch => {
    const formData = new FormData();

    formData.append("question", post.question);
    formData.append("answer1", post.answer1);
    formData.append("answer2", post.answer2);
    formData.append("answer3", post.answer3);
    formData.append("correctAnswer", post.correctAnswer);
    formData.append("semester", post.semester);
    formData.append("examYear", post.examYear);
    formData.append("examSeason", post.examSeason);
    formData.append("specialty", post.specialty);
    if (post.image) {
        formData.append("image", post.image, post.image.name);
    }

    const res = await axios.post("/api/questions", formData);
    dispatch({ type: types.POST_QUESTION, payload: res.data });
};

export const commentQuestion = (id, comment) => async dispatch => {
    const res = await axios.put(`/api/questions/${id}/comment`, {
        comment
    });
    dispatch({ type: types.QUESTION_COMMENT, payload: res.data });
};
