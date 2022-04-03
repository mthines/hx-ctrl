import { arrayFromNumber, getMiddle } from './array';

const testArray = [
	{
		age: 12,
		name: 'foo',
		country: undefined,
	},
	{
		age: 52,
		name: 'bar',
		country: undefined,
	},
	{
		age: 32,
		name: 'bar',
		country: 'denmark',
	},
	{
		age: 11,
		name: 'bar',
		country: 'sweden',
	},
];

describe('Array', () => {
	it('arrayFromNumber', () => {
		expect(arrayFromNumber(5)).toEqual([0, 1, 2, 3, 4]);
	});
	it('getMiddle', () => {
		expect(getMiddle(testArray, 2)).toEqual([
			{ age: 52, name: 'bar', country: undefined },
			{ age: 32, name: 'bar', country: 'denmark' },
		]);
	});
});
