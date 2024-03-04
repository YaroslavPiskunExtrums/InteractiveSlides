import { BackgroundConfigType, FiguresEnum, InputConfigType, TextConfigType } from './figures.types';

export const personalizationFigureType = {
	image: 'image',
	text: 'text'
} as const;

export const layouts = {
	right: 'right',
	center: 'center',
	left: 'left'
} as const;

export type PersonalizationTypes =
	(typeof personalizationFigureType)[keyof typeof personalizationFigureType];

export type PersonalizationSettingsType = {
	figureType?: FiguresEnum.personalization;
	text: string;
	imageUrl: string;
	fileName: string;
	type: PersonalizationTypes;
	backgroundConfig: BackgroundConfigType;
	textConfig: TextConfigType & { layout: (typeof layouts)[keyof typeof layouts] };
	imageConfig: Pick<InputConfigType, 'borderRadius'>;
};