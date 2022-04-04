import { CSSProperties } from 'react';

type Font = {
	/**
	 * Whether a `<style>` tag should be created as well as the `<link>` tag.
	 */
	noStyle?: boolean;
} & FontFace;

/**
 * This includes the Fonts in the Document which will make it included both Client and Server side.
 *
 * @example
 * ```tsx
import { Head, Html, Main, NextScript } from 'next/document';

import { FontProvider } from '@project_name/theme';

export default function Document() {
	return (
		<Html>
			<Head>
				<FontProvider
					fonts={[
						{ path: '/fonts/EurostyleLTStd.otf', family: 'Eurostyle LT Std', format: 'otf' },
						{ path: '/fonts/EurostyleLTStd-Bold.otf', family: 'Eurostyle LT Std', format: 'otf' },
						{ path: '/fonts/EurostyleLTStd-Demi.otf', family: 'Eurostyle LT Std', format: 'otf' },
					]}
				/>
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
}
 * ```
 */
export const FontProvider = ({ fonts }: { fonts: Font[] }) => (
	<>
		{fonts.map((font) => (
			<>
				<link key={font.src} href={font.src} rel="stylesheet" type="text/css" />
				{font.noStyle ?? (font.src.includes('http') && <FontFaceStyle {...font} />)}
			</>
		))}
	</>
);

type Url = string;
type Directory = string;

type Formats = 'woff2' | 'otf' | 'ttf' | 'woff' | 'eot';

type FontFace = {
	/**
	 * Either a URL or a path to a local file in the apps public folder.
	 */
	src: Url | Directory;
	display?: 'swap';
	family?: CSSProperties['fontFamily'];
	style?: CSSProperties['fontStyle'];
	weight?: CSSProperties['fontWeight'];
	/**
	 * The format for the font.
	 * For performance reasons, please use `woff2` fonts if possible.
	 */
	format?: Formats;
};

const FontFaceStyle = ({ src, display = 'swap', family, style = 'normal', weight = 'normal', format }: FontFace) => {
	return (
		<style>
			{`@font-face {
font-family: ${family};
font-display: ${display};
font-style: ${style};
font-weight: ${weight};
src: ${`url(${src}) format(${format || 'woff2'})`};
}`.replace(/\s/g, '')}
		</style>
	);
};
