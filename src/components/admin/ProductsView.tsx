/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Plus,
  Edit2,
  Archive,
  Search,
  Layers,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Trash2,
  Tag,
  Check,
  X,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { Product, Audience, Season, ProductStatus, ProductVariant } from '../../types/index.ts';
import { getEmptyProductImagePlaceholder } from '../../data/mockData.ts';

export const ProductsView: React.FC = () => {
  const { products, updateProduct, addProduct, deleteProduct, categories, addCategory, deleteCategory } = useStore();

  const [search, setSearch] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Quick Category Addition
  const [newCatInput, setNewCatInput] = useState('');
  const [categoryNotice, setCategoryNotice] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [audience, setAudience] = useState<Audience>('unisex');
  const [season, setSeason] = useState<Season>('all_season');
  const [category, setCategory] = useState<string>(categories[1] || 'Pure Cotton');
  const [price, setPrice] = useState<number | ''>('');
  const [salePrice, setSalePrice] = useState<number | ''>('');
  const [costPrice, setCostPrice] = useState<number | ''>('');
  const [fabric, setFabric] = useState('');
  const [fit, setFit] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [variantsList, setVariantsList] = useState<ProductVariant[]>([
    {
      id: 'v-1',
      sku: '',
      size: '4.0 Meters (Full Suit)',
      color: { name: 'Ecru / Natural', hex: '#F7F4EE' },
      status: 'active',
      stockOnHand: 25,
      stockReserved: 0,
      lowStockThreshold: 3,
    },
    {
      id: 'v-2',
      sku: '',
      size: '2.5 Meters (Kurta Only)',
      color: { name: 'Ecru / Natural', hex: '#F7F4EE' },
      status: 'active',
      stockOnHand: 15,
      stockReserved: 0,
      lowStockThreshold: 3,
    },
  ]);

  const handleAddNewCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatInput.trim()) return;
    const success = addCategory(newCatInput.trim());
    if (success) {
      setCategoryNotice(`Category "${newCatInput.trim()}" added successfully.`);
      setNewCatInput('');
    } else {
      setCategoryNotice(`Category "${newCatInput.trim()}" already exists.`);
    }
    setTimeout(() => setCategoryNotice(null), 3000);
  };

  const handleDeleteCategory = (catName: string) => {
    if (catName === 'All Fabrics') return;
    const count = products.filter((p) => p.category?.toLowerCase() === catName.toLowerCase()).length;
    const promptMsg = count > 0
      ? `Category "${catName}" currently has ${count} product(s). Are you sure you want to delete this category?`
      : `Are you sure you want to delete category "${catName}"?`;
    
    if (window.confirm(promptMsg)) {
      deleteCategory(catName);
      setCategoryNotice(`Category "${catName}" deleted.`);
      setTimeout(() => setCategoryNotice(null), 3000);
    }
  };

  const handleDeleteProduct = (productId: string, productName: string) => {
    if (window.confirm(`Are you sure you want to permanently delete "${productName}" from the store catalog? This action cannot be undone.`)) {
      deleteProduct(productId);
      fetch(`/api/products/${productId}`, { method: 'DELETE' }).catch(() => {});
    }
  };

  const openCreateModal = () => {
    setName('');
    setSlug('');
    setSku('');
    setDescription('');
    setAudience('unisex');
    setSeason('all_season');
    setCategory(categories[1] || 'Pure Cotton');
    setPrice('');
    setSalePrice('');
    setCostPrice('');
    setFabric('');
    setFit('');
    setImageUrl('');
    setVariantsList([
      {
        id: `v-${Date.now()}-1`,
        sku: '',
        size: '4.0 Meters (Full Suit)',
        color: { name: 'Ecru / Natural', hex: '#F7F4EE' },
        status: 'active',
        stockOnHand: 25,
        stockReserved: 0,
        lowStockThreshold: 3,
      },
      {
        id: `v-${Date.now()}-2`,
        sku: '',
        size: '2.5 Meters (Kurta Only)',
        color: { name: 'Ecru / Natural', hex: '#F7F4EE' },
        status: 'active',
        stockOnHand: 15,
        stockReserved: 0,
        lowStockThreshold: 3,
      },
    ]);
    setEditingProduct(null);
    setFormError(null);
    setIsCreating(true);
  };

  const openEditModal = (p: Product) => {
    setName(p.name);
    setSlug(p.slug);
    setSku(p.productSku);
    setDescription(p.description);
    setAudience(p.audience);
    setSeason(p.season);
    setCategory(p.category);
    setPrice(p.price || '');
    setSalePrice(p.salePrice || '');
    setCostPrice(p.costPrice || '');
    setFabric(p.fabric || '');
    setFit(p.fit || '');
    setImageUrl(p.images?.[0]?.url || '');
    setVariantsList(p.variants || []);
    setEditingProduct(p);
    setFormError(null);
    setIsCreating(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (typeof reader.result === 'string') {
          const dataUrl = reader.result;
          setImageUrl(dataUrl);
          try {
            const res = await fetch('/api/upload', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ dataUrl, filename: file.name }),
            });
            const data = await res.json();
            if (data.url) {
              setImageUrl(data.url);
            }
          } catch {
            // Keep dataUrl as fallback
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError('Product name is required.');
      return;
    }

    const parsedPrice = price === '' ? 0 : Number(price);
    const parsedSale = salePrice === '' ? undefined : Number(salePrice);
    const parsedCost = costPrice === '' ? 0 : Number(costPrice);

    if (parsedSale !== undefined && parsedSale >= parsedPrice && parsedPrice > 0) {
      setFormError('Sale price must be strictly less than original price.');
      return;
    }

    const calculatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const assignedSku = sku.trim() || `SR-${calculatedSlug.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const productImages = imageUrl.trim()
      ? [
          {
            id: `img-${Date.now()}`,
            url: imageUrl.trim(),
            alt: name.trim(),
            sortRank: 1,
          },
        ]
      : [
          {
            id: `img-placeholder-${Date.now()}`,
            url: getEmptyProductImagePlaceholder(name.trim()),
            alt: name.trim(),
            sortRank: 1,
          },
        ];

    if (editingProduct) {
      const updated: Product = {
        ...editingProduct,
        name: name.trim(),
        slug: calculatedSlug,
        productSku: assignedSku,
        description: description.trim(),
        audience,
        season,
        category,
        price: parsedPrice,
        salePrice: parsedSale,
        costPrice: parsedCost,
        fabric: fabric.trim(),
        fit: fit.trim(),
        images: productImages,
        variants: variantsList.map((v, i) => ({
          ...v,
          sku: v.sku || `${assignedSku}-${v.size.replace(/\s+/g, '')}-${i + 1}`,
        })),
        keywords: editingProduct.keywords && editingProduct.keywords.length > 0 
          ? editingProduct.keywords 
          : [
              ...name.toLowerCase().split(/[\s,()/-]+/).filter((w) => w.length > 2),
              category.toLowerCase(),
              ...fabric.toLowerCase().split(/[\s,()/-]+/).filter((w) => w.length > 2),
            ],
        updatedAt: new Date().toISOString(),
      };
      updateProduct(updated);
      fetch(`/api/products/${updated.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {});
    } else {
      const generatedKeywords = [
        ...name.toLowerCase().split(/[\s,()/-]+/).filter((w) => w.length > 2),
        category.toLowerCase(),
        ...fabric.toLowerCase().split(/[\s,()/-]+/).filter((w) => w.length > 2),
        season.toLowerCase(),
        audience.toLowerCase(),
      ];

      const newProd: Product = {
        id: `prod-${Date.now()}`,
        name: name.trim(),
        slug: calculatedSlug,
        productSku: assignedSku,
        description: description.trim(),
        audience,
        season,
        category,
        collectionIds: [],
        tags: [category.toLowerCase(), season.toLowerCase()],
        keywords: generatedKeywords,
        fabric: fabric.trim(),
        fit: fit.trim(),
        careInstructions: [
          'Pre-soak in cold water for 20 minutes before tailoring',
          'Gentle machine wash with mild detergent',
          'Press with medium iron while slightly damp',
        ],
        price: parsedPrice,
        salePrice: parsedSale,
        costPrice: parsedCost,
        status: 'active',
        images: productImages,
        variants: variantsList.map((v, i) => ({
          ...v,
          sku: v.sku || `${assignedSku}-${v.size.replace(/\s+/g, '')}-${i + 1}`,
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addProduct(newProd);
      fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProd),
      }).catch(() => {});
    }

    setIsCreating(false);
  };

  const handleToggleArchive = (p: Product) => {
    const nextStatus: ProductStatus = p.status === 'archived' ? 'active' : 'archived';
    updateProduct({ ...p, status: nextStatus });
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.productSku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-[#1A1816]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DED6CA] pb-4">
        <div>
          <span className="text-[10px] tracking-widest text-[#8A7864] uppercase font-medium">
            SARUS · Inventory & Merchandising
          </span>
          <h1 className="font-display text-3xl font-normal tracking-tight text-[#1A1816]">
            Catalog & Category Management
          </h1>
          <p className="text-xs text-[#685F54] mt-0.5">
            Add or delete clothing items, customize categories, enter prices, and upload photography.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="px-4 py-2.5 bg-[#1A1816] text-[#FAF8F5] rounded-lg text-xs font-medium uppercase tracking-wider hover:bg-[#332E27] flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
        >
          <Plus size={15} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Category Management Bar */}
      <div className="p-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EFE8DC] pb-2.5">
          <div className="flex items-center gap-2">
            <Tag size={16} className="text-[#8A7864]" />
            <h3 className="font-semibold text-xs uppercase tracking-wider text-[#1A1816]">
              Store Categories ({categories.length})
            </h3>
          </div>
          <span className="text-[11px] text-[#8A7864]">
            Categories are live in Header navigation & Storefront filters
          </span>
        </div>

        {categoryNotice && (
          <div className="p-2.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-lg text-xs font-medium text-[#1A1816] flex items-center gap-2 animate-fade-in">
            <Check size={14} className="text-[#8A7864]" />
            <span>{categoryNotice}</span>
          </div>
        )}

        {/* Existing Categories as interactive pills with delete button */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = products.filter((p) => p.category?.toLowerCase() === cat.toLowerCase()).length;
            const isAll = cat === 'All Fabrics';

            return (
              <div
                key={cat}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF8F5] border border-[#DED6CA] rounded-full text-xs text-[#1A1816] font-medium shadow-2xs"
              >
                <span>{cat}</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-[#EFE8DC] text-[#685F54] rounded-full tabular-nums">
                  {count}
                </span>
                {!isAll && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat)}
                    className="p-0.5 text-[#8A7864] hover:text-red-600 hover:bg-red-50 rounded-full cursor-pointer transition-colors"
                    title={`Delete category "${cat}"`}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Add Category Form */}
        <form onSubmit={handleAddNewCategory} className="flex gap-2 pt-1 max-w-md">
          <input
            type="text"
            value={newCatInput}
            onChange={(e) => setNewCatInput(e.target.value)}
            placeholder="New Category Name (e.g. Luxury Velvet, Festive Shawls)..."
            className="flex-1 bg-[#FAF8F5] border border-[#DED6CA] rounded-lg px-3 py-1.5 text-xs text-[#1A1816] placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
          />
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-[#1A1816] text-[#FAF8F5] text-xs font-medium rounded-lg hover:bg-[#332E27] cursor-pointer flex items-center gap-1 shadow-2xs transition-all shrink-0"
          >
            <Plus size={13} />
            <span>Add Category</span>
          </button>
        </form>
      </div>

      {/* Search Bar */}
      <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#DED6CA] flex items-center gap-2 shadow-xs">
        <Search size={16} className="text-[#8A7864]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter catalog by product title, SKU code, or fabric category..."
          className="w-full text-xs bg-transparent border-none outline-none focus:ring-0 text-[#1A1816] placeholder-[#A09586]"
        />
      </div>

      {/* Products Table or Empty State */}
      {products.length === 0 ? (
        <div className="py-20 px-4 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl text-center max-w-xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] flex items-center justify-center mx-auto mb-4">
            <Layers size={28} />
          </div>
          <h3 className="font-display text-2xl font-normal text-[#1A1816]">
            No Products in Catalog
          </h3>
          <p className="text-xs text-[#685F54] max-w-sm mx-auto mt-2 leading-relaxed">
            Your catalog is currently empty. Add original clothing items with custom yardages, prices, and photography.
          </p>
          <button
            onClick={openCreateModal}
            className="mt-6 px-5 py-2.5 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg cursor-pointer shadow-sm inline-flex items-center gap-2"
          >
            <Plus size={14} />
            <span>Create Your First Product</span>
          </button>
        </div>
      ) : (
        <div className="bg-[#FFFFFF] rounded-xl border border-[#DED6CA] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums text-[#1A1816]">
              <thead className="bg-[#FAF8F5] uppercase text-[10px] text-[#8A7864] tracking-wider border-b border-[#DED6CA]">
                <tr>
                  <th className="p-3.5">Product Title & Weave</th>
                  <th className="p-3.5">SKU</th>
                  <th className="p-3.5">Audience & Season</th>
                  <th className="p-3.5">Selling Price</th>
                  <th className="p-3.5">Cost Price</th>
                  <th className="p-3.5">Stock</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8DC]">
                {filteredProducts.map((p) => {
                  const totalAvail = p.variants?.reduce((s, v) => s + Math.max(0, v.stockOnHand - v.stockReserved), 0) ?? 0;
                  const img = p.images?.[0]?.url || getEmptyProductImagePlaceholder(p.name);
                  return (
                    <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="p-3.5 font-medium text-[#1A1816]">
                        <div className="flex items-center gap-3">
                          <img
                            src={img}
                            alt=""
                            className="w-10 h-12 object-cover rounded-md bg-[#FAF8F5] border border-[#DED6CA] shrink-0"
                          />
                          <div>
                            <p className="font-semibold text-[#1A1816] text-xs">{p.name}</p>
                            <span className="text-[10px] text-[#8A7864] uppercase font-medium">{p.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 font-mono text-[11px] text-[#685F54]">{p.productSku}</td>
                      <td className="p-3.5 uppercase text-[11px] text-[#685F54]">
                        {p.audience} · {p.season.replace('_', ' ')}
                      </td>
                      <td className="p-3.5 font-semibold text-[#1A1816]">
                        {p.price > 0 ? (
                          p.salePrice ? (
                            <div>
                              <span className="text-[#1A1816]">Rs {p.salePrice.toLocaleString()}</span>
                              <span className="text-[#8A7864] line-through block text-[10px]">
                                Rs {p.price.toLocaleString()}
                              </span>
                            </div>
                          ) : (
                            <span>Rs {p.price.toLocaleString()}</span>
                          )
                        ) : (
                          <span className="text-[#8A7864] text-[10px]">Price Pending</span>
                        )}
                      </td>
                      <td className="p-3.5 text-[#685F54] font-mono">
                        {p.costPrice ? `Rs ${p.costPrice.toLocaleString()}` : '—'}
                      </td>
                      <td className="p-3.5">
                        <span className={`font-semibold ${totalAvail <= 5 ? 'text-amber-700' : 'text-[#1A1816]'}`}>
                          {totalAvail} units
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full ${
                            p.status === 'active'
                              ? 'bg-[#EFE8DC] text-[#1A1816] border border-[#DED6CA]'
                              : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 hover:bg-[#EFE8DC] text-[#685F54] hover:text-[#1A1816] rounded-md cursor-pointer transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => handleToggleArchive(p)}
                            className="p-1.5 hover:bg-[#EFE8DC] text-[#685F54] hover:text-[#1A1816] rounded-md cursor-pointer transition-colors"
                            title={p.status === 'archived' ? 'Unarchive' : 'Archive'}
                          >
                            <Archive size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 hover:bg-red-50 text-[#8A7864] hover:text-red-700 rounded-md cursor-pointer transition-colors"
                            title="Permanently Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Creation / Edit Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-[#1A1816]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <form
            onSubmit={handleSaveProduct}
            className="bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-xl max-w-2xl w-full p-6 space-y-4 shadow-2xl my-auto max-h-[92vh] overflow-y-auto"
          >
            <div className="border-b border-[#DED6CA] pb-3 flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-widest uppercase text-[#8A7864] font-medium">SARUS Catalog Editor</span>
                <h3 className="font-display text-2xl font-normal text-[#1A1816]">
                  {editingProduct ? 'Edit Clothing Product' : 'Add New Clothing Product'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-[#8A7864] hover:text-[#1A1816] hover:bg-[#EFE8DC] p-1.5 rounded-full cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
                <AlertCircle size={15} className="text-red-600 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Royal Egyptian Giza Cotton Suit..."
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">SKU Code</label>
                <input
                  type="text"
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. SR-GIZA-01"
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs font-mono placeholder-[#A09586] uppercase focus:outline-none focus:border-[#1A1816]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs cursor-pointer focus:outline-none focus:border-[#1A1816]"
                >
                  {categories.filter((c) => c !== 'All Fabrics').map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Audience</label>
                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value as Audience)}
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs cursor-pointer focus:outline-none focus:border-[#1A1816]"
                >
                  <option value="unisex">Unisex</option>
                  <option value="men">Men's Fabric</option>
                  <option value="women">Women's Fabric</option>
                  <option value="kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Season</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value as Season)}
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs cursor-pointer focus:outline-none focus:border-[#1A1816]"
                >
                  <option value="all_season">All-Season Weave</option>
                  <option value="winter">Winter Collection</option>
                  <option value="summer">Summer Collection</option>
                </select>
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-3">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#8A7864] block">
                Pricing Structure (PKR)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-[#685F54] font-medium mb-1">Selling Price (Rs) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 4950"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs font-mono placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#685F54] font-medium mb-1">Sale / Promotional Price (Optional)</label>
                  <input
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 4450"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs font-mono placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#685F54] font-medium mb-1">Internal Cost Price</label>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g. 2800"
                    className="w-full bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs font-mono placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Functionality */}
            <div className="p-3.5 bg-[#FAF8F5] border border-[#DED6CA] rounded-xl space-y-2">
              <span className="font-semibold text-xs uppercase tracking-wider text-[#8A7864] block flex items-center gap-1.5">
                <ImageIcon size={14} />
                <span>Product Photography & Image</span>
              </span>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileUpload}
                  className="text-xs text-[#685F54] file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border file:border-[#DED6CA] file:text-xs file:font-medium file:bg-[#FFFFFF] file:text-[#1A1816] hover:file:bg-[#EFE8DC] cursor-pointer"
                />
                <span className="text-xs text-[#8A7864]">OR paste URL:</span>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or data:image/..."
                  className="flex-1 bg-[#FFFFFF] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              {imageUrl && (
                <div className="mt-2 flex items-center gap-3 p-2 bg-[#FFFFFF] border border-[#DED6CA] rounded-lg">
                  <img src={imageUrl} alt="Preview" className="w-12 h-14 object-cover rounded-md" />
                  <span className="text-xs text-[#685F54] truncate">Image configured successfully</span>
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="ml-auto text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Description & Specs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Description & Texture Notes</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the fabric weave, softness, fall, occasion..."
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#685F54] mb-1">Fabric Composition</label>
                  <input
                    type="text"
                    value={fabric}
                    onChange={(e) => setFabric(e.target.value)}
                    placeholder="e.g. 100% Egyptian Giza Cotton (120/2 yarn)"
                    className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#685F54] mb-1">Standard Cut / Arz</label>
                  <input
                    type="text"
                    value={fit}
                    onChange={(e) => setFit(e.target.value)}
                    placeholder="e.g. 4.0 Meters Double-Width (54&quot; Arz)"
                    className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs placeholder-[#A09586] focus:outline-none focus:border-[#1A1816]"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-3 pt-3 border-t border-[#DED6CA]">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-[#DED6CA] text-[#1A1816] text-xs font-medium uppercase rounded-lg hover:border-[#1A1816] cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] text-xs font-medium uppercase tracking-wider rounded-lg shadow-sm cursor-pointer transition-all"
              >
                {editingProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
