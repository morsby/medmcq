import { createAction } from 'redux-starter-kit';

/* QUIZ REDUCER */
export const QUIZ_NAVIGATE = 'QUIZ_MAVIGATE';

// UI reducer
export const UI_LOADING = 'ui_loading';
export const UI_DONE_LOADING = 'ui_done_loading';

// Metadata reducer
export const INVALIDATE_METADATA = 'invalidate_metadata';
export const FETCH_METADATA_REQUEST = 'fetch_metadata_request';
export const FETCH_METADATA_SUCCESS = 'fetch_metadata_success';
export const FETCH_METADATA_FAILURE = 'fetch_metadata_failure';

// Question reducer
export const FETCH_QUESTIONS_REQUEST = 'fetch_questions_request';
export const FETCH_QUESTIONS_SUCCESS = 'fetch_questions_success';
export const FETCH_QUESTIONS_FAILURE = 'fetch_questions_failure';
export const ANSWER_QUESTION = 'answer_question';
export const POST_QUESTION = 'post_question';
export const QUESTION_UPDATE = 'question_update';

// Gamle types

// TODO: Make async
export const QUESTION_COMMENT = 'question_comment';
export const QUESTION_COMMENT_DELETE = 'question_comment_delete';
export const QUESTION_COMMENT_EDIT = 'question_comment_edit';
export const QUESTION_COMMENT_UPDATE = 'question_comment_update';
export const QUESTION_SPECIALTY_UPDATE = 'question_specialty_update';
export const QUESTION_REPORT = 'question_report';

/* SETTINGS REDUCER */
export const CHANGE_SETTINGS = 'change_settings';
export const SET_FIRST_TIME = createAction('SET_FIRST_TIME');

/* SELECTION REDUCER */
export const CHANGE_SELECTION = 'change_selection';
export const INVALIDATE_SEMESTERS = 'invalidate_semesters';
export const FETCH_SEMESTERS_REQUEST = 'fetch_semesters_request';
export const FETCH_SEMESTERS_SUCCESS = 'fetch_semesters_success';
export const FETCH_SEMESTERS_FAILURE = 'fetch_semesters_failure';

/* AUTH REDUCER */
export const AUTH_SIGNUP = 'auth_signup';
export const AUTH_FETCH_USER_SUCCESS = 'auth_fetch_user_success';
export const AUTH_FETCH_USER_REQUEST = 'auth_fetch_user_request';
export const AUTH_GET_ANSWERED_QUESTIONS = 'auth_get_answered_questions';
export const AUTH_PROFILE_REQUEST = 'auth_profile_request';
export const AUTH_PROFILE_SUCCESS = 'auth_profile_success';
export const AUTH_UPDATE_USER_ANSWERS = 'AUTH_UPDATE_USER_ANSWERS';

export const LOAD_SETS = 'LOAD_SETS';
export const LOAD_SETS_FINISH = 'LOAD_SETS_FINISH';
export const CREATE_BOOKMARK = createAction('CREATE_BOOKMARK');
export const REMOVE_BOOKMARK = createAction('REMOVE_BOOKMARK');
export const CHANGE_PICKED = createAction('CHANGE_PICKED');
