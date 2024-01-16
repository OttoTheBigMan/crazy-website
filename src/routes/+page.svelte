<script lang="ts">
	//Get the pagedata from the server
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<main class="h-screen w-screen flex items-center flex-col">
	<h1 class="h1">Pixelart 😱</h1>
	<div class="flex w-full justify-evenly h-full m-10">
		<div class="variant-glass-primary rounded-xl p-3 flex flex-col items-center gap-5 w-[30%]">
			<h2 class="h2">Your stuff</h2>
			{#if data.userExists}
				<a href="/dashboard" class="btn variant-ghost-tertiary">Your Pixelarts</a>
				<a href="/profile" class="btn variant-ghost-tertiary">Your Profile</a>
			{:else}
				<a href="/register" class="btn variant-ghost-tertiary">Get Started</a>
			{/if}
		</div>
		<div class="variant-glass-primary rounded-xl p-3 flex flex-col items-center w-[30%]">
			<h2 class="h2">Browse Pixelarts</h2>
		</div>
	</div>
</main>