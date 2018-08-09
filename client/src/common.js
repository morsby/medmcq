import _ from 'lodash';

// Lightbox css
import 'react-image-lightbox/style.css'; // This only needs to be imported once in your app

export const urls = {
	quiz: '/quiz',
	add: '/add',
	feedback: '/feedback'
};

export const semestre = [
	{ text: '7. semester (Inflammation)', value: 7 },
	{ text: '8. semester (Abdomen)', value: 8 },
	{ text: '9. semester (Hjerte-lunge-kar)', value: 9 },
	{ text: '11. semester (Familie-samfund / GOP)', value: 11 }
];

export const specialer = {
	7: [
		{ value: 'reumatologi', text: 'Reumatologi' },
		{ value: 'infektionsmedicin', text: 'Infektionsmedicin' },
		{ value: 'nefrologi', text: 'Nefrologi' },
		{ value: 'almen_medicin', text: 'Almen medicin' },
		{ value: 'paraklinik', text: 'Paraklinik' },
		{ value: 'gastroenterologi', text: 'Gastroenterologi' },
		{ value: 'hæmatologi', text: 'Hæmatologi' }
	],
	8: [
		{
			value: 'abdominalkirurgi',
			text: 'Abdominalkirurgi'
		},
		{
			value: 'urologi',
			text: 'Urologi'
		}
	]
};

export const breakpoints = {
	mobile: 768
};

export const imageURL = id =>
	`https://res.cloudinary.com/dw0rj924o/image/upload/f_auto,q_auto/${id}`;

export const selectQuestions = settings => {
	let selection,
		type = settings.type;
	if (type === 'random') {
		// TODO: Bedre måde at udvælge random på:
		// Evt. ny prop: index, shuffle alle spørgsmål --> udvælg fra array[index] til array[index + antal]
		// herved fås nye spørgsmål hver gang
		selection = _.sampleSize(settings.questions, settings.n);

		selection = _.map(selection, '_id');
	} else if (type === 'set') {
		selection = { ...settings };
	}

	return selection;
};

export const smoothScroll = (h, dir = 'up') => {
	let top = window.pageYOffset || document.documentElement.scrollTop;
	let bottom = document.body.scrollHeight;
	let px = 20;
	let i = h || top;
	if (dir === 'up') {
		if (i > px) {
			setTimeout(() => {
				window.scrollTo(0, i);
				smoothScroll(i - px);
			}, 10);
		} else {
			window.scrollTo(0, 0);
		}
	} else if (dir === 'down') {
		if (i < bottom - px) {
			setTimeout(() => {
				window.scrollTo(0, i);
				smoothScroll(i + px, dir);
			}, 10);
		} else {
			window.scrollTo(0, bottom);
		}
	}
};
