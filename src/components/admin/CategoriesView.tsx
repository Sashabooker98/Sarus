/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Image as ImageIcon, AlertCircle, Eye, EyeOff, Layers, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';
import { CategoryItem } from '../../types/index.ts';

export const CategoriesView: React.FC = () => {
  const { categoryItems, addCategoryItem, updateCategoryItem, deleteCategoryItem, products } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImageUrl('/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png');
    setIsVisible(true);
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setImageUrl(cat.imageUrl || '');
    setIsVisible(cat.isVisible !== false);
    setError(null);
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataUrl, filename: file.name }),
        });
        const data = await res.json();
        if (data.url) {
          setImageUrl(data.url);
        } else {
          setImageUrl(dataUrl);
        }
      } catch {
        setImageUrl(dataUrl);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Category name is required.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editingCategory) {
        const success = await updateCategoryItem(editingCategory.id, {
          name: name.trim(),
          description: description.trim(),
          imageUrl: imageUrl.trim(),
          isVisible,
        });
        if (success) {
          setNotice(`Category "${name}" updated successfully.`);
          setIsModalOpen(false);
        } else {
          setError('Failed to update category.');
        }
      } else {
        const success = await addCategoryItem({
          name: name.trim(),
          slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          description: description.trim(),
          imageUrl: imageUrl.trim() || '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png',
          isVisible,
          sortOrder: categoryItems.length + 1,
        });
        if (success) {
          setNotice(`Category "${name}" created successfully.`);
          setIsModalOpen(false);
        } else {
          setError('Category with this name already exists or server error.');
        }
      }
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    const count = products.filter((p) => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
    if (count > 0) {
      alert(
        `Cannot delete "${cat.name}": ${count} product(s) belong to this category. Please reassign or delete these products first.`
      );
      return;
    }

    if (window.confirm(`Are you sure you want to delete category "${cat.name}"? This action is permanent.`)) {
      const res = await deleteCategoryItem(cat.id);
      if (res.success) {
        setNotice(`Category "${cat.name}" deleted.`);
        setTimeout(() => setNotice(null), 4000);
      } else {
        alert(res.error || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DED6CA] pb-5">
        <div>
          <span className="text-xs uppercase tracking-widest text-[#8A7864] font-semibold">Store Management</span>
          <h2 className="font-display text-3xl font-normal text-[#1A1816]">Product Categories</h2>
          <p className="text-xs text-[#685F54] mt-1">
            Manage fabric collections displayed across the storefront. Changes persist to the database.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] text-xs font-semibold uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-sm"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      {notice && (
        <div className="p-3 bg-[#FAF8F5] border border-[#8A7864] rounded-lg text-xs text-[#1A1816] flex items-center gap-2 animate-fade-in">
          <Check size={16} className="text-[#8A7864]" />
          <span>{notice}</span>
        </div>
      )}

      {/* Category List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categoryItems.map((cat) => {
          const productCount = products.filter(
            (p) => p.category?.toLowerCase() === cat.name.toLowerCase()
          ).length;

          return (
            <div
              key={cat.id}
              className="bg-[#FFFFFF] border border-[#DED6CA] rounded-xl overflow-hidden shadow-xs hover:border-[#8A7864] transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] border border-[#DED6CA] overflow-hidden flex items-center justify-center p-1.5 shrink-0">
                    <img
                      src={cat.imageUrl || '/assets/aistudio/SARUS_Premium_Fabrics_Logo-removebg-preview_2b5db1d0.png'}
                      alt={cat.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 text-[#685F54] hover:text-[#1A1816] hover:bg-[#FAF8F5] rounded cursor-pointer transition-colors"
                      title="Edit Category"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 text-[#8A7864] hover:text-red-700 hover:bg-red-50 rounded cursor-pointer transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-display text-xl font-medium text-[#1A1816]">{cat.name}</h3>
                  <p className="text-xs text-[#685F54] mt-1 leading-relaxed line-clamp-2">
                    {cat.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-[#F0EAE1] bg-[#FAF8F5] flex items-center justify-between text-xs text-[#685F54]">
                <span className="font-mono text-[11px]">
                  <strong className="text-[#1A1816]">{productCount}</strong> products in category
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                    cat.isVisible !== false ? 'bg-emerald-50 text-emerald-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {cat.isVisible !== false ? <Eye size={11} /> : <EyeOff size={11} />}
                  <span>{cat.isVisible !== false ? 'Published' : 'Hidden'}</span>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {categoryItems.length === 0 && (
        <div className="text-center py-16 bg-[#FFFFFF] border border-[#DED6CA] rounded-xl p-8 space-y-3">
          <Layers size={36} className="mx-auto text-[#8A7864]" />
          <h3 className="font-display text-xl text-[#1A1816]">No categories found in database</h3>
          <p className="text-xs text-[#685F54]">Click "Add New Category" above to create your first collection.</p>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#1A1816]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#DED6CA] rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="border-b border-[#DED6CA] pb-3">
              <span className="text-[10px] tracking-widest text-[#8A7864] uppercase font-semibold">Database Management</span>
              <h3 className="font-display text-2xl font-normal text-[#1A1816]">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cotton, Premium Fabrics, Formal Fabrics..."
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#1A1816]"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description of this fabric category..."
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2.5 text-xs focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#685F54] mb-1">Category Image / Emblem</label>
                <div className="flex gap-2 items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="text-xs text-[#685F54] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border file:border-[#DED6CA] file:text-xs file:bg-[#FFFFFF] file:text-[#1A1816] cursor-pointer"
                  />
                </div>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="or paste image URL"
                  className="w-full bg-[#FAF8F5] border border-[#DED6CA] text-[#1A1816] rounded-lg p-2 text-xs mt-2 focus:outline-none focus:border-[#1A1816]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="cat-visible"
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="rounded border-[#DED6CA] text-[#1A1816] focus:ring-0 cursor-pointer"
                />
                <label htmlFor="cat-visible" className="text-xs text-[#1A1816] font-medium cursor-pointer">
                  Visible on Storefront
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#DED6CA]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#DED6CA] text-[#1A1816] text-xs font-medium rounded-lg hover:border-[#1A1816] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#1A1816] hover:bg-[#332E27] text-[#FAF8F5] text-xs font-semibold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingCategory ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
