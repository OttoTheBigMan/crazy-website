import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { PrismaClient } from '@prisma/client';
import { _findCurrentUser } from '../+layout.server';


const prisma = new PrismaClient();
export const load = (async ({cookies}) => {
    prisma.$connect()
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

    let uid = prismaToken.user.id;
    //Find the users pixelarts:
    let pixelarts = await prisma.pixelArt.findMany({where: {userId: uid}, orderBy: {createdAt: "desc"}});
    let userInfo = {id: prismaToken.user.id, name: prismaToken.user.name}
    let pixelartList = pixelarts.map((pixelart) => { 
        return {
            id: pixelart.id,
            name: pixelart.title,
            description: pixelart.description,
            createdAt: pixelart.createdAt,
            isFavorite: pixelart.favoritedBy != "" ? JSON.parse(pixelart.favoritedBy).includes(uid) : false,
            userInfo: userInfo
        }
    })
    prisma.$disconnect()

    return { pixelArtList: pixelartList };
}) satisfies PageServerLoad;

export const actions: Actions = {
    createPixelart: async ({request, cookies}) => {
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
        const pixels = JSON.stringify(new Array(width * height).fill({color: "eeeeee", author: ""}))
        let userInfo = await _findCurrentUser(cookies.get("username") as string);
        if(!userInfo){
            throw error(500, "User not found");
        }
        const pixelart = await prisma.pixelArt.create({data: {
            title: name,
            description: desc,
            width: width,
            height: height,
            userId: userInfo.id,
            drawnPixels: pixels
        }});

        throw redirect(300, "/dashboard/" + pixelart.id);
    },
    deleteArt: async ({request, cookies}) => {
        let data = await request.formData();
        let id = data.get("id")?.toString();
        if(!id){
            return fail(400, {error: "No id sent"});
        }
        let pixelart = await prisma.pixelArt.findUnique({where: {id: id}});
        if(!pixelart){
            return fail(404, {error: "Pixelart not found"});
        }
        let userInfo = await _findCurrentUser(cookies.get("username") as string);
        if(!userInfo){
            throw error(500, "User not found");
        }
        if(pixelart.userId !== userInfo.id){
            return fail(403, {error: "You do not have access to this pixelart"});
        }
        await prisma.pixelArt.delete({where: {id: id}});
        
        let pixelarts = await prisma.pixelArt.findMany({where: {userId: userInfo.id}, orderBy: {createdAt: "desc"}});
        let pixelartList = pixelarts.map((pixelart) => {
            return {
                id: pixelart.id,
                name: pixelart.title,
                description: pixelart.description,
                createdAt: pixelart.createdAt,
                isFavorite: pixelart.favoritedBy != "" ? JSON.parse(pixelart.favoritedBy).includes(userInfo == null ? "" : userInfo.id) : false,
                userInfo: userInfo
            }
        })
        return { pixelArtList: pixelartList };
    },
    toggleFavorite: async ({ request, cookies }) => {
        let data = await request.formData();
        let id = data.get("id")?.toString();
        if(!id){
            throw error(400, "No id sent");
        }
        let userInfo = await _findCurrentUser(cookies.get("username") as string);
        if(!userInfo){
            throw error(500, "User not found");
        }
        let isFav = await IsFavorite(id, userInfo.id);
        let pixelart = await prisma.pixelArt.findUnique({where: {id: id}});
        if(!pixelart){
            throw error(404, "Pixelart not found");
        }
        let list = []
        if(pixelart.favoritedBy != ""){
            list = JSON.parse(pixelart.favoritedBy);
        }
        if(isFav){
            let index = list.indexOf(userInfo.id);
            list.splice(index, 1);
            await prisma.pixelArt.update({where: {id: id}, data: {favoritedBy: JSON.stringify(list)}});
        }
        else {
            list.push(userInfo.id);
            await prisma.pixelArt.update({where: {id: id}, data: {favoritedBy: JSON.stringify(list)}});
        }
        //Find the users pixelarts:

        let pixelarts = await prisma.pixelArt.findMany({where: {userId: userInfo.id}, orderBy: {createdAt: "desc"}});
        let pixelartList = pixelarts.map((pixelart) => {
            return {
                id: pixelart.id,
                name: pixelart.title,
                description: pixelart.description,
                createdAt: pixelart.createdAt,
                isFavorite: pixelart.favoritedBy != "" ? JSON.parse(pixelart.favoritedBy).includes(userInfo == null ? "" : userInfo.id) : false,
                userInfo: userInfo
            }
        })
        return { pixelArtList: pixelartList };
    }
};

async function IsFavorite(pixelart: string, userId: string){
    let art = await prisma.pixelArt.findUnique({where: {id: pixelart}});
    if(art){
        return art.favoritedBy != "" ? JSON.parse(art.favoritedBy).includes(userId) : false
    }
    else {
        throw error(404, "Pixelart not found");
    }
}