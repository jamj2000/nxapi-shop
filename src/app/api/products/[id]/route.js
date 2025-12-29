import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";




export async function GET(request, { params }) {
    const { id: idOrSlug } = await params;

    const product = await prisma.product.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        select: {
            id: true,
            title: true,
            price: true,
            description: true,
            slug: true,
            stock: true,
            sizes: true,
            gender: true,
            tags: true,
            images: { select: { url: true } },
            user: {
                select: {
                    id: true,
                    email: true,
                    fullName: true,
                    isActive: true,
                    roles: true,
                },
            },
        },
    });

    if (!product) {
        return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const formattedProduct = {
        ...product,
        images: product.images.map((image) => image.url),
    };
    return NextResponse.json(formattedProduct);
}




export async function PUT(request, { params }) {
    const { id } = await params;

    const body = await request.json();
    const product = await prisma.product.update({ where: { id }, data: body });

    return NextResponse.json(product);
}




export async function DELETE(request, { params }) {
    const { id } = await params;

    const product = await prisma.product.delete({ where: { id } });

    return NextResponse.json(product);
}
