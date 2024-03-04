import { PersonalizationSettingsType } from './personalizationConfig.types';
import { Nullable } from './util.types';


export const pageStatus = {
	ELEMENTSPAGE: 0,
	EDITPAGE: 1,
	FINALPAGE: 2
};

export const figureItemList = {
	MULTIPLECHOICE: 0,
	RANGESELECTOR: 1,
	OPENFIELD: 2,
	CUSTOMERDETAILS: 3,
	CUSTOMBUTTON: 4,
	CALCULATOR: 5,
	DATEFIELD: 6,
	PERSONALIZATION: 7
} as const;

export enum FiguresEnum {
	multipleChoice = 'multiple-choice',
	rangeSelector = 'range-selector',
	openField = 'open-field',
	customerDetails = 'customer-details',
	addButton = 'add-button',
	calculator = 'calculator',
	dateField = 'date-field',
	personalization = 'personalization'
}

export type BackgroundConfigType = {
	backgroundColor: string;
};

export const buttonLinks = {
	slideLink: 'slide_link',
	hyperlink: 'hyperlink'
} as const;

export type LinkType = (typeof buttonLinks)[keyof typeof buttonLinks];

export type BtnConfigType = {
	backColor: string;
	hoverColor: string;
	borderColor: string;
	hoverBorderColor: string;
	textColor: string;
	hoverTextColor: string;
	borderRadius: number;
	linkType: Nullable<LinkType>;
	links: Nullable<string[]>;
	link: Nullable<string>;
};

export type TextConfigType = Pick<BtnConfigType, 'textColor'> & {
	fontIndex: string;
	fontSize: number;
};

export type InputConfigType = Pick<
	BtnConfigType,
	'backColor' | 'borderColor' | 'borderRadius' | 'textColor'
> &
	Pick<TextConfigType, 'fontSize'>;


//TODO: add config for other figures instead empty obj
export type ConfigArray = {
	itemConfig: [
		{},
		{},
		{},
		{},
		{},
		{},
		{},
		PersonalizationSettingsType
	];
	currentPage: (typeof pageStatus)[keyof typeof pageStatus];
	selectedItem: (typeof figureItemList)[keyof typeof figureItemList];
};