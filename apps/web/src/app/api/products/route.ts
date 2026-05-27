import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";

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
    const imageFile = formData.get("image") as File | null;

    // Validación básica
    if (!title || !category || !shortDescription || !longDescription) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // Procesar imagen si existe
    let imagePath = "https://images.unsplash.com/photo-1460925895917-adf4e566c072?w=500&h=300&fit=crop";

    if (imageFile) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Crear directorio si no existe
        const uploadDir = join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        // Guardar archivo
        const filename = `${Date.now()}-${imageFile.name}`;
        const filepath = join(uploadDir, filename);
        await writeFile(filepath, buffer);

        imagePath = `/uploads/${filename}`;
      } catch (err) {
        console.error("Error procesando imagen:", err);
        // Continuar sin imagen personalizada
      }
    }

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
        username: "CurrentUser", // Esto vendría de la sesión
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
        verified: true,
      },
      featured,
      tags,
      slug: title.toLowerCase().replace(/\s+/g, "-"),
      createdAt: new Date().toISOString(),
      status: "published",
    };

    // Aquí guardarías en la base de datos
    // Por ahora lo retornamos como éxito
    console.log("Producto creado:", product);

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
