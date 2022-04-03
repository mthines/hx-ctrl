import classnames from 'classnames';
import React from 'react';

import styles from './button.module.scss';

type Props = { className?: string } & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export const Button = ({ className, ...rest }: Props) => {
  return <button className={classnames(styles.button, className)} {...rest}></button>;
};
