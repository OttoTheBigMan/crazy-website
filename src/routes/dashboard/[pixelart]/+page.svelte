<script lang="ts">
    import { enhance } from '$app/forms';
    import { onDestroy, onMount } from 'svelte';
    import {afterUpdate} from 'svelte';
    import type { PageData } from './$types';
    import { invalidateAll } from '$app/navigation';
    import type { ActionData } from './$types';
    export let data: PageData;
    export let form: ActionData;
    let oldPixels = JSON.parse(JSON.stringify(data.pixels));
    let pixels = data.pixels;
    $: pixels = data.pixels;
    let publicArt = data.isPublic;
    $: publicArt = data.isPublic;
    

    let indexes : boolean[] = []
    let glowInterval : NodeJS.Timeout;
    afterUpdate(() => {
        Glow();
    })
    function Glow(){
        // Get all the indexes that differ between oldpixels and pixels
        let temp = pixels.map((pixel : any, i : number) => {
            return pixel.color != oldPixels[i].color && pixel.author != data.user;
        }, []);
        oldPixels = pixels;
        //return if the array only contains false
        if(!temp.includes(true)) return;
        clearInterval(glowInterval);
        indexes = temp;
        glowInterval = setInterval(() => {
            indexes = [];
        }, 250);
    }
    let currentColor = "#000000";
    let interval : NodeJS.Timeout;
    // Update pixels live
    onMount(() => {
        interval = setInterval(() => {
            invalidateAll();
        }, 1500);
        pixelSize = CalculatePixelSize();
        console.log(pixelSize);
        pixels = pixels;
    });
    onDestroy(() => {
        clearInterval(interval);
    });
    const pixelArtColors = [
        "#000000", // Black
        "#FFFFFF", // White
        "#FF0000", // Red
        "#0000FF", // Blue
        "#00FF00", // Green
        "#FFFF00", // Yellow
        "#A52A2A", // Brown
        "#808080"  // Gray
    ];
    let canvasElement : HTMLDivElement;
    let pixelSize : number;
    function CalculatePixelSize(){
        let width = canvasElement.clientWidth;
        let height = canvasElement.clientHeight;
        let pixelSize = Math.min(width / data.width, height / data.height);
        return pixelSize;
    }

    function handleColorChange(event: any) {
        currentColor = event.target.value;
    }
    let prevColor = currentColor;
    let colorInput : HTMLInputElement;
    function ToggleEraser(){
        if(currentColor == ""){
            currentColor = prevColor;
        }else{
            prevColor = currentColor;
            currentColor = "";
        }
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
        <div class="variant-ghost-primary flex flex-col items-center justify-evenly p-3 rounded gap-2">
            <input type="color" bind:value={currentColor} on:change={handleColorChange} bind:this={colorInput} class="hidden"/>
            <button class="btn-icon variant-ghost-secondary" on:click={() => colorInput.click()}>
                <i class="fa-solid fa-palette" style="color: {currentColor}"></i>
            </button>
            
            {#each pixelArtColors as color}
                <button class="btn-icon variant-ghost-secondary" on:click={() => currentColor=color}><i class="fa-solid fa-droplet" style="color: {color}"></i></button>
            {/each}
            <button class="btn-icon variant-ghost-secondary" on:click={() => ToggleEraser()}><i class="fa-solid fa-eraser" style="color: {currentColor=="" ? "black" : "white"}"></i></button>
        </div>
        <div bind:this={canvasElement} class="variant-ghost-primary rounded grid justify-center items-center w-[40%] aspect-square" style="grid-template-columns: repeat({data.width}, {pixelSize}px); grid-template-rows: repeat({data.height}, {pixelSize}px)">
            {#each pixels as pixel, i}
                <form action="?/edit" method="post" use:enhance class="w-full h-full">
                    <input type="hidden" value="{currentColor}" name="color">
                    <input type="hidden" value="{i}" name="index">
                    <input type="hidden" name="userName" value={data.user}>
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <button class="hover:opacity-75 w-full h-full pixel" class:animationStarter={indexes[i]} style="background-color: {pixel.color == "" ? "#eeeeee" : pixel.color}" on:mouseover={(e) => {
                        if(e.buttons != 1) return;
                        if(pixel.color == currentColor) return;
                        
                        pixels[i].color = currentColor;
                        pixels = pixels;
                        e.currentTarget.click();                 
                    }} on:mousedown={(e) => {
                        if(e.buttons != 1) return;
                        if(pixel.color == currentColor) return;

                        pixels[i].color = currentColor;
                        pixels = pixels; 
                        e.currentTarget.click();
                    }}
                    
                    />
                    <!-- on:mouseup={() => YepCock()} (Inne i knappen ofc) -->
                </form>
            {/each}
        </div>
        <div class="variant-ghost-primary flex flex-col p-3 rounded">
            <h2 class="h2">Description</h2>
            <p>{data.description}</p>
            <h2 class="h2">Settings</h2>
            <form action="?/togglePublic" method="post" use:enhance>
                <input type="hidden" name="id" value={data.id}>
                <label for="balls">
                    <button class="btn-icon variant-ghost-secondary"><i class="{publicArt ? "fa-solid" : "fa-regular"} fa-circle-check"></i></button>
                    <span>Toggle publicity</span>
                </label>
                {#if form?.message}

                    <p class="text-red-500">{form.message}</p>

                {/if}
            </form>
        </div>
    </div>
    <a href="/dashboard" class="btn-icon variant-ghost-secondary absolute top-[15px] left-[15px]"><i class="fa-solid fa-arrow-left"></i></a>
</main>

<style>
    .animationStarter {
        animation: glow 0.4s;
    }
    @keyframes glow {
        0% {
            border: 2px solid gold;
        }
        100% {
            border: 2px solid transparent;
        }
    }
</style>