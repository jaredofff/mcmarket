"use client";

import { useState } from "react";
import Link from "next/link";

interface ProductFormData {
  title: string;
  category: "Setups" | "Configs" | "Builds" | "Webs";
  price: number;
  isFree: boolean;
  shortDescription: string;
  longDescription: string;
  features: string[];
  version: string;
  tags: string[];
  image?: File;
  featured: boolean;
}

const CATEGORIES = ["Setups", "Configs", "Builds", "Webs"] as const;

export default function ProductFormPage() {
  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    category: "Setups",
    price: 0,
    isFree: false,
    shortDescription: "",
    longDescription: "",
    features: ["", "", "", "", "", ""],
    version: "1.20+",
    tags: ["", "", ""],
    featured: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validación básica
      if (!formData.title.trim()) {
        throw new Error("El título es requerido");
      }
      if (!formData.shortDescription.trim()) {
        throw new Error("La descripción corta es requerida");
      }
      if (!formData.longDescription.trim()) {
        throw new Error("La descripción larga es requerida");
      }
      if (!formData.isFree && formData.price <= 0) {
        throw new Error("El precio debe ser mayor a 0");
      }

      const form = new FormData();
      form.append("title", formData.title);
      form.append("category", formData.category);
      form.append("price", formData.price.toString());
      form.append("isFree", formData.isFree.toString());
      form.append("shortDescription", formData.shortDescription);
      form.append("longDescription", formData.longDescription);
      form.append("features", JSON.stringify(formData.features.filter((f) => f.trim())));
      form.append("version", formData.version);
      form.append("tags", JSON.stringify(formData.tags.filter((t) => t.trim())));
      form.append("featured", formData.featured.toString());

      if (formData.image) {
        form.append("image", formData.image);
      }

      const response = await fetch("/api/products", {
        method: "POST",
        body: form,
      });

      if (!response.ok) {
        throw new Error("Error al guardar el producto");
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/creator/dashboard";
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#141311] pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <Link href="/creator/dashboard" className="text-sm font-bold text-amber-400 hover:text-amber-300 mb-4 inline-block">
            ← Volver al Dashboard
          </Link>
          <h1 className="font-outfit text-4xl font-black text-[#e8e4db] mb-2">Crear Nuevo Producto</h1>
          <p className="text-[#8c8278]">Rellena todos los campos para publicar tu producto</p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-sm text-red-400 text-sm font-bold">
            ❌ {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-sm text-emerald-400 text-sm font-bold">
            ✅ Producto creado exitosamente. Redirigiendo...
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <h2 className="font-outfit text-xl font-black text-[#e8e4db] mb-6">Información Básica</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-bold text-[#a39c90] mb-2">Título *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Ej: Premium Survival Setup"
                  className="w-full h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-[#a39c90] mb-2">Categoría *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label className="flex items-center gap-2 text-sm font-bold text-[#a39c90] mb-2">
                  <input
                    type="checkbox"
                    name="isFree"
                    checked={formData.isFree}
                    onChange={handleInputChange}
                  />
                  ¿Gratis?
                </label>
                {!formData.isFree && (
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="9.99"
                    step="0.01"
                    min="0"
                    className="w-full h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
                  />
                )}
              </div>

              {/* Version */}
              <div>
                <label className="block text-sm font-bold text-[#a39c90] mb-2">Versión Mínima</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleInputChange}
                  placeholder="1.20+"
                  className="w-full h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <h2 className="font-outfit text-xl font-black text-[#e8e4db] mb-6">Descripción</h2>

            <div className="space-y-4">
              {/* Short Description */}
              <div>
                <label className="block text-sm font-bold text-[#a39c90] mb-2">Descripción Corta (80 caracteres) *</label>
                <textarea
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleInputChange}
                  placeholder="Breve resumen del producto..."
                  maxLength={80}
                  className="w-full h-12 px-4 py-2 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none resize-none"
                  required
                />
                <p className="text-xs text-[#6b6459] mt-1">{formData.shortDescription.length}/80</p>
              </div>

              {/* Long Description */}
              <div>
                <label className="block text-sm font-bold text-[#a39c90] mb-2">Descripción Completa *</label>
                <textarea
                  name="longDescription"
                  value={formData.longDescription}
                  onChange={handleInputChange}
                  placeholder="Descripción detallada del producto. Puede incluir características, instrucciones, etc..."
                  className="w-full h-32 px-4 py-2 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <h2 className="font-outfit text-xl font-black text-[#e8e4db] mb-6">Características (hasta 6)</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.features.map((feature, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(idx, e.target.value)}
                  placeholder={`Característica ${idx + 1}`}
                  className="h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none text-sm"
                />
              ))}
            </div>
          </section>

          {/* Tags */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <h2 className="font-outfit text-xl font-black text-[#e8e4db] mb-6">Tags (hasta 3)</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formData.tags.map((tag, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={tag}
                  onChange={(e) => handleTagChange(idx, e.target.value)}
                  placeholder={`Tag ${idx + 1}`}
                  className="h-10 px-4 rounded-sm bg-[#141311] border border-[#2d2a26] text-[#e8e4db] focus:border-amber-500/50 focus:outline-none text-sm"
                />
              ))}
            </div>
          </section>

          {/* Image Upload */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <h2 className="font-outfit text-xl font-black text-[#e8e4db] mb-6">Imagen del Producto</h2>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#2d2a26] rounded-sm p-8 text-center cursor-pointer hover:border-amber-500/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-input"
                />
                <label htmlFor="image-input" className="cursor-pointer">
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-4">
                      <img src={imagePreview} alt="Preview" className="h-40 rounded-sm" />
                      <p className="text-sm text-amber-400">Cambiar imagen</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-4xl">📸</div>
                      <p className="text-[#e8e4db] font-bold">Arrastra o haz clic para subir</p>
                      <p className="text-sm text-[#6b6459]">PNG, JPG (max 5MB)</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </section>

          {/* Featured */}
          <section className="p-6 bg-[#1c1a17] border border-[#2d2a26] rounded-sm">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                className="w-5 h-5 cursor-pointer"
              />
              <span className="text-[#e8e4db] font-bold">Marcar como Destacado</span>
            </label>
            <p className="text-sm text-[#6b6459] mt-2">Los productos destacados aparecen en primer lugar</p>
          </section>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 h-12 rounded-sm bg-gradient-to-r from-amber-500 to-yellow-600 text-[#141311] font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Guardando..." : "Guardar Producto"}
            </button>
            <Link
              href="/creator/dashboard"
              className="px-6 h-12 rounded-sm bg-[#1c1a17] border border-[#2d2a26] text-[#a39c90] hover:text-amber-400 font-bold flex items-center justify-center transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
