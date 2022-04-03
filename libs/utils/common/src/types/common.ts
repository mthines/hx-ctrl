/**
 * Is One of the properties inside of T
 *
 * @author @mthines
 *
 * @version 1.0.0
 */
export type OneOf<T> = T extends unknown[] ? T[number] : T extends object ? T[keyof T] : never;

/**
 * The Callback function for a specific Event Listener
 *
 * @author @mthines
 *
 * @version 1.0.0
 */
export type EventListenerCallback<K extends keyof WindowEventMap> = (ev: WindowEventMap[K]) => void;

/**
 * A Record where all the keys are set to K = `undefined`
 *
 * @author @mthines
 *
 * @version 1.0.0
 */
export type NilRecord<T extends object, K = undefined> = Partial<Record<keyof T, K>>;

/**
 * The key of an object
 *
 * @author @mthines
 *
 * @version 1.0.0
 */
export type KeyOf<T, U extends keyof T = keyof T> = keyof Pick<T, U>;

/**
 * An Array including an ID usable as a key for iterators
 *
 * @author @mthines
 *
 * @version 1.0.0
 */
export type KeyedArray<T extends object> = ({ id: string | number } & T)[];

/**
 * Conditional Type
 *
 * This is used to dynamically add types based on the `Condition` Generic Parameter.
 *
 * Useful when your component can be rendered in different ways based on the `Condition`,
 * and you want to guide the developer to the correct type.
 *
 * @author @mthines
 *
 * @version 1.0.0
 *
 * #### Theorical Example
 *
 * @example
 * ```tsx
  type AType = {
    a: string;
    b: string;
  };

  type BType = {
    b: string;
    c: number;
  };

  // This returns the type `{ a: string; b: string; c?: undefined }`
  type ConditionalTypeExampleTrue = ConditionalType<true, AType, BType>;

  // This returns the type `{ a?: undefined; b: string; c: number }`
  type ConditionalTypeExampleFalse = ConditionalType<false, AType, BType>;
 * ```
 *
 * #### Real Example
 *
 * @example
 * ```tsx
  type InputTextInput = InputHTMLAttributes<HTMLInputElement>;

  type InputTextTextArea = TextareaHTMLAttributes<HTMLTextAreaElement>;

  export type InputTextProps<
    AsTextArea extends boolean = false
  > = {
    asTextarea?: AsTextArea;
  } & ConditionalType<AsTextArea, InputTextTextArea, InputTextInput>;

  const InputText = ({ asTextArea, type, onClick }: InputTextProps) => {
  return (
    <>
    {asTextarea ? (
      <textarea
        onClick={onClick} // This is InputTextTextArea['onClick]
      />
    ) : (
      <input
        type={type} // This is InputHTMLAttributes['type]
        onClick={onClick} // This is InputHTMLAttributes['onClick]
      />
    )
    </>
  }
 * ```
 */
export type ConditionalType<Condition extends boolean, IfTrue extends object, IfFalse extends object> = Condition extends true
	? IfTrue & Omit<NilRecord<IfFalse>, keyof IfTrue>
	: IfFalse & Omit<NilRecord<IfTrue>, keyof IfFalse>;
