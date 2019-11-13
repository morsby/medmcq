import * as types from 'actions/types';

import { createReducer } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import _ from 'lodash';

const user = new schema.Entity('users');
const publicComment = new schema.Entity('publicComments', { user: user });
const privateComment = new schema.Entity('privateComments', { user: user });
const examSet = new schema.Entity('examSets');
const question = new schema.Entity(
  'questions',
  {
    examSet,
    publicComments: [publicComment],
    privateComments: [privateComment]
  },
  {
    processStrategy: (ent) => ({
      ...ent,
      specialties: _.keyBy(ent.specialties, 'specialtyId'),
      tags: _.keyBy(ent.tags, 'tagId'),
      userSpecialtyVotes: _.keyBy(ent.userSpecialtyVotes, 'specialtyId'),
      userTagVotes: _.keyBy(ent.userTagVotes, 'tagId')
    })
  }
);

const initialState = { entities: {}, result: [], isFetching: false };

export default createReducer(initialState, {
  [types.FETCH_QUESTIONS_REQUEST]: (state) => {
    state.isFetching = true;
  },

  [types.FETCH_QUESTIONS_SUCCESS]: (state, action) => {
    const normalized = normalize(action.payload, [question]);
    return { ...state, ...normalized, isFetching: false };
  },

  [types.FETCH_QUESTIONS_FAILURE]: () => {
    return initialState;
  },

  [types.QUESTION_UPDATE]: (state, action) => {
    const normalized = normalize(action.payload, question);
    state.entities = _.merge({}, state.entities, normalized.entities);
    state.entities.questions[action.payload.id] = normalized.entities.questions[action.payload.id];
  },

  [types.CREATE_BOOKMARK]: (state, action) => {
    state.entities.questions[action.payload].isBookmarked = action.payload;
  },

  [types.REMOVE_BOOKMARK]: (state, action) => {
    state.entities.questions[action.payload].isBookmarked = false;
  },
  [types.COMMENT_LIKE]: (state, action) => {
    state.entities.publicComments[action.payload.commentId].likes.push(action.payload);
  },
  [types.COMMENT_UNLIKE]: (state, action) => {
    const index = _.findIndex(state.entities.publicComments[action.payload.commentId].likes, {
      commentId: action.payload.commentId
    });
    state.entities.publicComments[action.payload.commentId].likes.splice(index, 1);
  }
});
