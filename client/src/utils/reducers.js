import { insertOrRemoveFromArray } from './common';

// UI REDUCER
export const updateSelection = (prevSelection, action) => {
  let { type, value } = action.payload;
  let selection = {};
  // Vi nulstiller if hvis nyt semester
  if (type === 'selectedSemester') {
    selection.selectedSetId = null;
    selection.selectedSpecialtyIds = [];
    selection.selectedTagIds = [];
  }
  // Hvis vi ændrer specialer/tags, opdaterer vi array'et
  if (['selectedSpecialtyIds', 'selectedTagIds'].indexOf(type) > -1) {
    let currIds = Array.isArray(prevSelection[type]) ? prevSelection[type] : [];
    value = insertOrRemoveFromArray(currIds, value);
  }
  selection[type] = value;

  return { ...prevSelection, ...selection };
};
