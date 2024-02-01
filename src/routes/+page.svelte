<script lang="ts">
    import { enhance } from '$app/forms';

	//Get the pagedata from the server
	import type { PageData } from './$types';
	let visible = false;
    let currentDeleteId = "";
	let filterFavorites = false;
	export let data: PageData;
	let pixelArts = data.arts ?? [];
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
			<h2 class="h2">Public Pixelarts</h2>
			<div class="scrollable flex flex-col items-center w-full">
				{#each pixelArts as art}
					{#if art.isFav || !filterFavorites}
						<div class="flex justify-between p-2 items-center rounded variant-ghost-secondary w-full">
							<div class="flex gap-3">
								<a href="/dashboard/{art.id}" class="btn-icon variant-ghost-tertiary"><i class="fa-solid fa-pen-to-square"></i></a>
								<form action="?/toggleFavorite" method="post" use:enhance>
									<input type="hidden" value={art.id} name="id">
									<button class="btn-icon variant-ghost-tertiary"><i class="fa-{art.isFav ? "solid" : "regular"} fa-star"></i></button>
								</form>
							</div>
							<h4 class="h4">{art.name}</h4>
							<div class="flex gap-3 items-center">							
								<button class="btn-icon variant-ghost-tertiary" on:click={() => {visible = true; currentDeleteId = art.id}}><i class="fa-solid fa-trash"></i></button>
							</div>
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	{#if visible}
        <aside class="alert variant-filled-warning" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
            <!-- Icon -->
            <div><i class="fa-solid fa-triangle-exclamation fa-2x"></i></div>
            <!-- Message -->
            <div class="alert-message">
                <h3 class="h3">The danger zone</h3>
                <p>Are you sure you want to delete this fine piece of art?</p>
            </div>
            <!-- Actions -->
            <div class="alert-actions">
                <form action="?/deleteArt" method="post" use:enhance on:submit={() => visible = false}>
                    <input type="hidden" value={currentDeleteId} name="id">
                    <button class="btn variant-filled">Confirm</button>
                </form>
                <button class="btn-icon variant-filled" on:click={() => visible = false}><i class="fa-solid fa-xmark"></i></button>
            </div>
        </aside>
    {/if}
</main>