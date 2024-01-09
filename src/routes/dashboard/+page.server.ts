import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';

let currentUserId = "";
const prisma = new PrismaClient();
export const load = (async ({cookies}) => {
    let token = cookies.get("username");
    if(!token){
        
        throw redirect(303, "/login")
    }

    let prismaToken = await prisma.token.findUnique({
        where: {id: token},
        include: {user: {select: {name: true, id: true}}}
    })

    if(!prismaToken){
        cookies.delete("username");
        throw redirect(303, "/login");
    }

    const expireDays = 7
    //Kolla om kakan har expirat
    if(Date.now() - prismaToken.createdAt.getTime() > expireDays * 1000 * 3600 * 24){
        cookies.delete("username")
        await prisma.token.delete({where: {id: token}});
        throw redirect(303, "/login")
    }
    currentUserId = prismaToken.user.id;
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
    createPixelart: async ({request}) => {
        let data = await request.formData();
        let name = data.get("name")?.toString();
        let desc = data.get("description")?.toString();
        let w = data.get("width");
        let h = data.get("height");
        if(!name || !w || !h || !desc){
            return fail(400, {error: "Please fill out all the fields."});
        }
        let width = parseInt(w.toString());
        let height = parseInt(h.toString());
        
        if(isNaN(width) || isNaN(height)){
            return fail(400, {error: "Please enter valid numbers, cuh."});
        }
        const pixels = JSON.stringify(new Array(width * height).fill({
            color: "",
            x: 0,
            y: 0
        }));
        const pixelart = await prisma.pixelArt.create({data: {
            title: name,
            description: desc,
            width: width,
            height: height,
            userId: currentUserId,
            drawnPixels: pixels
        }});

        throw redirect(300, "/dashboard/" + pixelart.id);
    }
};