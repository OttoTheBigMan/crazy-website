<script lang="ts">
    import { enhance } from "$app/forms";
    import type { ActionData } from "./$types.js";

    export let form: ActionData;
    // export let data;
</script>

<!-- Enhance enhancear formuläret -->
<main class="flex justify-center items-center h-screen w-screen">
    <div class="flex flex-col items-center variant-glass-primary rounded-2xl p-5">
        <h1 class="h1">Login</h1>
        <form method="post" action="?/login" use:enhance class="flex flex-col items-center gap-5">
            <label class="w-full">Email: <input type="email" name="email" class="input"/></label>
            <label class="w-full">Password: <input type="password" name="password" class="input"/></label>

            <button class="btn variant-ghost-secondary">Log In</button>
            {#if form?.userName}
                <span style="color: red;">{form.userName}</span>
            {/if}
        </form>
        <span>Don't have an account? <a href="/register" class="text-blue-500 hover:underline">Register here</a></span>
    </div>
</main>