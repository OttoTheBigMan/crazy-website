<script lang="ts">
    import { enhance } from '$app/forms';
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>
<main class="h-screen w-screen flex flex-col items-center">
    <h1 class="h1">Your dashboard</h1>
    <!-- TODO: Load in the users pixelart from the server -->
    <div class="flex justify-evenly">
        <form action="?/createPixelart" method="post" class="variant-glass-primary rounded-2xl p-3 gap-5 flex flex-col items-center" use:enhance>
            <h2 class="h2">Create new pixelart</h2>
            <label class="flex flex-col items-center">Pixelart Name<input type="text" class="input" name="name"></label>
            <label class="flex flex-col items-center">Description<input type="text" class="input" name="description"></label>
            <div class="flex gap-5">
                <label class="flex flex-col items-center">Width<input type="number" class="input" name="width"></label>
                <label class="flex flex-col items-center">Height<input type="number" class="input" name="height"></label>
            </div>
            <button class="btn variant-ghost-secondary">Create</button>
        </form>
    </div>
</main>