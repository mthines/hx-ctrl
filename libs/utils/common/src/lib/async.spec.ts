import { sleep } from './async';

describe('Async', () => {
	it('sleep', async () => {
		const now = new Date().toISOString();
		const alsoNow = new Date().toISOString();

		expect(now === alsoNow).toEqual(true);
		await sleep(500);
		const then = new Date().toISOString();
		expect(now === then).toEqual(false);
	});
});
