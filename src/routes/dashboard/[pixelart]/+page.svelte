<script lang="ts">
    import { enhance } from '$app/forms';
    import { onDestroy, onMount } from 'svelte';
    import type { PageData } from './$types';
    import { invalidate, invalidateAll } from '$app/navigation';
    export let data: PageData;
    let pixels = data.pixels;
    let saveButton : HTMLButtonElement;
    let currentColor = "#000";
    function handleColorChange(event : any) {
        currentColor = event.target.value;

    }
    function YepCock(){
        setTimeout(() => {
            saveButton.click();
        }, 10);
    }
    function EditPixel(event : MouseEvent, index : number){
        if(event.buttons != 1) return;
        pixels[index].color = currentColor;
        pixels = pixels;
        
    }
</script>

<main class="h-screen w-screen flex flex-col items-center">
    <h1 class="h1">HEHHEHEHAW: {data.name}</h1>
    <h2 class="h2">Size: {data.width}x{data.height}</h2>

    <div class="flex justify-evenly w-full">
        <div class="variant-ghost-primary flex flex-col items-center">
            <input type="color" bind:value={currentColor} on:change={handleColorChange} />
            <button class="btn variant-ghost-secondary" on:click={() => currentColor=""}><i class="fa-solid fa-eraser" style="color: {currentColor == "" ? "black" : "white"}"></i></button>
        </div>
        <div class="variant-ghost-primary rounded-2xl grid justify-center items-center w-fit p-5" style="grid-template-columns: repeat({data.width}, auto); grid-template-rows: repeat({data.height}, auto)">
            {#each pixels as pixel, i}
            <!--  -->
                <form action="?/edit" method="post" use:enhance class="w-8 h-8">
                    <input type="hidden" name="id" value="{i}" />
                    <input type="hidden" name="color" value="{currentColor}" />
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <button class="w-8 h-8 hover:opacity-75" style="background-color: {pixel.color == '' ? '#eee' : pixel.color}" on:mouseover={(e) => EditPixel(e, i)} on:mousedown={(e) => EditPixel(e, i)} on:mouseup={() => YepCock()}/>
                </form>
            {/each}
        </div>
        <div class="variant-ghost-primary">
            I dont know what to put here😱
        </div>
    </div>
    <form action="?/edit" method="post" use:enhance class="w-8 h-8">
        <input type="hidden" name="pixels" value={pixels}>
        <!-- svelte-ignore a11y-mouse-events-have-key-events -->
        <button class="hidden" type="submit" bind:this={saveButton}/>
    </form>
</main>
