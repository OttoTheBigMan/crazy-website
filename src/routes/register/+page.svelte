<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData, PageData } from './$types';
    
    export let form: ActionData;
    // export let data: PageData;
</script>
<main class="flex justify-center items-center h-screen w-screen">
    <div class="flex flex-col items-center variant-glass-primary rounded-2xl p-5">
        <h1 class="h1 mb-2">Register account</h1>
        <form action="?/register" method="post" use:enhance class="flex flex-col items-center gap-5">
            <label class="w-full">E-mail: <input type="email" name="email" class="input"/></label>
            <label class="w-full">Name: <input type="text" name="fullName" class="input"/></label>
            <label class="w-full">Password: <input type="password" name="password" class="input"/></label>
            <label class="w-full">Repeat Password: <input type="password" name="password-repeat" class="input"/></label>
            <button class="btn variant-ghost-secondary">Submit</button>
            {#if form?.msg}
                <span style="color: red;">{form.msg}</span>
            {/if}
        </form>
        <span>Already have an account? <a href="/login" class="text-blue-500 hover:underline">Log in here</a></span>
    </div>
</main>
