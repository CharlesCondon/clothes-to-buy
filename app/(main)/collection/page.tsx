"use client";

import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import FilterSortBar from "@/components/FilterBar";
import AddProductModal from "@/components/AddProductForm";
import { CategoryFilter, Product, SortOption } from "@/lib/types";
import EditProductModal from "@/components/EditProductForm";
import { convertToUSD } from "@/lib/currencyUtils";

export default function HomePage() {
    const {
        products,
        loading,
        deleteProduct,
        addProduct,
        updateProduct,
        user,
    } = useProducts();
    const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
    const [sortOption, setSortOption] = useState<SortOption>("newest");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
    };

    // Filter and sort products
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = [...products];

        // Apply category filter
        if (categoryFilter !== "all") {
            filtered = filtered.filter((p) => p.category === categoryFilter);
        }

        // Helper function to get effective price (sale price takes precedence)
        const getEffectivePriceInUSD = (product: Product): number => {
            const effectivePrice = product.salePrice ?? product.price ?? 0;
            return convertToUSD(effectivePrice, product.currency);
        };

        // Apply sorting
        switch (sortOption) {
            case "newest":
                filtered.sort(
                    (a, b) =>
                        new Date(b.created_at).getTime() -
                        new Date(a.created_at).getTime()
                );
                break;
            case "oldest":
                filtered.sort(
                    (a, b) =>
                        new Date(a.created_at).getTime() -
                        new Date(b.created_at).getTime()
                );
                break;
            case "a-z":
                filtered.sort((a, b) =>
                    (a.name || "").localeCompare(b.name || "")
                );
                break;
            case "z-a":
                filtered.sort((a, b) =>
                    (b.name || "").localeCompare(a.name || "")
                );
                break;
            case "price-low":
                filtered.sort(
                    (a, b) =>
                        getEffectivePriceInUSD(a) - getEffectivePriceInUSD(b)
                );
                break;
            case "price-high":
                filtered.sort(
                    (a, b) =>
                        getEffectivePriceInUSD(b) - getEffectivePriceInUSD(a)
                );
                break;
        }

        return filtered;
    }, [products, categoryFilter, sortOption]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading your collection...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-light text-slate-800 mb-2">
                    My Collection
                </h1>
                <p className="text-slate-600">
                    {!user && (
                        <span className="inline-flex items-center gap-1 text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            Guest mode - Your products will not be saved after
                            this session
                        </span>
                    )}
                </p>
            </div>

            {/* Add Product Button */}
            <div className="mb-6">
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
                >
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                        />
                    </svg>
                    Add Product
                </button>
            </div>

            {products.length === 0 ? (
                // Empty state
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-12 h-12 text-slate-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                            />
                        </svg>
                    </div>
                    <h2 className="text-xl font-light text-slate-800 mb-2">
                        Your wardrobe is empty
                    </h2>
                    <p className="text-slate-600 mb-6">
                        Start adding products to build your collection
                    </p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4v16m8-8H4"
                            />
                        </svg>
                        Add Your First Product
                    </button>
                </div>
            ) : (
                <>
                    {/* Filter and Sort Bar */}
                    <div className="mb-6">
                        <FilterSortBar
                            categoryFilter={categoryFilter}
                            onCategoryChange={setCategoryFilter}
                            sortOption={sortOption}
                            onSortChange={setSortOption}
                            productCount={filteredAndSortedProducts.length}
                        />
                    </div>

                    {/* Products Grid */}
                    {filteredAndSortedProducts.length === 0 ? (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                            <p className="text-slate-600">
                                No products found with the current filters
                            </p>
                            <button
                                onClick={() => setCategoryFilter("all")}
                                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Clear filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredAndSortedProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={deleteProduct}
                                    onEdit={handleEdit}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Add Product Modal */}
            <AddProductModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={addProduct}
            />

            {/* Edit Product Modal */}
            <EditProductModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                onUpdate={updateProduct}
                product={editingProduct}
            />
        </div>
    );
}
