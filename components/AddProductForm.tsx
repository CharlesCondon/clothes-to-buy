"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import Image from "next/image";

interface AddProductFormProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (
        product: Omit<Product, "id" | "created_at" | "updated_at">
    ) => Promise<void>;
}

export default function AddProductForm({
    isOpen,
    onClose,
    onAdd,
}: AddProductFormProps) {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [scraping, setScraping] = useState(false);
    const [scrapedData, setScrapedData] = useState<Partial<Product> | null>(
        null
    );
    const [error, setError] = useState<string | null>(null);

    // Manual form fields
    const [name, setName] = useState("");
    const [brand, setBrand] = useState("");
    const [price, setPrice] = useState("");
    const [salePrice, setSalePrice] = useState("");
    const [currency, setCurrency] = useState("USD");
    const [imageUrl, setImageUrl] = useState("");
    const [category, setCategory] = useState<string>("other");

    const handleScrape = async () => {
        if (!url.trim()) {
            setError("Please enter a product URL");
            return;
        }

        setScraping(true);
        setError(null);

        try {
            const response = await fetch("/api/scrape", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to scrape product");
            }

            // Set scraped data
            setScrapedData(data);
            setName(data.name || "");
            setBrand(data.brand || "");
            setPrice(data.price?.toString() || "");
            setSalePrice(data.salePrice?.toString() || "");
            setCurrency(data.currency || "USD");
            setImageUrl(data.image_url || "");
            setCategory(data.category || "other");
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to fetch product details"
            );
        } finally {
            setScraping(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await onAdd({
                url,
                name: name || null,
                brand: brand || null,
                price: price ? parseFloat(price) : null,
                salePrice: salePrice ? parseFloat(salePrice) : null,
                currency: currency || "USD",
                image_url: imageUrl || null,
                category: category || null,
            });

            // Reset form
            setUrl("");
            setName("");
            setBrand("");
            setPrice("");
            setSalePrice("");
            setCurrency("USD");
            setImageUrl("");
            setCategory("other");
            setScrapedData(null);
            onClose();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to add product"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setUrl("");
        setName("");
        setBrand("");
        setPrice("");
        setSalePrice("");
        setCurrency("USD");
        setImageUrl("");
        setCategory("other");
        setScrapedData(null);
        setError(null);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-50 md:w-full md:max-w-2xl">
                <div className="bg-white h-full md:h-auto md:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-screen md:max-h-[90vh]">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-200">
                        <h2 className="text-2xl font-light text-slate-800">
                            Add Product
                        </h2>
                        <button
                            onClick={handleClose}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                        >
                            <svg
                                className="w-6 h-6 text-slate-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* URL Input */}
                            <div>
                                <label
                                    htmlFor="url"
                                    className="block text-sm font-medium text-slate-700 mb-2"
                                >
                                    Product URL *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        id="url"
                                        type="url"
                                        value={url}
                                        onChange={(e) => setUrl(e.target.value)}
                                        placeholder="https://example.com/product"
                                        required
                                        className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleScrape}
                                        disabled={scraping || !url.trim()}
                                        className="px-6 py-2.5 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium whitespace-nowrap cursor-pointer"
                                    >
                                        {scraping ? (
                                            <span className="flex items-center gap-2">
                                                <svg
                                                    className="w-4 h-4 animate-spin"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                                    />
                                                </svg>
                                                Fetching...
                                            </span>
                                        ) : (
                                            "Fetch Details"
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    Paste the product URL and click &quot;Fetch
                                    Details&quot; to auto-fill
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Manual Fields */}
                            <div className="space-y-4 pt-4 border-t border-slate-200">
                                <p className="text-sm text-slate-600">
                                    Product Details
                                </p>

                                {/* Name */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Product Name
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                        placeholder="e.g., Classic T-Shirt"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                    />
                                </div>

                                {/* Brand */}
                                <div>
                                    <label
                                        htmlFor="brand"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Brand
                                    </label>
                                    <input
                                        id="brand"
                                        type="text"
                                        value={brand}
                                        onChange={(e) =>
                                            setBrand(e.target.value)
                                        }
                                        placeholder="e.g., Nike"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                    />
                                </div>

                                {/* Price and Category Row */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Price */}
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Original Price
                                        </label>
                                        <div className="flex gap-2">
                                            <select
                                                value={currency}
                                                onChange={(e) =>
                                                    setCurrency(e.target.value)
                                                }
                                                className="px-3 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 cursor-pointer"
                                            >
                                                <option value="USD">
                                                    USD ($)
                                                </option>
                                                <option value="EUR">
                                                    EUR (€)
                                                </option>
                                                <option value="GBP">
                                                    GBP (£)
                                                </option>
                                                <option value="CAD">
                                                    CAD ($)
                                                </option>
                                                <option value="AUD">
                                                    AUD ($)
                                                </option>
                                                <option value="JPY">
                                                    JPY (¥)
                                                </option>
                                            </select>
                                            <input
                                                id="price"
                                                type="number"
                                                step="0.01"
                                                value={price}
                                                onChange={(e) =>
                                                    setPrice(e.target.value)
                                                }
                                                placeholder="0.00"
                                                className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="block text-sm font-medium text-slate-700 mb-1.5"
                                        >
                                            Sale Price
                                        </label>

                                        <input
                                            id="salePrice"
                                            type="number"
                                            step="0.01"
                                            value={salePrice}
                                            onChange={(e) =>
                                                setSalePrice(e.target.value)
                                            }
                                            placeholder="0.00"
                                            className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                        />
                                    </div>
                                </div>
                                {/* Category */}
                                <div>
                                    <label
                                        htmlFor="category"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        value={category}
                                        onChange={(e) =>
                                            setCategory(e.target.value)
                                        }
                                        className="w-full px-4 py-[12.5px] leading-[normal] rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 cursor-pointer"
                                    >
                                        <option value="shirts">Shirts</option>
                                        <option value="pants">Pants</option>
                                        <option value="shoes">Shoes</option>
                                        <option value="outerwear">
                                            Outerwear
                                        </option>
                                        <option value="accessories">
                                            Accessories
                                        </option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Image URL */}
                                <div>
                                    <label
                                        htmlFor="imageUrl"
                                        className="block text-sm font-medium text-slate-700 mb-1.5"
                                    >
                                        Image URL
                                    </label>
                                    <input
                                        id="imageUrl"
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) =>
                                            setImageUrl(e.target.value)
                                        }
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
                                    />
                                </div>

                                {/* Image Preview */}
                                {imageUrl && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium text-slate-700 mb-2">
                                            Preview
                                        </p>
                                        <div className="relative w-full aspect-square max-w-xs bg-slate-100 rounded-lg overflow-hidden">
                                            <Image
                                                src={imageUrl}
                                                alt="Product preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display =
                                                        "none";
                                                }}
                                                fill
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Footer Buttons */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="flex-1 px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading || !url.trim()}
                                    className="flex-1 px-6 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
                                >
                                    {loading ? "Adding..." : "Add Product"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
