"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface CreatorProduct {
  id: string;
  title: string;
  category: string;
  price: number;
  rating: number;
  sales: number;
  downloads: number;
  createdAt: string;
  status: "draft" | "published" | "archived";
}

export default function CreatorDashboard() {
  const [products, setProducts] = useState<CreatorProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"published" | "draft" | "archived">("published");

  useEffect(() => {
    // Simular carga de productos
    setTimeout(() => {
      setProducts([
        {
          id: "prod-1",
          title: "Survival Server Pro Setup",
          category: "Setups",
          price: 24.99,
          rating: 4.9,
          sales: 856,
          downloads: 2400,
          createdAt: "2024-01-15",
          status: "published",
        },
        {
          id: "prod-2",
          title: "RPG World Complete",
          category: "Setups",
          price: 34.99,
          rating: 4.7,
          sales: 645,
          downloads: 1890,
          createdAt: "2024-01-10",
          status: "published",
        },
        {
          id: "prod-3",
          title: "Mi Nuevo Proyecto",
          category: "Configs",
          price: 12.99,
          rating: 0,
          sales: 0,
          downloads: 0,
          createdAt: "2024-02-01",
          status: "draft",
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  const filteredProducts = products.filter((p) => p.status === activeTab);

  const stats = {
    totalSales: products.reduce((sum, p) => sum + p.sales, 0),
    totalDownloads: products.reduce((sum, p) => sum + p.downloads, 0),
    avgRating: (products.reduce((sum, p) => sum + p.rating, 0) / products.filter((p) => p.rating > 0).length || 0).toFixed(1),
    activeProducts: products.filter((p) => p.status === "published").length,
  };

  return (
    <div className="min-h-screen bg-[#141311] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-outfit text-4xl font-black text-[#e8e4db] mb-2">Panel del Creador</h1>
            <p className="text-[#8c8278]">Gestiona tus productos y monitorea tu desempeño</p>
          </div>
          <Link
            href="/creator/products/new"
            className="px-6 py-3 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-[#141311] font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
          >
            + Nuevo Producto
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">Ventas Totales</p>
            <p className="font-outfit text-3xl font-black text-amber-400">{stats.totalSales}</p>
          </div>
          <div className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">Descargas</p>
            <p className="font-outfit text-3xl font-black text-amber-400">{stats.totalDownloads}</p>
          </div>
          <div className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">Calificación Promedio</p>
            <p className="font-outfit text-3xl font-black text-amber-400">{stats.avgRating}★</p>
          </div>
          <div className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#6b6459] mb-2">Productos Activos</p>
            <p className="font-outfit text-3xl font-black text-amber-400">{stats.activeProducts}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8 border-b border-[#2d2a26]">
          <div className="flex gap-8">
            {(["published", "draft", "archived"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-bold uppercase tracking-wider text-sm transition-colors ${
                  activeTab === tab
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-[#6b6459] hover:text-[#a39c90]"
                }`}
              >
                {tab === "published" && "Publicados"}
                {tab === "draft" && "Borradores"}
                {tab === "archived" && "Archivados"}
              </button>
            ))}
          </div>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#6b6459]">Cargando...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b6459] mb-4">No hay productos en esta categoría</p>
            <Link
              href="/creator/products/new"
              className="text-amber-400 hover:text-amber-300 font-bold"
            >
              Crear uno ahora →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2d2a26]">
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Producto</th>
                  <th className="text-left py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Categoría</th>
                  <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Precio</th>
                  <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Calificación</th>
                  <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Ventas</th>
                  <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Descargas</th>
                  <th className="text-right py-4 px-4 text-xs font-bold uppercase tracking-widest text-[#6b6459]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-[#2d2a26] hover:bg-[#1c1a17] transition-colors">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-bold text-[#e8e4db]">{product.title}</p>
                        <p className="text-xs text-[#6b6459]">{product.createdAt}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-[#a39c90]">{product.category}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="font-black text-amber-400">${product.price.toFixed(2)}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      {product.rating > 0 ? (
                        <span className="text-sm text-amber-400">★ {product.rating.toFixed(1)}</span>
                      ) : (
                        <span className="text-xs text-[#6b6459]">Sin reseñas</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-[#e8e4db]">{product.sales}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="text-sm text-[#e8e4db]">{product.downloads}</span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="px-3 py-1.5 text-xs font-bold bg-[#1c1a17] border border-[#2d2a26] rounded-sm text-[#a39c90] hover:text-amber-400 transition-colors">
                          Editar
                        </button>
                        <button className="px-3 py-1.5 text-xs font-bold bg-[#1c1a17] border border-[#2d2a26] rounded-sm text-[#a39c90] hover:text-amber-400 transition-colors">
                          Ver
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
