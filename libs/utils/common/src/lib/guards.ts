import isFunction from 'lodash/isFunction';

/**
 * `isType` is a method to force cast `T` to another type,
 * and adding a `safetyCheck` to runtime validate that the cast is correct.
 */
export const isType = <T>(
	/**
	 * The value that you want to check
	 */
	value: unknown,
	/**
	 * The check that the value actually is of that type
	 */
	safetyCheck: ((v: T) => boolean) | boolean,
): value is T => {
	// If the safety check is a function.
	if (isFunction(safetyCheck)) {
		return !!value && safetyCheck(value as T);
	}

	// If the safety check is a boolean
	return !!value && safetyCheck;
};
