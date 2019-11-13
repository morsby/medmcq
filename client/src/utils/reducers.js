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

  // Skift checkboxene afhængigt af type, da disse ikke overlapper
  if (type === 'onlyNew') {
    selection.onlyWrong = false;
  }
  if (type === 'onlyWrong') {
    selection.onlyNew = false;
  }

  return { ...prevSelection, ...selection };
};
