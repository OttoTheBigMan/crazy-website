import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const load = (async ({params}) => {
    let userInfo : {name: string, avatar: string, bio: string, createdAt: Date} = {name: "", avatar: "", bio: "", createdAt: new Date()};
    let user = await prisma.user.findUnique({where: {name: params.user}});
    if(user) {
        userInfo = {name: user.name, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt};        
    }
    else{
        throw error(404, "User not found");
    }
    return {proflie: userInfo};
}) satisfies PageServerLoad;