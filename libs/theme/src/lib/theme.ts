import { Variables } from '@project_name/theme';

type Status = 'success' | 'warning' | 'error' | 'loading' | 'idle';

type Variant = 'outline' | 'fill' | 'plain';

type Size = 'none' | 'tiny' | 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'huge';

type ThemeMode = 'light' | 'dark';

type Position = {
	horizontal: 'left' | 'right';
	vertical: 'top' | 'bottom';
	direction: 'horizontal' | 'vertical';
	all: Position['horizontal'] | Position['vertical'];
};

/** Theme Typings for consistent */
export type Theme = {
	status: Status;
	variant: Variant;
	size: Size;
	theme: ThemeMode;
	position: Position;
	variables: Variables;
};
