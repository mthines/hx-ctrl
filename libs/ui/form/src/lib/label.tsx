import { FormField } from '@ht-ctrl/ui-form';
import classNames from 'classnames';
import React, { ReactNode } from 'react';

import styles from './label.module.scss';

type Props = { children: ReactNode; className?: string } & FormField;

export const Label = ({ id, label, children, className }: Props) => {
  return (
    <label className={classNames(styles.label, className)} htmlFor={id} data-label-wrapper>
      {label && (
        <span data-label className={styles.span}>
          {label}
        </span>
      )}
      {children}
    </label>
  );
};
