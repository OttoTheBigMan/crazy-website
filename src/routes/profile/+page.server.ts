import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

const prisma = new PrismaClient();

export const load = (async ({cookies}) => {
    let userInfo : {id: string, name: string, avatar: string, bio: string, createdAt: Date} = {id: "", name: "", avatar: "", bio: "", createdAt: new Date()};
    let token = cookies.get("username");
    let prismaToken = await prisma.token.findUnique({where: {id: token}});
    if(prismaToken) {
        let user = await prisma.user.findUnique({where: {id: prismaToken.userId}});
        if(user != null && user != undefined) {
            userInfo = {id: user.id, name: user.name, avatar: user.avatar, bio: user.bio, createdAt: user.createdAt};
        }
        else{
            throw redirect(303, "/login");
        }
    }
    else{
        throw redirect(303, "/login");
    }
    return {proflie: userInfo};
}) satisfies PageServerLoad;