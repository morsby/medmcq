import axios from "axios";
import * as types from "./types";

export const changeSettings = settings => async dispatch => {
    if (settings.type === "semester") {
        const res = await axios.get("/api/count/" + settings.value);
        let data = res.data;
        settings = { ...settings, questions: data };
    }

    dispatch({
        type: types.CHANGE_SETTINGS,
        newSettings: settings
    });
};
