<script lang="ts">
    import type { PageData } from './$types';
    
    export let data: PageData;
</script>

<main class="h-screen w-screen">
    <h1 class="h1">Welcome {data.proflie.name}</h1>
    <p>Will add functionality for editing profile :)</p>
    <a href="/profile/{data.proflie.name}" class="btn variant-ghost-primary">View profile</a>
</main>