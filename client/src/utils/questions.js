import _ from 'lodash';
export const groupQuestionsBySet = (questions) =>
  _.groupBy(questions, (q) => `${q.examYear}/${q.examSeason}`);

export const getIds = (objs) => {
  if (Array.isArray(objs)) {
    if (objs[0]._id) {
      return _.map(objs, '_id');
    } else
      throw new Error({
        type: 'ERROR',
        origin: 'getIds',
        message: 'Kan ikke udregne id fra det givne'
      });
  } else if (typeof objs === 'object') {
    return Object.keys(objs);
  }
};
