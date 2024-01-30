import { error, fail, redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const load = (async ({ cookies }) => {
    // Function to find the current logged-in user
    

    let loggedIn = false;
    let currentUser = await _findCurrentUser(cookies.get("username") ?? "");

    if (currentUser) {
        loggedIn = true;
    }

    return { userExists: loggedIn, currentUser };
}) satisfies LayoutServerLoad;


export const _findCurrentUser = async (token : string) => {
        let prismaToken = await prisma.token.findUnique({
        where: { id: token },
        include: { user: { select: { name: true, id: true } } }
    });
    if(!prismaToken) return "";

    return prismaToken.user;
};