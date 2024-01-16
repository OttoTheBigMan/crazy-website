import { PrismaClient } from '@prisma/client';
import type { PageServerLoad } from './$types';
import { error, redirect, type Actions } from '@sveltejs/kit';

const prisma = new PrismaClient();

export let _pixelartId = ""

export const load = async ({ params, cookies }) => {
    _pixelartId = params.pixelart;
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
    let pixelartPrisma = await prisma.pixelArt.findUnique({where: {id: _pixelartId}});
    if(!pixelartPrisma){
        throw error(404, "Pixelart not found")
    }
    if(pixelartPrisma.userId !== prismaToken.user.id){
        throw error(403, "You do not have access to this pixelart")
    }
    //TODO: Check if user has access to pixelart
    //Load the pixelart
    let info = {
        name: pixelartPrisma.title,
        id: pixelartPrisma.id,
        description: pixelartPrisma.description,
        createdAt: pixelartPrisma.createdAt,
        width: pixelartPrisma.width,
        height: pixelartPrisma.height,
        pixels: pixelartPrisma.drawnPixels,
    }

    return { id: _pixelartId, name: info.name, description: info.description, createdAt: info.createdAt, width: info.width, height: info.height, pixels: info.pixels, user: prismaToken.user.name };
};

export const actions: Actions = {
    edit: async ({ request }) => {
        let data = await request.formData();
        // let newPixels = data.get("pixels")?.toString() ?? "";
        // if(newPixels == ""){
        //     throw error(400, "No pixels sent");
        // }
        // await prisma.pixelArt.update({where: {id: pixelartId}, data: {drawnPixels: newPixels.toString()}});
        // return { pixels: newPixels };

        let balls = data.get("index")?.toString();
        let color = data.get("color")?.toString();
        if(!balls || !color){
            throw error(400, "What the heeeeelll");
        }
        let index = parseInt(balls);
        if(isNaN(index)){
            throw error(400, "Index is not a number");
        }
        let oldPixels = await prisma.pixelArt.findUnique({where: {id: _pixelartId}, select: {drawnPixels: true}});
        if(!oldPixels){
            throw error(404, "Pixelart not found");
        }
        let pixels = oldPixels.drawnPixels;
        pixels[index] = color;
        await prisma.pixelArt.update({where: {id: _pixelartId}, data: 
            {
                drawnPixels: pixels
            }
        });
        return { pixels: pixels };
    }
};

