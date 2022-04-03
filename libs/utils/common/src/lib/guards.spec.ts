import { isType } from './guards';

const testObject = {
	age: 12,
	name: 'foo',
	country: undefined,
};

describe('Guards', () => {
	it('isType', () => {
		const falsyObject = {};

		const truthyObject = {
			age: 1,
			name: 'foo',
			country: undefined,
		};

		expect(isType<typeof testObject>(falsyObject, (a) => !!a.name)).toBeFalsy();

		expect(isType<typeof testObject>(truthyObject, (a) => !!a.name)).toBeTruthy();
	});
});
