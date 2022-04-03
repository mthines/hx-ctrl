import { FormField, Label } from '@ht-ctrl/ui-form';
import classnames from 'classnames';
import React, { ForwardedRef } from 'react';
import { RefObject } from 'react';
import { forwardRef } from 'react';

import styles from './input-text.module.scss';

type Props = {
  className?: string;
  classNames?: Partial<Record<'label' | 'input', string>>;
} & FormField &
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export const InputText = forwardRef(
  ({ id, label, placeholder, className, classNames, ...rest }: Props, ref: ForwardedRef<HTMLInputElement>) => {
    return (
      <Label id={id} label={label} className={classnames(styles.label, className, classNames?.label)}>
        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          className={classnames(styles.input, classNames?.input)}
          {...rest}
        />
      </Label>
    );
  },
);

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // extends React's HTMLAttributes
    directory?: string;
    webkitdirectory?: string;
  }
}
