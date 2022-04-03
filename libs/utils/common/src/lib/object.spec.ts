import { entries, keys, prune, values } from './object';

const TEST_OBJECT = {
	age: 12,
	name: 'foo',
	country: undefined,
};

describe('Object', () => {
	it('entries', () => {
		expect(entries(TEST_OBJECT)).toEqual([
			['age', 12],
			['name', 'foo'],
			['country', undefined],
		]);
	});
	it('values', () => {
		expect(values(TEST_OBJECT)).toEqual([12, 'foo', undefined]);
	});
	it('keys', () => {
		expect(keys(TEST_OBJECT)).toEqual(['age', 'name', 'country']);
	});
	it('prune', () => {
		expect(prune(TEST_OBJECT)).toEqual({ age: 12, name: 'foo' });
	});
});
