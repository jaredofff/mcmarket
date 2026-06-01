import { NextRequest, NextResponse } from "next/server";

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    // Extraer datos del formulario
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const price = parseFloat(formData.get("price") as string);
    const isFree = formData.get("isFree") === "true";
    const shortDescription = formData.get("shortDescription") as string;
    const longDescription = formData.get("longDescription") as string;
    const featuresStr = formData.get("features") as string;
    const tagsStr = formData.get("tags") as string;
    const version = formData.get("version") as string;
    const featured = formData.get("featured") === "true";

    // Validación básica
    if (!title || !category || !shortDescription || !longDescription) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Usar imagen por defecto (Edge Runtime no soporta escritura de archivos)
    const imagePath = "https://images.unsplash.com/photo-1460925895917-adf4e566c072?w=500&h=300&fit=crop";

    // Parsear features y tags
    const features = JSON.parse(featuresStr || "[]");
    const tags = JSON.parse(tagsStr || "[]");

    // Crear objeto del producto
    const product = {
      id: `prod-${Date.now()}`,
      title,
      category,
      price: isFree ? 0 : price,
      isFree,
      rating: 0,
      reviewCount: 0,
      sales: 0,
      downloads: 0,
      image: imagePath,
      shortDescription,
      longDescription,
      features,
      version,
      creator: {
        username: "CurrentUser",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        verified: true,
      },
      featured,
      tags,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date().toISOString(),
      status: "published",
    };

    // Retornar producto (guardar en BD debería hacerse en otro lugar)
    return NextResponse.json(
      {
        success: true,
        message: "Producto creado exitosamente",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en POST /api/products:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
