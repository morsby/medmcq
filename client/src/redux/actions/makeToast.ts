import { Dispatch } from 'redux';
import { getTranslate } from 'react-localize-redux';
import { toast } from 'react-toastify';

const makeToast = (reference: string, type: 'success' | 'error') => async (
  dispatch: Dispatch,
  getState: Function
) => {
  let { localize } = getState();
  const translate = getTranslate(localize);

  if (type === 'success') {
    return toast.success(translate(reference));
  } else if (type === 'error') {
    return toast.error(translate(reference));
  } else {
    throw new Error('Type must be either "success" or "error"');
  }
};

export default makeToast;
