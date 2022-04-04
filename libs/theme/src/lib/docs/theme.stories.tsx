import isEmpty from 'lodash/isEmpty';
import React, { ReactNode } from 'react';
import { Meta, Story } from '@storybook/react';

import { PaddedDecorator } from '@project_name/library';
import { variables } from '@project_name/theme';

import styles from './theme.module.scss';
import { Variables, variablesValue } from 'libs/theme/src/lib/variables';
import { entries } from '@project_name/utils-common';

export default {
	title: 'Overview',
	decorators: [PaddedDecorator],
};

type Props = { defaultText: string };

export const ThemePage = ({ defaultText }: Props) => {
	const colors = entries(variables)?.filter(([v]) => v?.includes('--c-'));
	const fontSize = entries(variables)?.filter(([v]) => v?.includes('--fz-'));
	const fontWeight = entries(variables)?.filter(([v]) => v?.includes('--fw-'));

	return (
		<main className={styles.main}>
			<VariableGroup
				title="Colors"
				variables={colors}
				varName={'--c-'}
				render={({ value }) => <div style={{ background: value, width: '100%', height: '100%' }} />}
				asGrid
			/>
			<VariableGroup
				title="Font Size"
				variables={fontSize}
				varName={'--fz-'}
				render={({ value }) => (
					<div data-padding style={{ fontSize: value }}>
						{defaultText}
					</div>
				)}
			/>
			<VariableGroup
				title="Font Weight"
				variables={fontWeight}
				varName={'--fw-'}
				render={({ value }) => (
					<div data-padding style={{ fontWeight: value, fontSize: variables['--fz-20'] }}>
						{defaultText}
					</div>
				)}
			/>
		</main>
	);
};

ThemePage.args = {
	defaultText: 'This is a text',
};

const VariableGroup = ({
	variables,
	title,
	render,
	varName = '--',
	asGrid = false,
}: {
	title: string;
	varName?: string;
	variables: [keyof Variables, string][];
	render: (config: { id: keyof Variables; value: string }) => ReactNode;
	asGrid?: boolean;
}) => {
	return (
		<div className={styles.group}>
			<h3 className={styles.title}>{title}</h3>

			{!isEmpty(variables) && (
				<section className={styles.variables} data-grid={asGrid}>
					{variables?.map((variable) => {
						const [key, value] = variable;
						const name = key.replace(varName, '');

						return (
							<article key={key} className={styles.container}>
								<header className={styles.header}>
									<h6 className={styles.name}>{name}</h6>
									<p className={styles.value}>{variablesValue[key]}</p>
								</header>
								{render({ id: key, value })}
							</article>
						);
					})}
				</section>
			)}
		</div>
	);
};
