import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import path from "node:path";


const { IMAGE_BASE_URL } = process.env


export async function GET(request, { params }) {
    const { imageName } = await params
    const publicId = path.parse(imageName).name;

    try {
        const result = await cloudinary.api.resource(publicId);
        const res = await fetch(result.secure_url);

        if (!res.ok) {
            return NextResponse.json(
                { error: "No se pudo obtener la imagen" },
                { status: 500 }
            );
        }

        const buffer = await res.arrayBuffer();

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": res.headers.get("content-type") || "image/" + result.format,
                "Cache-Control": "public, max-age=86400",
            },
        });

        // return NextResponse.json(
        //     result,
        //     { status: 200 }
        // )
    } catch (error) {
        if (error.http_code === 404) {
            return NextResponse.json(
                { error: "Image not found" },
                { status: 404 }
            );
        }
        // throw error; // other error
        console.log(error.message);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}