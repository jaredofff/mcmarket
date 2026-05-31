"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getCategoryProducts, type CategoryProduct } from "@/lib/categoryProducts";

export default function ProductPage() {
  const params = useParams<{ category: string; productId: string }>();
  const categoryName = params.category.charAt(0).toUpperCase() + params.category.slice(1);
  const allProducts = getCategoryProducts(categoryName);
  const product = allProducts.find((p) => p.id === params.productId);

  const [quantity, setQuantity] = useState(1);
  const [inWishlist, setInWishlist] = useState(false);

  if (!product) {
    return (
      <div className="w-full max-w-7xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center">
        <div className="text-5xl mb-4">❌</div>
        <h1 className="font-outfit text-2xl font-black text-[#e8e4db] mb-2">Producto no encontrado</h1>
        <p className="text-[#8c8278] mb-8">El producto que buscas no existe o fue eliminado.</p>
        <Link
          href={`/${categoryName.toLowerCase()}`}
          className="px-6 py-3 rounded-sm bg-amber-500 text-[#141311] font-bold hover:bg-amber-400 transition-colors"
        >
          Volver a {categoryName}
        </Link>
      </div>
    );
  }

  const relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 3);
  const totalPrice = product.price * quantity;

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="border-b border-[#2d2a26] sticky top-16 bg-[#141311]/95 backdrop-blur-sm z-40">
        <div className="max-w-7xl mx-auto px-6 h-12 flex items-center gap-2 text-sm">
          <Link href="/" className="text-[#6b6459] hover:text-amber-400 transition-colors">
            Inicio
          </Link>
          <span className="text-[#4a4540]">/</span>
          <Link href={`/${categoryName.toLowerCase()}`} className="text-[#6b6459] hover:text-amber-400 transition-colors">
            {categoryName}
          </Link>
          <span className="text-[#4a4540]">/</span>
          <span className="text-amber-400 font-bold truncate">{product.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Image Gallery */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full overflow-hidden bg-[#1c1a17] rounded-sm border border-[#2d2a26]">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {product.featured && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-amber-500 text-[#141311] text-xs font-black rounded-sm uppercase tracking-wider">
                  Destacado
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col gap-6">
            {/* Title & Rating */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-amber-500 mb-2">{categoryName}</p>
              <h1 className="font-outfit text-4xl font-black text-[#e8e4db] mb-3">{product.title}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-xl">★</span>
                  <span className="font-bold text-[#e8e4db]">{product.rating.toFixed(1)}</span>
                  <span className="text-[#6b6459] text-sm">({product.reviewCount} reseñas)</span>
                </div>
                <span className="text-[#6b6459] text-sm">•</span>
                <span className="text-[#6b6459] text-sm">{product.sales} ventas</span>
              </div>
            </div>

            {/* Creator */}
            <div className="p-4 bg-[#1c1a17] rounded-sm border border-[#2d2a26]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center">
                  <span className="text-sm font-black text-[#141311]">{product.creator.username[0]}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#e8e4db]">
                    {product.creator.username}
                    {product.creator.verified && (
                      <span className="ml-1 text-amber-400">✓</span>
                    )}
                  </p>
                  <p className="text-xs text-[#6b6459]">Creador verificado</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#a39c90] mb-2">Descripción</h2>
              <p className="text-[#a39c90] leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Features */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest text-[#a39c90] mb-3">Características</h2>
              <ul className="grid grid-cols-2 gap-2">
                {(product.features || []).map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-[#a39c90]">
                    <span className="text-amber-400 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Divider */}
            <div className="border-t border-[#2d2a26]" />

            {/* Price & Purchase */}
            <div>
              <p className="text-[#6b6459] text-sm mb-3">Precio unitario</p>
              <div className="flex items-center gap-4 mb-6">
                <span className="font-outfit text-5xl font-black text-amber-400">
                  ${product.price.toFixed(2)}
                </span>
                <div className="text-right">
                  <p className="text-xs text-[#6b6459]">Total</p>
                  <p className="text-2xl font-black text-[#e8e4db]">${totalPrice.toFixed(2)}</p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-[#2d2a26] rounded-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-[#a39c90] hover:bg-[#1c1a17] transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 h-10 text-center font-bold text-[#e8e4db] bg-transparent border-l border-r border-[#2d2a26] focus:outline-none"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-[#a39c90] hover:bg-[#1c1a17] transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 h-12 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-[#141311] font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
                  Comprar Ahora
                </button>
                <button
                  onClick={() => setInWishlist(!inWishlist)}
                  className={`w-12 h-12 rounded-sm flex items-center justify-center transition-all ${
                    inWishlist
                      ? "bg-pink-500/20 border-pink-500/40 border text-pink-400"
                      : "bg-[#1c1a17] border border-[#2d2a26] text-[#6b6459] hover:text-amber-400"
                  }`}
                >
                  {inWishlist ? "♥" : "♡"}
                </button>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#2d2a26]">
              <div className="text-center p-3 bg-[#1c1a17] rounded-sm">
                <p className="text-xs text-[#6b6459] mb-1">Descargas</p>
                <p className="font-black text-amber-400">{product.downloads}</p>
              </div>
              <div className="text-center p-3 bg-[#1c1a17] rounded-sm">
                <p className="text-xs text-[#6b6459] mb-1">Versión</p>
                <p className="font-bold text-[#e8e4db] text-sm">{product.version}</p>
              </div>
              <div className="text-center p-3 bg-[#1c1a17] rounded-sm">
                <p className="text-xs text-[#6b6459] mb-1">Actualizado</p>
                <p className="font-bold text-[#e8e4db] text-sm">Ayer</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="py-8 border-t border-[#2d2a26]">
          <h2 className="text-sm font-bold uppercase tracking-widest text-[#a39c90] mb-3">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {(product.tags || []).map((tag, idx) => (
              <Link
                key={idx}
                href={`/${categoryName.toLowerCase()}?search=${tag}`}
                className="px-3 py-1.5 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-xs font-bold text-amber-400 hover:border-amber-500/40 transition-all"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="py-12 border-t border-[#2d2a26]">
            <h2 className="text-2xl font-black text-[#e8e4db] mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/${categoryName.toLowerCase()}/${p.id}`}
                  className="p-5 bg-[#1c1a17] border border-[#2d2a26] rounded-sm hover:border-amber-500/40 transition-all flex flex-col group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-[#141311] rounded-sm mb-4">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity"
                    />
                  </div>
                  <h3 className="font-bold text-[#e8e4db] mb-2 group-hover:text-amber-300 transition-colors">
                    {p.title}
                  </h3>
                  <p className="text-sm text-[#a39c90] mb-4 flex-1">{p.shortDescription}</p>
                  <div className="flex justify-between items-center pt-4 border-t border-[#2d2a26]">
                    <span className="font-black text-amber-400">${p.price.toFixed(2)}</span>
                    <span className="text-xs text-[#6b6459]">★ {p.rating.toFixed(1)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
