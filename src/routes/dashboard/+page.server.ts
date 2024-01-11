import { error, fail, redirect } from '@sveltejs/kit';
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

    //Find the users pixelarts:

    let pixelarts = await prisma.pixelArt.findMany({where: {userId: currentUserId}, orderBy: {createdAt: "desc"}});
    let pixelartList = pixelarts.map((pixelart) => {
        return {
            id: pixelart.id,
            name: pixelart.title,
            description: pixelart.description,
            createdAt: pixelart.createdAt,
            isFavorite: pixelart.favorite
        }
    })

    return { pixelArtList: pixelartList };
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
        const pixels = new Array(width * height).fill("#eeeeee");
        const pixelart = await prisma.pixelArt.create({data: {
            title: name,
            description: desc,
            width: width,
            height: height,
            userId: currentUserId,
            drawnPixels: pixels
        }});

        throw redirect(300, "/dashboard/" + pixelart.id);
    },
    deleteArt: async ({request}) => {
        let data = await request.formData();
        let id = data.get("id")?.toString();
        if(!id){
            return fail(400, {error: "No id sent"});
        }
        let pixelart = await prisma.pixelArt.findUnique({where: {id: id}});
        if(!pixelart){
            return fail(404, {error: "Pixelart not found"});
        }
        if(pixelart.userId !== currentUserId){
            return fail(403, {error: "You do not have access to this pixelart"});
        }
        await prisma.pixelArt.delete({where: {id: id}});
        
        let pixelarts = await prisma.pixelArt.findMany({where: {userId: currentUserId}, orderBy: {createdAt: "desc"}});
        let pixelartList = pixelarts.map((pixelart) => {
            return {
                id: pixelart.id,
                name: pixelart.title,
                description: pixelart.description,
                createdAt: pixelart.createdAt,
                isFavorite: pixelart.favorite
            }
        })
        return { pixelArtList: pixelartList };
    },
    toggleFavorite: async ({ request }) => {
        let data = await request.formData();
        let id = data.get("id")?.toString();
        if(!id){
            throw error(400, "No id sent");
        }
        let pixelart = await prisma.pixelArt.findUnique({where: {id: id}});
        if(!pixelart){
            throw error(404, "Pixelart not found");
        }
        await prisma.pixelArt.update({where: {id: id}, data: {favorite: !pixelart.favorite}});
        //Find the users pixelarts:

        let pixelarts = await prisma.pixelArt.findMany({where: {userId: currentUserId}, orderBy: {createdAt: "desc"}});
        let pixelartList = pixelarts.map((pixelart) => {
            return {
                id: pixelart.id,
                name: pixelart.title,
                description: pixelart.description,
                createdAt: pixelart.createdAt,
                isFavorite: pixelart.favorite
            }
        })
        return { pixelArtList: pixelartList };
    }
};