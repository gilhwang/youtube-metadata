<script>
	let link;
	let error = null;
	let metadata = null;

	const options = {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		second: '2-digit',
		timeZoneName: 'short'
	};

	async function getVideoMeta() {
		error = null;
		metadata = null;

		try {
			const id = extactVideoId(link);
			console.log(id);
			if (!id) {
				error = 'Invalid Link';
				console.log('Invalid link provided');
				return;
			}
			const response = await fetch(`api/youtube`, {
				method: 'POST',
				body: JSON.stringify({ id: id })
			});
			metadata = await response.json();
			console.log(metadata);
		} catch (e) {
			error = 'Failed to read data: ' + e.toString();
			console.log('failed to fetch data: ', e);
		}
	}

	function extactVideoId(url) {
		const VID_REGEX =
			/(?:youtube(?:-nocookie)?\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
		return url.match(VID_REGEX)[1];
	}

	function insertCommas(num) {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}
</script>

<div class="flexflex-col m-10 items-center justify-center p-2 sm:p-3 md:p-4">
	<h1>
		Get <span class="bg-gradient-to-r from-sky-400 to-emerald-600 bg-clip-text text-transparent"
			>Youtube</span
		> Video Metadata
	</h1>

	<label for="video-link" class="mb-3 block text-xl font-medium text-gray-900 dark:text-slate-100"
		>Paste youtube video link!</label
	>
	<input
		type="text"
		id="video-link"
		class="mb-7 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
		placeholder="e.g. https://www.youtube.com/watch?v=jNQXAC9IVRw"
		aria-describedby="video-link-input-field"
		bind:value={link}
		required
	/>
	<button
		type="button"
		on:click={getVideoMeta}
		class="mb-5 me-2 rounded-lg bg-blue-700 px-5 py-2.5 text-lg font-medium text-white transition hover:scale-105 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
		>GO</button
	>

	{#if error}
		<div
			id="alert-border-2"
			class="mb-4 flex items-center border-t-4 border-red-300 bg-red-50 p-4 text-red-800 dark:border-red-800 dark:bg-gray-800 dark:text-red-400"
			role="alert"
		>
			<svg
				class="h-4 w-4 flex-shrink-0"
				aria-hidden="true"
				xmlns="http://www.w3.org/2000/svg"
				fill="currentColor"
				viewBox="0 0 20 20"
			>
				<path
					d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"
				/>
			</svg>
			<div class="ms-3 text-sm font-medium">
				{error}
			</div>
		</div>
	{/if}

	{#if metadata}
		<div>
			<div class="my-10">{@html metadata.player.embedHtml}</div>
			<div class="mb-10">
				<h3>Thumbnail</h3>
				<img alt="thumbnail" src={metadata.snippet.thumbnails.maxres.url} class="max-w-full" />
			</div>

			<div class="meta-table">
				<table>
					<caption>
						{metadata.snippet.title}
						<p>{metadata.snippet.description}</p>
					</caption>
					<thead>
						<tr>
							<th>Metadata</th>
							<th>Value</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th> Published Date </th>
							<td>
								{new Intl.DateTimeFormat('en-US', options).format(
									new Date(metadata.snippet.publishedAt)
								)}
							</td>
						</tr>
						<tr>
							<th> Channel </th>
							<td> {metadata.snippet.channelTitle} </td>
						</tr>
						<tr>
							<th> Views </th>
							<td> {insertCommas(metadata.statistics.viewCount)} </td>
						</tr>
						<tr>
							<th> Likes </th>
							<td> {insertCommas(metadata.statistics.likeCount)} </td>
						</tr>
						<tr>
							<th> Comments </th>
							<td> {insertCommas(metadata.statistics.commentCount)} </td>
						</tr>
						<tr>
							<th>Tags</th>
							<td>
								<div class="my-3 mb-10 flex flex-wrap gap-x-1 gap-y-3">
									{#each metadata.snippet.tags as tag}<span
											class="me-2 rounded border border-gray-500 bg-gray-100 px-2.5 py-0.5 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-400"
											>{tag}</span
										>{/each}
								</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
