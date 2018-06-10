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

export const imageURL = id =>
	`https://res.cloudinary.com/dw0rj924o/image/upload/f_auto,q_auto/${id}`;
