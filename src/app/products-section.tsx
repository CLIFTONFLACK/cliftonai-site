"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "./reveal";
import { products, productCategories, type Product } from "./products-data";

const WHATSAPP_HREF = "https://wa.me/447547258570";

function ProductCard({
  product,
  onOpen,
}: {
  product: Product;
  onOpen: (product: Product) => void;
}) {
  return (
    <div
      onClick={() => onOpen(product)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen(product);
      }}
      className="glass glass-hover group relative flex h-full flex-col overflow-hidden rounded-2xl cursor-pointer"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg-card">
        <div className="absolute inset-x-0 top-0 z-10 flex items-center gap-1.5 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
          <span className="h-2 w-2 rounded-full bg-fg-subtle/40" />
        </div>
        <Image
          src={product.screenshot}
          alt={`${product.name} product screenshot`}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center gap-2.5">
          <h3 className="font-heading text-lg font-semibold text-fg">
            {product.name}
          </h3>
          {product.status === "in-development" && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
              In development
            </span>
          )}
        </div>
        <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald uppercase">
          {product.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg">{product.hook}</p>
        <ul className="mt-3 space-y-1.5 text-xs leading-relaxed text-fg-muted">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-brand-emerald" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex flex-1 items-end gap-2">
          <a
            href={product.href}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-hover flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold text-brand-emerald cursor-pointer"
          >
            Visit Homepage
          </a>
          <a
            href={product.demoHref}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-hover flex-1 rounded-full px-3 py-2 text-center text-xs font-semibold text-fg cursor-pointer"
          >
            View Demo
          </a>
        </div>
      </div>
    </div>
  );
}

function ProductModal({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass relative w-full max-w-2xl overflow-hidden rounded-3xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated text-fg cursor-pointer"
        >
          ✕
        </button>
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg-card">
          <Image
            src={product.screenshot}
            alt={`${product.name} product screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 672px"
            className="object-cover object-top"
          />
        </div>
        <div className="max-h-[50vh] overflow-y-auto p-8">
          <div className="flex items-center gap-2.5">
            <h3 className="font-heading text-2xl font-semibold text-fg">
              {product.name}
            </h3>
            {product.status === "in-development" && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
                In development
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald uppercase">
            {product.tagline}
          </p>
          <p className="mt-4 text-base leading-relaxed text-fg-muted">
            {product.description}
          </p>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
            {product.bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-emerald" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={product.href}
              className="flex-1 rounded-full bg-brand-emerald-bright px-5 py-3 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-mid cursor-pointer"
            >
              Visit Homepage
            </a>
            <a
              href={product.demoHref}
              className="glass glass-hover flex-1 rounded-full px-5 py-3 text-center text-sm font-semibold text-fg cursor-pointer"
            >
              View Demo
            </a>
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="glass glass-hover flex-1 rounded-full px-5 py-3 text-center text-sm font-semibold text-brand-emerald cursor-pointer"
            >
              Message us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductsSection() {
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  return (
    <section id="products" className="relative overflow-hidden border-t border-border px-6 py-24">
      <div aria-hidden="true" className="blob blob-emerald animate-float h-[360px] w-[480px] top-1/3 -left-40" />
      <div className="relative mx-auto max-w-6xl">
        {productCategories.map((category, ci) => {
          const categoryProducts = products.filter((p) => p.category === category.key);
          return (
            <div key={category.key} className={ci === 0 ? "" : "mt-20"}>
              <Reveal>
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                  {category.title}
                </h2>
                <p className="mt-3 text-lg leading-relaxed text-fg-muted">{category.intro}</p>
              </Reveal>
              <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
                {categoryProducts.map((product, i) => (
                  <Reveal key={product.name} delay={i * 80}>
                    <ProductCard product={product} onOpen={setActiveProduct} />
                  </Reveal>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {activeProduct && (
        <ProductModal product={activeProduct} onClose={() => setActiveProduct(null)} />
      )}
    </section>
  );
}
