<script>
	import { onMount } from 'svelte';
	let id;
	let error = null;
	let metadata = null;

	async function getVideoMeta() {
		error = null;
		metadata = null;

		try {
			const response = await fetch(`api/youtube`, {
				method: 'POST',
				body: JSON.stringify({ id: id })
			});
			metadata = await response.json();
			console.log(metadata);
		} catch (e) {
			error = 'failed to fetch';
			console.log('failed to fetch', e);
		}
	}
</script>

<h1>Get Youtube Video Metadata</h1>

<label for="link-input" class="mb-2 block text-sm font-medium text-gray-900"
	>Youtube Video Link</label
>
<input
	type="email"
	id="link-input"
	aria-describedby="helper-text-explanation"
	class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
	placeholder="e.g. https://www.youtube.com/watch?v=jNQXAC9IVRw"
	bind:value={id}
/>

<button type="submit" on:click={getVideoMeta}>Go</button>

{#if error}
	<p class="text-red-700">{error}</p>
{/if}

{#if metadata}
	<div>{@html metadata.player.embedHtml}</div>
	<div>
		<h2>Thumbnail</h2>
		<img alt="thumbnail" src={metadata.snippet.thumbnails.default.url} />
	</div>

	<h2>Title: {metadata.snippet.title}</h2>
	<h2>Published at: {metadata.snippet.publishedAt}</h2>
	<h2>Channel: {metadata.snippet.channelTitle}</h2>
	<h2>{metadata.statistics.viewCount} views</h2>
	<h2>{metadata.statistics.likeCount} likes</h2>
	<h2>{metadata.statistics.commentCount} comments</h2>
{/if}
