"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/lib/types";
import type { User } from "@supabase/supabase-js";

const GUEST_STORAGE_KEY = "wardrobe_guest_products";

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const supabase = createClient();

    // Get user and products
    useEffect(() => {
        const getUser = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            setUser(user);
        };

        getUser();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase.auth]);

    // Fetch products based on user state
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);

            if (user) {
                // Fetch from Supabase
                const { data, error } = await supabase
                    .from("products")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false });

                if (!error && data) {
                    setProducts(data);
                }
            } else {
                // Fetch from localStorage
                const guestProducts = localStorage.getItem(GUEST_STORAGE_KEY);
                if (guestProducts) {
                    setProducts(JSON.parse(guestProducts));
                } else {
                    setProducts([]);
                }
            }

            setLoading(false);
        };

        fetchProducts();
    }, [user, supabase]);

    // Add product
    const addProduct = async (
        product: Omit<Product, "id" | "created_at" | "updated_at">
    ) => {
        if (user) {
            // Add to Supabase
            const { data, error } = await supabase
                .from("products")
                .insert([{ ...product, user_id: user.id }])
                .select()
                .single();

            if (!error && data) {
                setProducts((prev) => [data, ...prev]);
                return data;
            }
        } else {
            // Add to localStorage
            const newProduct: Product = {
                ...product,
                id: crypto.randomUUID(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };
            const updatedProducts = [newProduct, ...products];
            localStorage.setItem(
                GUEST_STORAGE_KEY,
                JSON.stringify(updatedProducts)
            );
            setProducts(updatedProducts);
            return newProduct;
        }
    };

    // Delete product
    const deleteProduct = async (id: string) => {
        if (user) {
            // Delete from Supabase
            const { error } = await supabase
                .from("products")
                .delete()
                .eq("id", id)
                .eq("user_id", user.id);

            if (!error) {
                setProducts((prev) => prev.filter((p) => p.id !== id));
            }
        } else {
            // Delete from localStorage
            const updatedProducts = products.filter((p) => p.id !== id);
            localStorage.setItem(
                GUEST_STORAGE_KEY,
                JSON.stringify(updatedProducts)
            );
            setProducts(updatedProducts);
        }
    };

    // Update product
    const updateProduct = async (id: string, updates: Partial<Product>) => {
        if (user) {
            // Update in Supabase
            const { data, error } = await supabase
                .from("products")
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq("id", id)
                .eq("user_id", user.id)
                .select()
                .single();

            if (!error && data) {
                setProducts((prev) =>
                    prev.map((p) => (p.id === id ? data : p))
                );
                return data;
            }
        } else {
            // Update in localStorage
            const updatedProducts = products.map((p) =>
                p.id === id
                    ? { ...p, ...updates, updated_at: new Date().toISOString() }
                    : p
            );
            localStorage.setItem(
                GUEST_STORAGE_KEY,
                JSON.stringify(updatedProducts)
            );
            setProducts(updatedProducts);
        }
    };

    return {
        products,
        loading,
        user,
        addProduct,
        deleteProduct,
        updateProduct,
    };
}
