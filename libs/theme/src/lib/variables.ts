// Use Typehole to generated variable types
import { KeyOf } from 'libs/utils/common/src/types/common';
import typehole from 'typehole';

import styles from '../generated/export.module.scss';

/**
 * @returns The value of the CSS Variable
 *
 * The available CSS variables from the `resources/variables.scss` file.
 * Exported using CSS modules from `resources/export.module.scss`
 *
 * @see {@link styles}
 *
 * @example
 * ```tsx
 * const black = variablesValue['--c-black']; // #000
 * ```
 */
export const variablesValue: Variables = typehole.t1(styles as unknown as Variables);

/**
 * A method returning the value of `variablesValue`
 *
 * @see {@link variablesValue}
 */
export const getVariableValue = (key: keyof Variables) => {
	return variablesValue[key];
};

/**
 * @returns The CSS variable
 *
 * The available CSS variables from the `resources/variables.scss` file.
 * Exported using CSS modules from `resources/export.module.scss`
 *
 *  @see {@link styles}
 *
 * @example
 * ```tsx
 * const black = variablesValue['--c-black']; // var(--c-black);
 * ```
 */
export const variables = Object.entries(variablesValue).reduce((vars, [key]) => {
	return { ...vars, [key]: `var(${key})` };
}, {} as Variables);

/**
 * A method returning the value of `variables`
 *
 * @see {@link variables}
 */
export const getVariable = (key: keyof Variables) => {
	return variables[key];
};

/**
 * DO NOT UPDATE THIS TYPE.
 * This is automatically updated by Typehole
 *
 * This is all the available CSS variables from the `resources/variables.scss` file.
 */
export interface Variables {
	'--s-1': string;
	'--s-2': string;
	'--s-3': string;
	'--s-4': string;
	'--s-5': string;
	'--s-6': string;
	'--s-hor-1': string;
	'--s-hor-2': string;
	'--s-ver-1': string;
	'--s-ver-2': string;
	'--s-ver-3': string;
	'--c-turquoise-25': string;
	'--c-turquoise-50': string;
	'--c-turquoise-75': string;
	'--c-turquoise-100': string;
	'--c-black': string;
	'--c-grey-10': string;
	'--c-grey-20': string;
	'--c-grey-30': string;
	'--c-grey-40': string;
	'--c-grey-50': string;
	'--c-grey-60': string;
	'--c-grey-70': string;
	'--c-grey-80': string;
	'--c-grey-90': string;
	'--c-white': string;
	'--c-link': string;
	'--c-white-transparent': string;
	'--c-black-transparent': string;
	'--c-overlay-light': string;
	'--c-overlay-dark': string;
	'--c-overlay-darker': string;
	'--ff-paragraph': string;
	'--ff-display': string;
	'--fw-light': string;
	'--fw-regular': string;
	'--fw-bold': string;
	'--fz-10': string;
	'--fz-12': string;
	'--fz-14': string;
	'--fz-16': string;
	'--fz-20': string;
	'--fz-24': string;
	'--fz-30': string;
	'--fz-32': string;
	'--fz-38': string;
	'--lh-13': string;
	'--lh-15': string;
	'--ls-0': string;
	'--ls-01': string;
	'--brs-5': string;
	'--brs-10': string;
	'--brs-20': string;
	'--brs-40': string;
	'--bsh-small-soft': string;
	'--bsh-big-soft': string;
	'--trs-long': string;
	'--trs-smooth': string;
	'--trs-base': string;
	'--trs-quick': string;
	'--trs-instant': string;
}

/**
 * @returns Key/Name of a CSS Variable
 */
export type VariableKey<U extends keyof Variables = keyof Variables> = KeyOf<Variables, U>;
