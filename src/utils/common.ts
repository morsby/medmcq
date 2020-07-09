export const appVersion = '2.4.0';

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

export const imageURL = (image: string) => {
  if (image.match(/http|https/)) {
    return image;
  } else {
    return `/images/${image}`;
  }
};
export const truncateText = (text: string, length = 30) => {
  if (!text) return;
  if (text.length + 3 > length) {
    return text.substring(0, length) + ' ...';
  } else return text;
};

export const insertOrReplace = <T extends { id?: any }>(
  array: T[],
  items: T | T[],
  comparison: keyof T = 'id'
) => {
  const replace = (item: T) => {
    const index = array.findIndex((arrayItem) => arrayItem[comparison] === item[comparison]);
    if (index !== -1) return (array[index] = item);
    return array.push(item);
  };

  if (Array.isArray(items)) {
    for (let item of items) {
      replace(item);
    }
  } else {
    replace(items);
  }
};

export const removeFromState = <T extends { id?: number }>(
  array: T[],
  id: number,
  comparison: keyof T = 'id'
) => {
  const index = array.findIndex((m) => (m[comparison] as any) === id);
  array.splice(index, 1);
};
