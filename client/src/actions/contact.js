import axios from 'axios';

export const contactUs = ({ subject, message }) => async () => {
  axios.post('/api/contact', { subject, message });
};
