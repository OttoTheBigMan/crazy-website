<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;
    let visible = false;
    let currentDeleteId = "";
    let pixelArts = data.pixelArtList;
    $ : {
        pixelArts = data.pixelArtList;
    }
    let filterFavorites = false;
    function toggleFilter(){
        filterFavorites = !filterFavorites;
    }
</script>
<main class="h-screen w-screen flex flex-col items-center">
    <h1 class="h1">Your dashboard</h1>
    <!-- TODO: Load in the users pixelart from the server -->
    <div class="flex justify-around w-full h-full m-10">
        <form action="?/createPixelart" method="post" class="variant-glass-primary rounded-2xl p-3 gap-5 flex flex-col items-center w-[40%] h-full" use:enhance>
            <h2 class="h2">Create new pixelart</h2>
            <label class="flex flex-col items-center">Pixelart Name<input type="text" class="input" name="name"></label>
            <label class="flex flex-col items-center">Description<input type="text" class="input" name="description"></label>
            <div class="flex gap-5">
                <label class="flex flex-col items-center">Width<input type="number" class="input" name="width"></label>
                <label class="flex flex-col items-center">Height<input type="number" class="input" name="height"></label>
            </div>
            <button class="btn variant-ghost-secondary">Create</button>
        </form>
        <div class="variant-glass-primary rounded-2xl w-[40%] h-full flex flex-col items-center p-3 gap-5">
            {#if pixelArts.length != 0}
                <div class="flex gap-3">
                    <h2 class="h2">Pixelarts</h2>
                    <button on:click={toggleFilter} class="btn-icon variant-ghost-tertiary"><i class="fa-{filterFavorites ? "solid" : "regular"} fa-star"></i></button>
                </div>
            {/if}
            {#each pixelArts as art}
                {#if art.isFavorite || !filterFavorites}
                    <div class="flex justify-between p-2 items-center rounded variant-ghost-secondary w-full">
                        <div class="flex gap-3">
                            <a href="/dashboard/{art.id}" class="btn-icon variant-ghost-tertiary"><i class="fa-solid fa-pen-to-square"></i></a>
                            <form action="?/toggleFavorite" method="post" use:enhance>
                                <input type="hidden" value={art.id} name="id">
                                <button class="btn-icon variant-ghost-tertiary"><i class="fa-{art.isFavorite ? "solid" : "regular"} fa-star"></i></button>
                            </form>
                        </div>
                        <h4 class="h4">{art.name}</h4>
                        <button class="btn-icon variant-ghost-tertiary" on:click={() => {visible = true; currentDeleteId = art.id}}><i class="fa-solid fa-trash"></i></button>
                    </div>
                {/if}
            {/each}
            {#if pixelArts.length == 0}
                <i class="fa-solid fa-hippo fa-4x"></i>
            {/if}
        </div>
    </div>
    <!-- Popup when delete -->
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