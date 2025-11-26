"use client";

import { Product } from "@/lib/types";
import Image from "next/image";

interface ProductCardProps {
    product: Product;
    onDelete: (id: string) => void;
}

const getCurrencySymbol = (currency: string): string => {
    const symbols: { [key: string]: string } = {
        USD: "$",
        EUR: "€",
        GBP: "£",
        CAD: "CA$",
        AUD: "A$",
        JPY: "¥",
    };
    return symbols[currency] || currency;
};

export default function ProductCard({ product, onDelete }: ProductCardProps) {
    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            onDelete(product.id);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
            {/* Image */}
            <div className="relative aspect-square bg-slate-100">
                {product.image_url ? (
                    <Image
                        src={product.image_url}
                        alt={product.name || "Product image"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-slate-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}

                {/* Delete button - shows on hover */}
                <button
                    onClick={handleDelete}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                    <svg
                        className="w-4 h-4 text-slate-600 hover:text-red-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>

                {/* Category badge */}
                {product.category && (
                    <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-xs font-medium text-slate-700">
                            {product.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="mb-2">
                    <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-1">
                        {product.name || "Untitled Product"}
                    </h3>
                    {product.brand && (
                        <p className="text-xs text-slate-500">
                            {product.brand}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-4">
                        {product.price !== null ? (
                            <span
                                className={`text-lg font-semibold text-slate-900 ${
                                    product.salePrice && "line-through"
                                }`}
                            >
                                {getCurrencySymbol(product.currency)}
                                {product.price.toFixed(2)}
                            </span>
                        ) : (
                            <span className="text-sm text-slate-400">
                                Price not available
                            </span>
                        )}
                        {product.salePrice !== null && (
                            <span className="text-lg font-semibold text-red-700">
                                {getCurrencySymbol(product.currency)}
                                {product.salePrice.toFixed(2)}
                            </span>
                        )}
                    </div>
                    <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View product"
                    >
                        <svg
                            className="w-4 h-4 text-slate-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
