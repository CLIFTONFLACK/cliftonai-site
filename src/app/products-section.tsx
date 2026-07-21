"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "./reveal";
import { products, productCategories, type Product } from "./products-data";

const WHATSAPP_HREF = "https://wa.me/447547258570";

/** Wordmark + divider + product suffix — the one lockup grammar for sub-brands. */
function ProductLockup({
  product,
  size = "base",
}: {
  product: Product;
  size?: "base" | "lg";
}) {
  if (!product.shortName) {
    return (
      <h3
        className={`font-heading font-semibold text-fg ${
          size === "lg" ? "text-2xl" : "text-lg"
        }`}
      >
        {product.name}
      </h3>
    );
  }
  return (
    <h3
      className={`flex items-baseline font-heading font-semibold text-fg ${
        size === "lg" ? "text-2xl" : "text-lg"
      }`}
    >
      CliftonAi
      <span
        aria-hidden="true"
        className="mx-2.5 inline-block h-[1em] w-0.5 self-center bg-brand-emerald-bright"
      />
      <span className="font-medium tracking-tight text-fg-muted">
        {product.shortName}
      </span>
    </h3>
  );
}

function StatusBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border-strong px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-fg-subtle uppercase">
      <span className="h-1.5 w-1.5 rounded-full bg-fg-subtle" aria-hidden="true" />
      In development
    </span>
  );
}

function Screenshot({
  product,
  sizes,
}: {
  product: Product;
  sizes: string;
}) {
  return (
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
        sizes={sizes}
        className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

/** Own products: large 2-up cards with the product-accent keyline. */
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
      style={product.accent ? { borderTopColor: product.accent } : undefined}
      className="glass glass-hover card-focus group relative flex h-full flex-col overflow-hidden rounded-2xl border-t-[3px] cursor-pointer"
    >
      <Screenshot product={product} sizes="(max-width: 640px) 100vw, 50vw" />
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <ProductLockup product={product} />
          {product.status === "in-development" && <StatusBadge />}
        </div>
        <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald uppercase">
          {product.tagline}
        </p>
        <p className="mt-3 text-base leading-relaxed text-fg">{product.hook}</p>
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-fg-muted">
          {product.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-emerald" />
              {bullet}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-1 items-end gap-2">
          <a
            href={product.href}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-hover flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-brand-emerald cursor-pointer"
          >
            Visit {product.shortName ?? product.name}
          </a>
          {product.demoHref && product.demoHref !== product.href && (
            <a
              href={product.demoHref}
              onClick={(e) => e.stopPropagation()}
              className="glass glass-hover flex-1 rounded-full px-4 py-2.5 text-center text-sm font-semibold text-fg cursor-pointer"
            >
              View Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/** Client work: case-study rows — their brand up front, our credit line. */
function ClientRow({
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
      className="glass glass-hover card-focus group flex flex-col overflow-hidden rounded-2xl cursor-pointer sm:flex-row"
    >
      <div className="sm:w-72 sm:shrink-0 sm:border-r sm:border-border">
        <Screenshot product={product} sizes="(max-width: 640px) 100vw, 288px" />
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex flex-wrap items-center gap-2.5">
          <h3 className="font-heading text-lg font-semibold text-fg">
            {product.name}
          </h3>
          {product.status === "in-development" && <StatusBadge />}
        </div>
        <p className="mt-1 text-xs font-medium tracking-wide text-brand-emerald uppercase">
          {product.tagline}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-fg-muted">
          {product.hook}
        </p>
        <div className="mt-4 flex flex-1 flex-wrap items-end justify-between gap-3">
          <span className="text-xs text-fg-subtle">
            Built by <span className="font-semibold text-fg-muted">CliftonAi</span>
          </span>
          <a
            href={product.href}
            onClick={(e) => e.stopPropagation()}
            className="glass glass-hover rounded-full px-4 py-2 text-center text-xs font-semibold text-brand-emerald cursor-pointer"
          >
            Visit site
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
        className="glass relative grid w-full max-w-4xl overflow-hidden rounded-3xl md:grid-cols-[2fr_3fr]"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-bg-elevated text-fg cursor-pointer"
        >
          ✕
        </button>
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-border bg-bg-card md:aspect-auto md:h-full md:border-r md:border-b-0">
          <Image
            src={product.screenshot}
            alt={`${product.name} product screenshot`}
            fill
            sizes="(max-width: 768px) 100vw, 360px"
            className="object-cover object-top"
          />
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-8 md:max-h-[85vh]">
          <div className="flex flex-wrap items-center gap-2.5">
            <ProductLockup product={product} size="lg" />
            {product.status === "in-development" && <StatusBadge />}
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
              Visit {product.shortName ?? "site"}
            </a>
            {product.demoHref && product.demoHref !== product.href && (
              <a
                href={product.demoHref}
                className="glass glass-hover flex-1 rounded-full px-5 py-3 text-center text-sm font-semibold text-fg cursor-pointer"
              >
                View Demo
              </a>
            )}
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
  const selfCategory = productCategories.find((c) => c.key === "self")!;
  const clientCategory = productCategories.find((c) => c.key === "client")!;
  const selfProducts = products.filter((p) => p.category === "self");
  const clientProducts = products.filter((p) => p.category === "client");

  return (
    <section id="products" className="border-t border-border">
      {/* Own products — full inheritance, 2-up */}
      <div className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {selfCategory.title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-fg-muted">
              {selfCategory.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {selfProducts.map((product, i) => (
              <Reveal key={product.name} delay={Math.min(i, 3) * 80}>
                <ProductCard product={product} onOpen={setActiveProduct} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Client work — endorsed, case-study rows on a panel band */}
      <div className="border-t border-border bg-bg-panel px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
              {clientCategory.title}
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-fg-muted">
              {clientCategory.intro}
            </p>
          </Reveal>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {clientProducts.map((product, i) => (
              <Reveal key={product.name} delay={Math.min(i, 3) * 80}>
                <ClientRow product={product} onOpen={setActiveProduct} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {activeProduct && (
        <ProductModal
          product={activeProduct}
          onClose={() => setActiveProduct(null)}
        />
      )}
    </section>
  );
}
