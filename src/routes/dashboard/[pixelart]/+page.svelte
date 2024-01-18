<script lang="ts">
    import { enhance } from '$app/forms';
    import { onDestroy, onMount } from 'svelte';
    import type { PageData } from './$types';
    import { invalidate, invalidateAll } from '$app/navigation';
    export let data: PageData;
    $: pixels = data.pixels;
    let updateButton: HTMLButtonElement;
    let currentColor = "#000000";
    let interval : NodeJS.Timeout;
    // Update pixels live
    onMount(() => {
        interval = setInterval(() => {
            updateButton.click();
        }, 1000);
        
    });
    onDestroy(() => {
        clearInterval(interval);
    });

    

    function handleColorChange(event: any) {
        currentColor = event.target.value;
    }
    
    // function EditPixel(event : MouseEvent, index : number){
    //     if(event.buttons != 1) return;
    //     pixels = pixels;
    //     console.log(pixels.length);
    // }
</script>

<main class="h-screen w-screen flex flex-col items-center">
    <h1 class="h1">Pixelart: {data.name}</h1>
    <h2 class="h2">Size: {data.width}x{data.height}</h2>

    <div class="flex justify-evenly w-full">
        <div class="variant-ghost-primary flex flex-col items-center p-3 rounded gap-2">
            <button class="btn-icon variant-ghost-secondary"><input type="color" class="input" bind:value={currentColor} on:change={handleColorChange}/></button>
            
        </div>
        <div class="variant-ghost-primary rounded-2xl grid justify-center items-center p-5 " style="grid-template-columns: repeat({data.width}, auto); grid-template-rows: repeat({data.height}, auto)">
            {#each pixels as pixel, i}
                <form action="?/edit" method="post" use:enhance class="w-8 h-8">
                    <input type="hidden" value="{currentColor}" name="color">
                    <input type="hidden" value="{i}" name="index">
                    <input type="hidden" name="author" value={data.user}>
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <button class="hover:opacity-75 w-full h-full border {pixel.author == data.user ? "border-red-500" : ""}" style="background-color: {pixel.color == "" ? "#eeeeee" : pixel.color}" on:mouseover={(e) => {
                        
                        if(e.buttons != 1) return;
                        
                        pixels[i].color = currentColor;
                        pixels = pixels;
                        e.currentTarget.click();                 
                    }} on:mousedown={(e) => {
                        if(e.buttons != 1) return;
                        
                        pixels[i].color = currentColor;
                        pixels = pixels; 
                        e.currentTarget.click();
                    }}/>
                    <!-- on:mouseup={() => YepCock()} (Inne i knappen ofc) -->
                </form>
            {/each}
        </div>
        <div class="variant-ghost-primary flex flex-col p-3 rounded">
            <h2 class="h2">Description</h2>
            <p>{data.description}</p>
        </div>
    </div>
    <a href="/dashboard" class="btn-icon variant-ghost-secondary absolute top-[15px] left-[15px]"><i class="fa-solid fa-arrow-left"></i></a>
    <form action="?/update" method="post" use:enhance class="w-8 h-8">
        <button class="hidden" type="submit" bind:this={updateButton}/>
    </form>
</main>