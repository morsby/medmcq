// UI REDUCER
export const updateSelection = (prevSelection, action) => {
  let { type, value } = action.payload;
  let selection = {};
  // Vi nulstiller hvis nyt semester
  if (type === 'selectedSemester') {
    selection.selectedSetId = null;
    selection.selectedSpecialtyIds = [];
    selection.selectedTagIds = [];
  }
  selection[type] = value;

  return { ...prevSelection, ...selection };
};
