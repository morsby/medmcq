import axios from 'axios';
const apiEndpoint = '/api/questions/';

// Vote on specialty
export const specialtyVote = async (value, username, id) => {
  const api = apiEndpoint + id + '/vote';

  const result = await axios.put(api, { specialty: value, user: username });

  return result;
};

export const tagVote = async (tags, username, id) => {
  const api = apiEndpoint + id + '/tags';

  const result = await axios.put(api, { tags: tags, user: username });

  return result;
};
