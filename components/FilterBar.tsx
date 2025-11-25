"use client";

import { CategoryFilter, SortOption } from "@/lib/types";

interface FilterSortBarProps {
    categoryFilter: CategoryFilter;
    onCategoryChange: (category: CategoryFilter) => void;
    sortOption: SortOption;
    onSortChange: (sort: SortOption) => void;
    productCount: number;
}

const categories: { value: CategoryFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "shirts", label: "Shirts" },
    { value: "pants", label: "Pants" },
    { value: "shoes", label: "Shoes" },
    { value: "outerwear", label: "Outerwear" },
    { value: "accessories", label: "Accessories" },
    { value: "other", label: "Other" },
];

const sortOptions: { value: SortOption; label: string }[] = [
    { value: "newest", label: "Newest" },
    { value: "oldest", label: "Oldest" },
    { value: "a-z", label: "A-Z" },
    { value: "z-a", label: "Z-A" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
];

export default function FilterSortBar({
    categoryFilter,
    onCategoryChange,
    sortOption,
    onSortChange,
    productCount,
}: FilterSortBarProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Category Filter */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                    {categories.map((category) => (
                        <button
                            key={category.value}
                            onClick={() => onCategoryChange(category.value)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                                categoryFilter === category.value
                                    ? "bg-slate-800 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                        >
                            {category.label}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown and Count */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-slate-500 whitespace-nowrap">
                        {productCount} {productCount === 1 ? "item" : "items"}
                    </span>
                    <select
                        value={sortOption}
                        onChange={(e) =>
                            onSortChange(e.target.value as SortOption)
                        }
                        className="px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}
