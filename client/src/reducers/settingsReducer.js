import * as types from '../actions/types';
import _ from 'lodash';
export default function(
	state = {
		type: 'random',
		n: 10,
		semester: null,
		set: null,
		questions: [],
		sets: [],
		isFetching: false
	},
	action
) {
	switch (action.type) {
		case types.CHANGE_SETTINGS:
			let newSettings = action.payload.settings;
			let newState = { ...state, ...newSettings };
			let questions = action.payload.questions;

			if (questions) {
				let sets = [];
				questions.forEach(q => {
					let season, text, api;
					q.examSeason === 'F'
						? (season = 'Forår')
						: (season = 'Efterår');
					text = `${season} ${q.examYear}`;
					api = `${q.examYear}/${q.examSeason}`;
					sets.push({
						examSeason: q.examSeason,
						examYear: q.examYear,
						text,
						api
					});
				});
				sets = _.orderBy(
					sets,
					['examYear', 'examSeason'],
					['asc', 'desc']
				);
				sets = _.uniqWith(sets, _.isEqual);
				newState.questions = questions;
				newState.sets = sets;
			}
			return newState;
		case types.IS_FETCHING:
			return { ...state, isFetching: true };
		case types.FETCH_QUESTIONS:
			return { ...state, isFetching: false };
		default:
			return state;
	}
}
