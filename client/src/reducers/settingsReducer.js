import * as types from '../actions/types';
import _ from 'lodash';
export default function(
    state = {
        type: 'random',
        n: 10,
        onlyNew: false,
        semester: 7,
        set: null,
        specialer: [],
        questions: [],
        sets: [],
        isFetching: false,
        lastFetch: null,
    },
    action
) {
    switch (action.type) {
        case types.CHANGE_SETTINGS:
            let { value, questions } = action.newSettings;

            switch (action.newSettings.type) {
                case 'type':
                    return { ...state, type: value };

                case 'specialer':
                    let specialer = state.specialer,
                        alreadySelected = state.specialer.indexOf(value);

                    if (alreadySelected > -1) {
                        specialer.splice(alreadySelected, 1);
                    } else {
                        specialer.push(value);
                    }
                    return { ...state, specialer };

                case 'onlyNew':
                    return { ...state, onlyNew: !state.onlyNew };

                case 'semester':
                    let sets = [];
                    questions.forEach(q => {
                        let season,
                            text,
                            api,
                            reex = '';
                        q.examSeason.charAt(0) === 'F'
                            ? (season = 'Forår')
                            : (season = 'Efterår');

                        if (q.examSeason.toLowerCase().includes('ree')) {
                            reex = ' (reeks)';
                        }

                        text = `${season} ${q.examYear}${reex}`;
                        api = `${q.examYear}/${q.examSeason}`;
                        sets.push({
                            examSeason: q.examSeason.charAt(0),
                            examYear: q.examYear,
                            reex,
                            text,
                            api,
                        });
                    });
                    sets = _.orderBy(
                        sets,
                        ['examYear', 'examSeason', 'reex'],
                        ['asc', 'desc', 'asc']
                    );
                    sets = _.uniqWith(sets, _.isEqual);

                    return {
                        ...state,
                        sets,
                        questions,
                        semester: value,
                        specialer: [],
                    };
                case 'set':
                    return { ...state, set: value };

                case 'n':
                    return { ...state, n: value };

                default:
                    return state;
            }

        case types.IS_FETCHING:
            return Date.now() - state.lastFetch > 1000
                ? { ...state, isFetching: true }
                : state;

        case types.FETCH_QUESTIONS:
            return { ...state, isFetching: false, lastFetch: Date.now() };
        default:
            return state;
    }
}
