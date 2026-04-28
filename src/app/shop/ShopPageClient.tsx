"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SlidersHorizontalIcon,
  ArrowDown01Icon,
  ShoppingBag01Icon,
} from "@hugeicons/core-free-icons";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/sanity/lib/queries";
import Loader from "@/components/Loader";
import type { SanityImageSource } from "@sanity/image-url";

interface Category {
  _id: string;
  title: string;
  slug: string;
  image?: SanityImageSource | string;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  image: SanityImageSource | string;
  hoverImage?: SanityImageSource | string;
  category: Category | null;
  price: number;
  currency: string;
  salePrice?: number;
  badge?: string;
  sizes?: string[];
  inStock: boolean;
  _createdAt?: string;
}

const badgeStyles: Record<string, string> = {
  new: "bg-emerald-500 text-white",
  exclusive: "bg-dark-charcoal text-white",
  sale: "bg-parofc-red text-white",
  limited: "bg-parofc-gold text-dark-charcoal",
  bestseller: "bg-parofc-gold text-dark-charcoal",
};

const badgeLabels: Record<string, string> = {
  new: "NEW",
  exclusive: "EXCLUSIVE",
  sale: "SALE",
  limited: "LIMITED",
  bestseller: "BEST SELLER",
};

const ProductCard = React.memo(function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = useMemo(() => {
    const price = product.salePrice || product.price;
    if (product.currency === "BTN") {
      return `Nu. ${price.toLocaleString()}`;
    }
    return `$${price.toFixed(2)}`;
  }, [product.salePrice, product.price, product.currency]);

  const originalPrice = useMemo(() => {
    if (!product.salePrice) return null;
    if (product.currency === "BTN") {
      return `Nu. ${product.price.toLocaleString()}`;
    }
    return `$${product.price.toFixed(2)}`;
  }, [product.salePrice, product.price, product.currency]);

  const mainImageUrl = useMemo(() => {
    if (typeof product.image === "string") return product.image;
    try {
      return urlFor(product.image).width(600).height(750).url();
    } catch {
      return "/images/placeholder-product.png";
    }
  }, [product.image]);

  const hoverImageUrl = useMemo(() => {
    if (!product.hoverImage) return null;
    if (typeof product.hoverImage === "string") return product.hoverImage;
    try {
      return urlFor(product.hoverImage).width(600).height(750).url();
    } catch {
      return null;
    }
  }, [product.hoverImage]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/shop/${product.slug}`} className="block cursor-pointer">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          <Image
            src={mainImageUrl}
            alt={product.name}
            fill
            className={`object-cover transition-all duration-700 ${
              isHovered && hoverImageUrl
                ? "opacity-0 scale-105"
                : "opacity-100 scale-100"
            }`}
          />

          {hoverImageUrl && (
            <Image
              src={hoverImageUrl}
              alt={`${product.name} - alternate view`}
              fill
              className={`object-cover transition-all duration-700 absolute inset-0 ${
                isHovered ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
            />
          )}

          {/* Badge */}
          {product.badge && (
            <div className="absolute top-3 left-3 z-10">
              <span
                className={`${badgeStyles[product.badge]} text-2xs font-bold px-3 py-1 tracking-widest`}
              >
                {badgeLabels[product.badge]}
              </span>
            </div>
          )}

          {/* Sale percentage */}
          {product.salePrice && product.price > 0 && (
            <div className="absolute top-3 right-3 z-10">
              <span className="bg-parofc-red text-white text-2xs font-bold px-2 py-1">
                -
                {Math.round(
                  ((product.price - product.salePrice) / product.price) * 100,
                )}
                %
              </span>
            </div>
          )}

          {/* Quick view overlay */}
          <div
            className={`absolute inset-0 bg-dark-charcoal/0 group-hover:bg-dark-charcoal/5 transition-colors duration-300`}
          />

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
              <span className="bg-dark-charcoal text-white text-xs font-bold px-4 py-2 uppercase tracking-widest">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-3 space-y-1">
          {product.category?.title && (
            <p className="text-2xs font-bold text-gray-400 tracking-widest uppercase">
              {product.category.title}
            </p>
          )}

          <h3 className="text-sm font-semibold text-dark-charcoal leading-snug line-clamp-2 group-hover:text-parofc-red transition-colors duration-200">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span
              className={`text-sm font-bold ${product.salePrice ? "text-parofc-red" : "text-dark-charcoal"}`}
            >
              {formattedPrice}
            </span>
            {originalPrice && (
              <span className="text-xs text-gray-400 line-through">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          client.fetch(PRODUCTS_QUERY),
          client.fetch(CATEGORIES_QUERY),
        ]);

        if (productsData && Array.isArray(productsData)) {
          setProducts(productsData);
        } else {
          setProducts([]);
        }

        if (categoriesData && Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setProducts([]);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    if (!product) return false;
    if (selectedCategory === "all") return true;
    return product.category?._id === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        if (a._createdAt && b._createdAt) {
          return (
            new Date(b._createdAt).getTime() - new Date(a._createdAt).getTime()
          );
        }
        if (a._createdAt && !b._createdAt) return -1;
        if (!a._createdAt && b._createdAt) return 1;
        return 0;
      case "price-low":
        return (a.salePrice ?? a.price ?? 0) - (b.salePrice ?? b.price ?? 0);
      case "price-high":
        return (b.salePrice ?? b.price ?? 0) - (a.salePrice ?? a.price ?? 0);
      case "name":
        return (a.name || "").localeCompare(b.name || "");
      default:
        return 0;
    }
  });

  const selectedCategoryName =
    selectedCategory === "all"
      ? "All Products"
      : categories.find((c) => c._id === selectedCategory)?.title ||
        "All Products";

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header */}
      <div className="relative bg-dark-charcoal overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, white 20px, white 21px)",
          }}
        />

        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs font-bold text-parofc-gold uppercase tracking-[0.2em] mb-3">
              Official Merchandise
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white uppercase tracking-tight leading-none">
              Paro FC
              <br />
              <span className="text-parofc-gold">Shop</span>
            </h1>
          </motion.div>
        </div>

        <div className="h-1 bg-gradient-to-r from-parofc-red via-parofc-gold to-bronze" />
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-12 md:h-14">
            {/* Filter Toggle */}
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 text-xs font-bold text-dark-charcoal uppercase tracking-wider hover:text-parofc-red transition-colors duration-200 cursor-pointer"
            >
              <HugeiconsIcon icon={SlidersHorizontalIcon} size={14} />
              <span>Filter & Sort</span>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                size={12}
                className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </button>

            {/* Active filter + count */}
            <div className="flex items-center gap-3">
              {selectedCategory !== "all" && (
                <button
                  onClick={() => setSelectedCategory("all")}
                  className="text-2xs font-bold text-parofc-red uppercase tracking-wider cursor-pointer hover:underline"
                >
                  Clear filter
                </button>
              )}
              <span className="text-xs text-gray-400 tabular-nums">
                {sortedProducts.length}{" "}
                {sortedProducts.length === 1 ? "product" : "products"}
              </span>
            </div>
          </div>

          {/* Filter Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pb-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Category Filter */}
                  <div>
                    <h3 className="text-2xs font-bold text-gray-400 mb-3 tracking-widest uppercase">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                          selectedCategory === "all"
                            ? "bg-dark-charcoal text-white"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        All
                      </button>
                      {categories.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => setSelectedCategory(category._id)}
                          className={`px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                            selectedCategory === category._id
                              ? "bg-dark-charcoal text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <h3 className="text-2xs font-bold text-gray-400 mb-3 tracking-widest uppercase">
                      Sort by
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: "newest", label: "Newest" },
                        { value: "price-low", label: "Price: Low" },
                        { value: "price-high", label: "Price: High" },
                        { value: "name", label: "A - Z" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setSortBy(option.value)}
                          className={`px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                            sortBy === option.value
                              ? "bg-dark-charcoal text-white"
                              : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {isLoading ? (
          <Loader />
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-x-6 md:gap-y-10">
            {sortedProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <HugeiconsIcon
              icon={ShoppingBag01Icon}
              size={40}
              className="mx-auto text-gray-200 mb-4"
            />
            <p className="text-sm font-semibold text-gray-400 mb-1">
              {products.length === 0
                ? "No products available yet"
                : `No products in "${selectedCategoryName}"`}
            </p>
            {selectedCategory !== "all" && (
              <button
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-bold text-parofc-red hover:underline cursor-pointer mt-2"
              >
                View all products
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
