import { YOUTUBE_API_KEY } from '$env/static/private';
import { page } from '$app/stores';
import { json } from '@sveltejs/kit';

/** @type {import('./$types').RequestHandler} */
export async function POST({ request }) {
	const { id } = await request.json();
	console.log('at server: ' + id);
	try {
		const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails%2Cid%2Cstatistics%2Csnippet%2Cstatus%2Cplayer&id=${id}&key=${YOUTUBE_API_KEY}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error('Failed to fetch metadata');
		}

		const data = await response.json();
		if (!data) {
			throw new Error('Invalid metadata');
		}

		console.log(data.items[0]);
		return json(data.items[0]);
	} catch (e) {
		throw Error('Failed to fetch metadata');
	}
}
