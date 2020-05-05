export const urls = {
  root: '/',
  quiz: '/quiz',
  add: '/add',
  about: '/om-siden',
  contact: '/kontakt',
  signup: '/opret',
  login: '/login',
  logout: '/logout',
  profile: '/profil',
  editProfile: '/profil/rediger',
  forgotPassword: '/glemt-kodeord', // HVIS DENNE ÆNDRES SKAL OGSÅ ÆNDRES I API'ens config/urls.js
  resetPassword: '/nyt-kodeord',
  print: '/print',
  quizShareRoute: '/quiz/:ids'
};

export const breakpoints = {
  mobile: 768
};

export const imageURL = (image) => {
  if (image.match(/http|https/)) {
    return image;
  } else {
    return `/images/${image}`;
  }
};
export const truncateText = (text, length = 30) => {
  if (!text) return;
  if (text.length + 3 > length) {
    return text.substring(0, length) + ' ...';
  } else return text;
};

export const allowedNs = {
  min: 1,
  max: 100
};

export const insertOrReplace = <T extends any>(array: T[], item: T, comparison: string = 'id') => {
  const index = array.findIndex((arrayItem) => arrayItem[comparison] === item[comparison]);
  if (index !== -1) return (array[index] = item);
  return array.push(item);
};
