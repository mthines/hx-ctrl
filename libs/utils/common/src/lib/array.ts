import cloneDeep from 'lodash/cloneDeep';

/**
 * Generate an array from a number
 * @returns Array with `quantity` amount of items in it, with their index as value.
 */
export const arrayFromNumber = <T extends number>(quantity: T) => Array.from(Array(quantity).keys());

/**
 * Shuffle the order of the Array
 *
 * @param array The array you want to shuffle
 * @immutable
 */
export const shuffle = <T>(array: T[]): T[] => {
	const _array = cloneDeep(array);
	let currentIndex = _array.length;
	let temporaryValue;
	let randomIndex;

	// While there remain elements to shuffle...
	while (currentIndex !== 0) {
		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = _array[currentIndex];
		_array[currentIndex] = _array[randomIndex];
		_array[randomIndex] = temporaryValue;
	}

	return _array;
};

/**
 * Get the middle items of an array.
 */
export const getMiddle = <T>(
	/** The array you want to iterate over */
	items: T[],
	/**
	 * The number of items you want to return from the middle
	 */
	itemsFromMiddle = 1,
) => {
	const start = Math.floor(items.length / 2) - Math.floor(itemsFromMiddle / 2);
	const end = start + itemsFromMiddle;
	const middleItems = items.slice(start, end);

	if (itemsFromMiddle === 1) {
		return middleItems[0];
	}

	return middleItems;
};

/**
 * @returns A random item from the array
 */
export const randomElement = <T>(array: T[]) => array[Math.floor(Math.random() * array.length)];
