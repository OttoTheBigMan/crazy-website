import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const load = (async ({ cookies }) => {
    //username cookie is the token :()
    let token = cookies.get("username");
    let loggedIn = false;
    if(!token){
        
        return { userExists: loggedIn };
    }

    let prismaToken = await prisma.token.findUnique({
        where: {id: token},
        include: {user: {select: {name: true, id: true}}}
    })

    if(prismaToken){
        const expireDays = 7
        //Kolla om kakan har expirat
        if(Date.now() - prismaToken.createdAt.getTime() > expireDays * 1000 * 3600 * 24){
            cookies.delete("username")
            await prisma.token.delete({where: {id: token}});
        }
        else{
            loggedIn = true;
        }
    }

    
    return { userExists: loggedIn };
}) satisfies PageServerLoad;