"use client";

import React, { useState } from "react";
import {
  Heart,
  Search,
  Star,
  ArrowRight,
  ShieldCheck,
  Package,
  Truck,
  Globe,
  Sparkles,
  SendHorizontal,
  ChevronRight,
} from "lucide-react";

import { AnimatePresence, motion } from "motion/react";

import { Link } from "@/lib/router";
import { cn } from "@/lib/utils";
import HeroSection from "../sections/HeroSection";
import { useAppSelector } from "@/lib/store/hooks";

const trustItems = [
  {
    title: "Free Shipping & Returns",
    detail: "On all orders over $99",
    icon: Truck,
  },
  {
    title: "Money Back Guarantee",
    detail: "100% satisfaction or full refund",
    icon: ShieldCheck,
  },
  {
    title: "Authentic Military Grade",
    detail: "Genuine surplus & tactical brands",
    icon: Package,
  },
  {
    title: "24/7 Online Support",
    detail: "Always here when you need us",
    icon: Globe,
  },
];

const categoryShowcase = [
  {
    title: "Footwear",
    label: "Sector-01",
    image:
      "https://alliedsurplus.com/wp-content/uploads/2016/09/products-propper-series-100-8-inch-side-zip-boot-waterproof-black-f45201t001_1-300x300.jpg",
    slug: "footwear",
  },
  {
    title: "Outerwear",
    label: "Sector-02",
    image:
      "https://alliedsurplus.com/wp-content/uploads/2026/02/Screenshot-2026-02-13-153307-300x300.png",
    slug: "apparel",
  },
  {
    title: "Tactical Gear",
    label: "Sector-03",
    image:
      "https://alliedsurplus.com/wp-content/uploads/2026/02/40063-D-amazon-1-300x300.jpg",
    slug: "tactical",
  },
];

export default function HomePage({ pageData }: { pageData: any }) {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };
  const heroSection = pageData?.content?.find(
    (section: any) => section.adminTitle === "Hero",
  );

  return (
    <div className="homepage-root">
      {/* ANNOUNCEMENT STRIP */}
      <div className="bg-olive py-2.5 text-white font-head font-bold text-[11px] uppercase tracking-[0.15em] flex justify-center items-center gap-x-10 px-6 italic shadow-lg relative z-10">
        <span className="flex items-center gap-2">
          Free Shipping on orders over $99
        </span>
        <div className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
        <span className="flex items-center gap-2">
          100% Money Back Guarantee
        </span>
        <div className="w-1 h-1 bg-white/30 rounded-full hidden sm:block" />
        <span className="flex items-center gap-2">
          Custom Dog Tags &mdash;{" "}
          <Link
            href="/custom-dog-tags"
            className="text-gold underline underline-offset-4"
          >
            Shop Now
          </Link>
        </span>
      </div>

      <HeroSection heroSection={heroSection} showToast={showToast} />

      {/* TRUST BADGES SECTION */}
      <section className="bg-ink border-b border-white/5">
        <div className="container max-w-[1340px] px-0 mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, idx) => (
            <div
              key={idx}
              className={cn(
                "flex items-center gap-4 px-7 py-5.5 border-white/5",
                idx !== trustItems.length - 1 && "lg:border-r",
              )}
            >
              <div className="w-11 h-11 bg-olive/20 border border-olive/40 text-olive-lt flex items-center justify-center rounded-[4px] flex-shrink-0">
                <item.icon size={20} />
              </div>
              <div>
                <h4 className="font-head text-[14px] font-bold tracking-wider text-white uppercase leading-tight">
                  {item.title}
                </h4>
                <p className="text-[12px] text-white/45 mt-0.5">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRENDING GEAR */}
      <section className="section py-20 bg-ink">
        <div className="container max-w-[1340px] px-6 mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-head text-[11px] font-bold tracking-[0.2em] text-gold uppercase">
                <div className="h-0.5 w-6 bg-gold" /> LIVE INVENTORY FEED
              </div>
              <h2 className="font-head text-[42px] font-extrabold tracking-[0.02em] text-white uppercase italic leading-none">
                Trending <span className="text-gold not-italic">Gear</span>
              </h2>
            </div>
            <Link
              href="/shop"
              className="view-link font-head text-[13px] font-bold tracking-[0.1em] uppercase text-olive-lt hover:text-gold transition-all flex items-center gap-2 group italic"
            >
              View All Equipment{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1.5 transition-transform"
              />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((id) => (
              <article
                key={id}
                className="product-card group bg-dark border border-white/6 rounded-[3px] overflow-hidden hover:translate-y-[-5px] hover:border-olive/40 transition-all duration-300 shadow-xl"
              >
                <div className="aspect-square bg-mid relative overflow-hidden">
                  <span className="absolute top-3 left-3 bg-red text-white font-head text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 z-10 rounded-[2px] shadow-lg">
                    HOT
                  </span>
                  <img
                    src={`https://alliedsurplus.com/wp-content/uploads/2016/09/products-propper-series-100-8-inch-side-zip-boot-waterproof-black-f45201t001_1-300x300.jpg`}
                    alt="Tactical Product"
                    className="w-full h-full object-cover grayscale-[0.1] brightness-[0.8] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-ink/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5">
                    <button
                      onClick={() => showToast("Added to wishlist")}
                      className="w-10 h-10 bg-white text-ink rounded-[2px] flex items-center justify-center hover:bg-gold transition-colors"
                    >
                      <Heart size={18} />
                    </button>
                    <button className="w-10 h-10 bg-white text-ink rounded-[2px] flex items-center justify-center hover:bg-gold transition-colors">
                      <Search size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold text-olive-lt uppercase tracking-widest">
                    <span>FOOTWEAR / PROPPER</span>
                    <div className="flex gap-0.5 text-gold-lt">
                      <Star size={8} fill="currentColor" />
                      <Star size={8} fill="currentColor" />
                      <Star size={8} fill="currentColor" />
                      <Star size={8} fill="currentColor" />
                      <Star size={8} fill="currentColor" />
                    </div>
                  </div>
                  <h3 className="font-head text-[16px] font-bold text-white uppercase tracking-[0.02em] leading-tight hover:text-gold transition-colors">
                    <Link href="/shop">
                      Propper Series 100 Side-Zip Boot F4520
                    </Link>
                  </h3>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-baseline gap-2">
                      <span className="text-[20px] font-head font-extrabold text-white">
                        $89
                      </span>
                      <span className="text-[12px] text-white/20 line-through decoration-red/40">
                        $119
                      </span>
                    </div>
                    <button
                      onClick={() => showToast("Added to cart")}
                      className="bg-olive text-white font-head text-[11px] font-bold tracking-widest uppercase px-4 py-2.5 rounded-[2px] hover:bg-olive-lt transition-all"
                    >
                      Add To Cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY SHOWCASE */}
      <section className="section-alt py-24 bg-charcoal relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-olive/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
        <div className="container max-w-[1340px] px-6 mx-auto relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-head text-[11px] font-bold tracking-[0.25em] text-gold uppercase">
                <div className="h-0.5 w-8 bg-gold" /> EXPLORE CATEGORIES
              </div>
              <h2 className="font-head text-[42px] font-extrabold tracking-[0.02em] text-white uppercase italic leading-none">
                Product <span className="text-gold not-italic">Categories</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categoryShowcase.map((cat, idx) => (
              <Link
                key={idx}
                href={`/category/${cat.slug}`}
                className="group relative aspect-[4/5] rounded-[3px] overflow-hidden bg-ink shadow-2xl"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover grayscale-[0.35] brightness-[0.7] group-hover:grayscale-0 group-hover:brightness-100 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent opacity-80" />
                <div className="absolute left-8 bottom-8 right-8 transition-transform duration-500 group-hover:translate-y-[-10px] space-y-3">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-gold/60 uppercase tracking-[0.2em] italic">
                      {cat.label}
                    </span>
                    <h3 className="font-head text-[28px] font-extrabold text-white uppercase tracking-[0.02em]">
                      {cat.title}
                    </h3>
                  </div>
                  <p className="text-[13px] text-white/50 italic leading-snug line-clamp-2">
                    Authentic military-grade survival gear and mission-essential
                    kits designed for peak performance in any environment.
                  </p>
                  <div className="pt-2 flex items-center gap-2.5 font-head text-[12px] font-bold tracking-[0.2em] text-gold uppercase">
                    VIEW CATEGORY{" "}
                    <ChevronRight
                      size={14}
                      className="group-hover:translate-x-1.5 transition-transform"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="section py-12 bg-ink">
        <div className="container max-w-[1340px] px-6 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Banner 1 */}
            <div className="group relative h-[380px] rounded-[3px] overflow-hidden bg-charcoal border border-white/5">
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Dog_Tags_Small_Banner.jpg"
                className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-olive/20 mix-blend-multiply opacity-40" />
              <div className="absolute inset-0 p-10 flex flex-col justify-center items-start text-left space-y-5">
                <span className="bg-red text-white font-head text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-[2px]">
                  NEW ARRIVALS
                </span>
                <h2 className="font-head text-[48px] font-extrabold text-white uppercase leading-none tracking-tight">
                  Custom <span className="text-gold italic">Dog Tags</span>
                </h2>
                <p className="text-[14px] text-white/60 max-w-[280px] italic">
                  Official US military specification stainless steel tags.
                  Personalized in-store or online.
                </p>
                <Link
                  href="/custom-dog-tags"
                  className="border text-black text-black font-head text-[13px] font-bold tracking-widest uppercase px-8 py-3.5 rounded-[2px] hover:bg-gold transition-all active:translate-y-1"
                >
                  Shop Now
                </Link>
              </div>
            </div>
            {/* Banner 2 */}
            <div className="group relative h-[380px] rounded-[3px] overflow-hidden bg-charcoal border border-white/5">
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Reebok2.jpg"
                className="w-full h-full object-cover grayscale brightness-[0.4] group-hover:grayscale-0 group-hover:brightness-75 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gold/10 mix-blend-multiply opacity-20" />
              <div className="absolute inset-0 p-10 flex flex-col justify-center items-end text-right space-y-5">
                <span className="bg-olive text-white font-head text-[11px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-[2px]">
                  FIELD READY
                </span>
                <h2 className="font-head text-[48px] font-extrabold text-white uppercase leading-none tracking-tight">
                  Reebok <span className="text-gold italic">Tactical</span>
                </h2>
                <p className="text-[14px] text-white/60 max-w-[280px] italic">
                  Lightweight, rugged footwear engineered for maximum agility
                  and comfort in the field.
                </p>
                <Link
                  href="/shop"
                  className="bg-olive text-white font-head text-[13px] font-bold tracking-widest uppercase px-8 py-3.5 rounded-[2px] hover:bg-olive-lt transition-all active:translate-y-1"
                >
                  Explore Boots
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS MARQUEE */}
      <section className="bg-charcoal py-20 border-y border-white/5 overflow-hidden">
        <div className="container max-w-[1340px] px-6 mx-auto mb-10">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="h-[2px] w-5 bg-gold" />
            <span className="font-head text-[10px] font-bold tracking-[0.25em] text-gold uppercase">
              TRUSTED NAMES
            </span>
          </div>
          <h2 className="pb-4 font-head text-[44px] md:text-[56px] font-extrabold text-white uppercase tracking-tight leading-none">
            BRANDS WE <span className="text-gold">CARRY</span>
          </h2>
        </div>

        <div className="relative group overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-charcoal to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-charcoal to-transparent z-10 pointer-events-none" />

          <div className="flex w-max gap-16 animate-marquee py-4 items-center">
            {/* Original track */}
            <div className="flex gap-16 items-center px-8">
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/511_copy_1-300x84.jpg"
                alt="5.11"
                className="h-9 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Belleville_3-300x101.jpg"
                alt="Belleville"
                className="h-11 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/condor_logo-300x66.png"
                alt="Condor"
                className="h-7 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/download-300x80.png"
                alt="Bates"
                className="h-9 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Propper-300x48.jpg"
                alt="Propper"
                className="h-6 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Reebok-300x66.jpg"
                alt="Reebok"
                className="h-7 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Rothco_Small_1.jpg"
                alt="Rothco"
                className="h-8 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Tru-Spec-300x143.jpg"
                alt="Tru Spec"
                className="h-12 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/b13c3c6c-22dc-41a8-923b-7d9e38ded008-300x162.png"
                alt="Grunt Style"
                className="h-10 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/timberland-logo-300x300.png"
                alt="Timberland"
                className="h-10 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
            {/* Duplicated track for seamless loop */}
            <div className="flex gap-16 items-center px-8">
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/511_copy_1-300x84.jpg"
                alt="5.11"
                className="h-9 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Belleville_3-300x101.jpg"
                alt="Belleville"
                className="h-11 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/condor_logo-300x66.png"
                alt="Condor"
                className="h-7 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/download-300x80.png"
                alt="Bates"
                className="h-9 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Propper-300x48.jpg"
                alt="Propper"
                className="h-6 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Reebok-300x66.jpg"
                alt="Reebok"
                className="h-7 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Rothco_Small_1.jpg"
                alt="Rothco"
                className="h-8 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2019/10/Tru-Spec-300x143.jpg"
                alt="Tru Spec"
                className="h-12 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/b13c3c6c-22dc-41a8-923b-7d9e38ded008-300x162.png"
                alt="Grunt Style"
                className="h-10 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
              <img
                src="https://alliedsurplus.com/wp-content/uploads/2021/02/timberland-logo-300x300.png"
                alt="Timberland"
                className="h-10 w-auto grayscale brightness-[0.7] opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="relative py-24 bg-olive overflow-hidden group">
        {/* DIAGONAL PATTERN OVERLAY */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`,
          }}
        />

        <div className="container max-w-[1340px] px-8 mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* LEFT SIDE: TEXT */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[2px] w-5 bg-white" />
                <span className="font-head text-[11px] font-bold tracking-[0.25em] text-white uppercase">
                  STAY INFORMED
                </span>
              </div>
              <h2 className="font-head text-[56px] md:text-[68px] font-extrabold text-white uppercase leading-[0.9] tracking-tight">
                JOIN THE <br />
                IRONFORGE <br />
                COMMUNITY
              </h2>
              <p className="text-white/80 text-[16px] leading-relaxed max-w-[480px]">
                Get exclusive access to new arrivals, product reviews,
                field-tested guides, and member-only discounts delivered
                straight to your inbox.
              </p>
            </div>

            {/* RIGHT SIDE: FORM */}
            <div className="space-y-6">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  showToast("Subscription successful. Welcome!");
                }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full h-[60px] bg-black/20 border border-white/10 rounded-[2px] px-6 font-medium text-[14px] text-white placeholder:text-white focus:border-white/40 outline-none transition-all outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full h-[60px] bg-black/20 border border-white/10 rounded-[2px] px-6 font-medium text-[14px] text-white placeholder:text-white focus:border-white/40 outline-none transition-all outline-none"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Your Email Address"
                  required
                  className="w-full h-[60px] bg-black/20 border border-white/10 rounded-[2px] px-6 font-medium text-[14px] text-white placeholder:text-white/40 focus:border-white/40 outline-none transition-all outline-none"
                />
                <button
                  type="submit"
                  className="w-full h-[64px] bg-black text-white font-head text-[14px] font-bold tracking-[0.2em] uppercase rounded-[2px] hover:bg-white hover:text-black transition-all active:translate-y-1 shadow-2xl flex items-center justify-center gap-3"
                >
                  <SendHorizontal size={18} /> SUBSCRIBE TO NEWSLETTER
                </button>
              </form>
              <p className="text-[12px] text-white/50 leading-relaxed font-medium">
                By subscribing you agree to our{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                . We never share your data. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TOAST PANEL */}
      <AnimatePresence>
        {toastVisible && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[1000] bg-gold text-ink font-head font-bold text-[13px] uppercase tracking-[0.12em] px-8 py-4 rounded-[3px] shadow-2xl flex items-center gap-3 italic"
          >
            <Sparkles size={18} /> {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
        .view-link:hover .view-link-arrow {
          transform: translateX(6px);
        }
      `}</style>
    </div>
  );
}
