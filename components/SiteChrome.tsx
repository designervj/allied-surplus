"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Search,
  ShoppingCart,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Menu,
  X,
  MapPin,
  User,
  Heart,
  Truck,
  Phone,
  Mail,
  Star,
  Terminal,
  LogOut,
  Globe,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, usePathname } from "next/navigation";
import { Link, useParams } from "@/lib/router";
import { selectCartCount } from "@/lib/store/cart/cartSlice";
import Image from "next/image";
import { logout } from "@/lib/store/auth/authSlice";
import { logoutThunk } from "@/lib/store/auth/authThunks";
import { AppDispatch, RootState } from "@/lib/store/store";
import { cn, getWithExpiry, setWithExpiry } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  loadCurrencyFromStorage,
  setCurrenyCurrency,
} from "@/lib/store/branding/brandingSlice";

const navLinks = [
  { label: "Sales", highlight: true, href: "/shop?badge=sale" },
  { label: "Apparel", href: "/category/apparel", hasMega: true },
  { label: "Footwear", href: "/category/footwear" },
  { label: "Tactical", href: "/category/tactical" },
  { label: "Brands", href: "/brands" },
  { label: "Dog Tags", href: "/custom-dog-tags" },
  { label: "What's New", href: "/shop?sort=newest" },
  { label: "Our Blog", href: "/blog" },
];

const defaultCategoryPanel = [
  "Apparel & Uniforms",
  "Footwear",
  "Tactical & Law Enforcement",
  "Backpacks & Bags",
  "Headwear",
  "Emergency Supplies",
  "Custom Dog Tags",
  "Gifts & Novelties",
  "Genuine Military Surplus",
];

type BrandLocation = {
  id: number | string;
  name: string;
  address: string;
  phone?: string;
  isPrimary?: boolean;
};

type BrandLogo = {
  id?: string | number;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
};

type BrandSocial = {
  platform: string;
  url: string;
  icon?: string;
  enabled?: boolean;
};

type BrandConfigType = {
  companyInfo?: {
    name?: string;
    tagline?: string;
    foundedYear?: string;
  };
  contact?: {
    primaryEmail?: string;
    supportEmail?: string;
    phoneDisplay?: boolean;
  };
  legal?: {
    companyLegalName?: string;
    privacyPolicyUrl?: string;
    termsUrl?: string;
    copyrightText?: string;
  };
  locations?: BrandLocation[];
  logos?: BrandLogo[];
  socialMedia?: BrandSocial[];
  languages?: {
    available?: {
      code: string;
      name: string;
      enabled: boolean;
    }[];
    default?: string;
  };
  currencies?: {
    available?: {
      code: string;
      name: string;
      enabled: boolean;
      symbol: string;
    }[];
    default?: string;
  };
};

export default function SiteChrome({
  children,
  brandConfig,
}: {
  children: React.ReactNode;
  brandConfig: BrandConfigType;
}) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [availableCategories] = useState(defaultCategoryPanel);
  const [isScrolled, setIsScrolled] = useState(false);

  const { currencyselector, config } = useAppSelector(
    (state) => state.branding,
  );

  const defaultCurrency = config?.currencies.default;

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (config) {
      dispatch(loadCurrencyFromStorage());
    }
  }, [config]);

  useEffect(() => {
    const fetchRates = async (defaultCurrent: string) => {
      const req = await fetch(
        `https://api.frankfurter.dev/v2/rates?base=${defaultCurrent}`,
      );
      const res = await req.json();
      const getCurrency = getWithExpiry("rates");
      if (!getCurrency) {
        setWithExpiry("rates", res, 24 * 60 * 60 * 1000);
      }
    };

    if (defaultCurrency) {
      fetchRates(defaultCurrency);
    }
  }, [defaultCurrency]);

  const { locale } = useParams<{ locale: string }>();
  const pathname = usePathname();

  const cartCount = useSelector(selectCartCount);
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.replace(segments.join("/") || "/");
  };

  const availableLanguages = useMemo(
    () => brandConfig?.languages?.available?.filter((l) => l.enabled) || [],
    [brandConfig?.languages?.available],
  );

  const availableCurrencies = useMemo(
    () => brandConfig?.currencies?.available?.filter((l) => l.enabled) || [],
    [brandConfig?.currencies?.available],
  );

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openCartDrawer = () => {
    router.push("/cart");
  };

  const companyName =
    brandConfig?.companyInfo?.name || "IRONFORGE TACTICAL SURPLUS";
  const companyTagline =
    brandConfig?.companyInfo?.tagline ||
    "America's trusted source for military surplus, tactical gear, and professional-grade equipment since 2001.";
  const foundedYear = brandConfig?.companyInfo?.foundedYear || "2001";

  const logo = brandConfig?.logos?.[0] || {
    url: "/assets/Image/footer-logo-2.webp",
    alt: "Footer Logo",
    width: 100,
    height: 100,
  };

  const locations = brandConfig?.locations || [];
  const primaryLocation =
    locations.find((loc) => loc.isPrimary) || locations[0] || null;

  const primaryPhone = primaryLocation?.phone || "";
  const primaryPhoneHref = primaryPhone.replace(/\D/g, "");

  const primaryEmail =
    brandConfig?.contact?.primaryEmail || "info@ironforgesurplus.com";

  const privacyUrl = brandConfig?.legal?.privacyPolicyUrl || "/privacy";
  const termsUrl = brandConfig?.legal?.termsUrl || "/terms";
  const copyrightText =
    brandConfig?.legal?.copyrightText ||
    `© ${new Date().getFullYear()} ${companyName}. | PRIVACY | TERMS`;

  const phoneDisplay = brandConfig?.contact?.phoneDisplay !== false;

  const enabledSocials = useMemo(
    () => (brandConfig?.socialMedia || []).filter((item) => item.enabled),
    [brandConfig?.socialMedia],
  );

  const renderSocialIcon = (platform: string) => {
    const normalized = platform.toLowerCase();

    if (normalized === "facebook") return <Facebook size={14} />;
    if (normalized === "instagram") return <Instagram size={14} />;
    if (normalized === "youtube") return <Youtube size={14} />;
    if (normalized === "twitter" || normalized === "x")
      return <Twitter size={14} />;

    if (normalized === "tiktok") {
      return (
        <span className="text-[11px] font-bold tracking-wide uppercase">
          TT
        </span>
      );
    }

    return (
      <span className="text-[11px] font-bold tracking-wide uppercase">
        {platform?.slice(0, 2) || "SM"}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-ink text-cream flex flex-col font-body selection:bg-gold selection:text-ink overflow-x-hidden">
      {/* MOBILE MENU OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 bg-black/80 z-[1000] transition-opacity duration-500 lg:hidden",
          isMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* MOBILE DRAWER */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-charcoal border-r border-white/10 z-[1001] transition-transform duration-500 lg:hidden flex flex-col",
          isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="h-[72px] border-b border-white/10 flex items-center justify-between px-6 bg-ink">
          <Link
            href="/"
            className="flex items-center gap-2"
            onClick={() => setIsMenuOpen(false)}
          >
            <div className="object-contain border border-olive-lt rounded-[2px] flex items-center justify-center overflow-hidden">
              <Image
                src={logo.url}
                alt={logo.alt || companyName}
                width={logo.width || 100}
                height={logo.height || 40}
                className="object-contain"
              />
            </div>
          </Link>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase mb-3 italic">
                Menu
              </p>
              <ul className="space-y-1">
                <li className="border-b border-white/5 last:border-0 py-2">
                  <Link
                    href="/shop?badge=sale"
                    className="text-red font-head text-[15px] font-bold tracking-wider flex items-center gap-2 uppercase italic"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Star size={14} fill="currentColor" /> Sales
                  </Link>
                </li>
                {navLinks
                  .filter((l) => l.label !== "Sales")
                  .map((link) => (
                    <li
                      key={link.label}
                      className="border-b border-white/5 last:border-0 py-3"
                    >
                      <Link
                        href={link.href}
                        className="text-white/80 font-head text-[15px] font-bold tracking-wider uppercase hover:text-gold transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase mb-3 italic">
                Support
              </p>
              <div className="flex flex-col gap-3">
                {user ? (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                    onClick={() => {
                      dispatch(logoutThunk());
                      setIsMenuOpen(false);
                    }}
                  >
                    <LogOut size={16} /> Log out
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User size={16} /> Login
                  </Link>
                )}
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart size={16} /> Wishlist
                </Link>
                <Link
                  href="/order-tracking"
                  className="flex  items-center gap-3 text-white/60 hover:text-gold text-sm transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Truck size={16} /> Order Tracking
                </Link>
                {user?.role !== "customer" && (
                  <Link
                    href="/admin"
                    className="flex p-1 border-2 border-gold bg-white text-black items-center gap-1.5 transition-colors"
                  >
                    <Terminal size={16} /> Admin
                  </Link>
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex flex-col gap-1">
                <p className="text-[12px] font-bold text-white italic underline underline-offset-4 decoration-gold/50">
                  Need Help?
                </p>
                <p className="text-[11px] text-white/40 leading-relaxed italic">
                  Direct line to support: Mon-Sat, 9AM-6PM
                </p>
              </div>

              {phoneDisplay && primaryPhone && (
                <a
                  href={`tel:${primaryPhoneHref}`}
                  className="flex items-center gap-3 text-gold hover:text-gold-lt font-head font-bold text-[16px] transition-colors"
                >
                  <Phone size={16} /> {primaryPhone}
                </a>
              )}

              {/* Mobile Language Switcher */}
              {availableLanguages.length > 1 && (
                <div className="pt-6 border-t border-white/10 space-y-3">
                  <p className="text-[10px] font-black tracking-[0.25em] text-white/30 uppercase italic">
                    Language
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          handleLanguageChange(lang.code);
                          setIsMenuOpen(false);
                        }}
                        className={cn(
                          "px-3 py-1.5 text-xs font-bold tracking-wider rounded-[2px] border transition-all",
                          locale === lang.code
                            ? "bg-gold text-ink border-gold"
                            : "bg-transparent text-white/60 border-white/10 hover:border-white/20",
                        )}
                      >
                        {lang.name.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 bg-dark border-t border-white/10 flex gap-4">
          {enabledSocials.map((social, idx) => (
            <a
              key={`${social.platform}-${idx}`}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 bg-charcoal border border-white/5 rounded-[2px] flex items-center justify-center text-white/40 hover:text-gold transition-colors"
              aria-label={social.platform}
            >
              {renderSocialIcon(social.platform)}
            </a>
          ))}
        </div>
      </aside>

      {/* TOPBAR (Desktop only) */}
      <div className="topbar bg-[#0a0b0a] border-b border-white/5 font-body text-[11px] text-white/50 hidden md:block">
        <div className="topbar__inner container flex items-center justify-between h-[42px] max-w-[1340px] px-6 mx-auto">
          {/* Left: Locations with tactical labels */}
          <div className="topbar__locations flex gap-10 items-center">
            {locations.slice(0, 2).map((loc, index) => (
              <div
                key={loc.id ?? index}
                className={cn(
                  "topbar__loc group flex items-center gap-3 transition-all cursor-default",
                  index === 1 ? "lg:flex hidden" : "",
                )}
              >
                <div className="h-6 w-6 rounded-sm bg-gold/5 border border-gold/10 flex items-center justify-center group-hover:bg-gold/10 group-hover:border-gold/30 transition-all">
                  <MapPin size={12} className="text-gold opacity-70 group-hover:opacity-100" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] font-head font-black tracking-[0.2em] text-gold/40 uppercase leading-none mb-0.5">
                    {loc.name.includes("PHOENIX") ? "TACTICAL HQ" : "REGIONAL HUB"}
                  </span>
                  <span className="text-white/70 font-bold tracking-tight whitespace-nowrap">
                    {loc.address} {loc.phone && <span className="text-white/20 mx-1.5">•</span>} {loc.phone}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Quick Links & Actions */}
          <div className="topbar__links flex gap-6 items-center ml-auto h-full">
            <nav className="flex items-center gap-5">
              {user ? (
                <Link
                  href="/login"
                  onClick={() => {
                    dispatch(logoutThunk());
                  }}
                  className="flex items-center gap-2 hover:text-gold transition-colors whitespace-nowrap uppercase font-black tracking-widest"
                >
                  <LogOut size={13} className="text-gold/50" /> <span>Log out</span>
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 hover:text-gold transition-colors whitespace-nowrap uppercase font-black tracking-widest"
                >
                  <User size={13} className="text-gold/50" /> <span>Login</span>
                </Link>
              )}
              
              <Link
                href="/wishlist"
                className="flex items-center gap-2 hover:text-gold transition-colors whitespace-nowrap uppercase font-black tracking-widest"
              >
                <Heart size={13} className="text-gold/50" /> <span>Wishlist</span>
              </Link>

              <Link
                href="/order-tracking"
                className="flex items-center gap-2 hover:text-gold transition-colors whitespace-nowrap uppercase font-black tracking-widest"
              >
                <Truck size={13} className="text-gold/50" /> <span>Tracking</span>
              </Link>
            </nav>

            <div className="h-4 w-px bg-white/5 mx-1" />

            <div className="flex items-center gap-4">
              {user?.role !== "customer" && (
                <Link
                  href="/admin"
                  className="flex h-7 px-3 bg-gold/5 border border-gold/20 items-center gap-2 text-gold/80 hover:bg-gold hover:text-ink transition-all whitespace-nowrap uppercase font-black tracking-tighter text-[10px] rounded-[2px] group"
                >
                  <Terminal size={12} className="group-hover:animate-pulse" /> 
                  <span>Admin Panel</span>
                </Link>
              )}

              {/* Language Switcher - Premium Style */}
              {availableLanguages.length > 1 && (
                <div className="flex items-center gap-2 pl-2 border-l border-white/5 group relative h-full cursor-pointer">
                  <div className="flex items-center gap-2 hover:text-white transition-colors">
                    <Globe size={13} className="text-gold/50 group-hover:text-gold" />
                    <span className="font-black uppercase tracking-widest text-[10px]">{locale}</span>
                    <ChevronDown size={10} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  
                  {/* Custom dropdown on hover or native select hidden? 
                      I'll use a styled native select for better accessibility but hide the default styling more aggressively. */}
                  <select
                    value={locale}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  >
                    {availableLanguages.map((lang) => (
                      <option
                        key={lang.code}
                        value={lang.code}
                        className="bg-ink text-white"
                      >
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* HEADER */}
      <header className="header bg-[#121311] border-b border-olive/30 sticky top-0 z-[900] shadow-2xl backdrop-blur-md">
        <div className="header__inner container flex items-center gap-4 lg:gap-10 h-[84px] max-w-[1340px] px-4 sm:px-8 mx-auto">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="lg:hidden h-11 w-11 flex items-center justify-center text-white/50 hover:text-gold transition-all border border-white/5 rounded-sm hover:bg-white/5"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            className="header__logo shrink-0 flex items-center group"
          >
            <div className="p-1 bg-white/5 border border-white/10 rounded-sm group-hover:border-gold/30 transition-all shadow-inner">
              <Image
                src={logo.url}
                alt={logo.alt || companyName}
                width={74}
                height={74}
                className="object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </Link>

          {/* Search */}
          <div className="header__search sm:flex flex-1 max-w-[520px] items-stretch border-[1.5px] border-mid rounded-[3px] overflow-hidden transition-all focus-within:border-olive-lt ml-2 lg:ml-4">
            <select className="search-category hidden lg:block bg-mid text-white/75 text-[11px] font-medium tracking-[0.03em] px-3 border-none cursor-pointer outline-none hover:bg-olive hover:text-white transition-all italic">
              <option>All Categories</option>
              <option>Apparel</option>
              <option>Footwear</option>
              <option>Gear</option>
            </select>
            <input
              type="text"
              placeholder="Search products..."
              className="flex-1 bg-dark border-none text-white px-3.5 text-[13px] md:text-[14px] outline-none placeholder:text-white/30 italic min-w-0"
            />
            <button className="search-btn bg-olive text-white px-4 flex items-center justify-center hover:bg-olive-lt transition-all">
              <Search size={18} strokeWidth={2.5} />
            </button>
          </div>

          {/* Actions */}
          <div className="header__actions ml-auto flex items-center gap-1.5 shrink-0">
            {user ? (
              <Link
                href="/account"
                className="hdr-action hidden md:flex flex-col items-center gap-[2px] px-3 py-2 rounded-[3px] text-white/75 text-[10px] tracking-[0.06em] uppercase hover:bg-white/5 hover:text-white transition-all group"
              >
                <User
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Account
              </Link>
            ) : (
              <Link
                href="/login"
                className="hdr-action hidden md:flex flex-col items-center gap-[2px] px-3 py-2 rounded-[3px] text-white/75 text-[10px] tracking-[0.06em] uppercase hover:bg-white/5 hover:text-white transition-all group"
              >
                <User
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                Login
              </Link>
            )}

            <button
              onClick={openCartDrawer}
              className="hdr-action flex flex-col items-center gap-[2px] px-3 py-2 rounded-[3px] text-white/75 text-[10px] tracking-[0.06em] uppercase hover:bg-white/5 hover:text-white transition-all group relative"
            >
              <ShoppingCart
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Cart</span>
              <span className="cart-badge absolute top-[5px] right-[8px] bg-red text-white text-[9px] font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                {cartCount}
              </span>
            </button>

            {phoneDisplay && primaryPhone && (
              <a
                href={`tel:${primaryPhoneHref}`}
                className="header__cta hidden md:flex bg-red text-white font-head text-[13px] font-bold tracking-[0.1em] uppercase px-4 md:px-5 py-2.5 rounded-[3px] hover:bg-red-lt transition-all active:translate-y-[1px] ml-1 sm:ml-2 flex items-center gap-2"
              >
                <Phone size={14} fill="currentColor" />
                <span className="hidden sm:inline">Call Us</span>
              </a>
            )}
          </div>
        </div>

        {/* MOBILE SEARCH BAR */}
        <div className="sm:hidden px-4 pb-3 flex">
          <div className="flex-1 flex items-stretch border border-white/10 rounded-[2px] overflow-hidden bg-dark">
            <input
              type="text"
              placeholder="Search our selection..."
              className="flex-1 bg-transparent px-3 text-[13px] italic text-white outline-none h-10"
            />
            <button className="bg-olive px-3 text-white">
              <Search size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* NAV (Desktop only) */}
      <nav className="nav bg-dark border-b border-white/6 relative z-[800] hidden lg:block">
        <div className="nav__inner container flex items-stretch max-w-[1340px] px-6 h-[48px] mx-auto">
          <button
            className="py-2 me-3 bg-olive flex items-center gap-2.5 px-5 font-head text-[14px] font-bold tracking-[0.1em] uppercase text-white hover:bg-olive-lt transition-all shrink-0 border-none group"
            onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          >
            <Menu size={18} strokeWidth={2} />
            Categories
            <ChevronDown
              size={14}
              strokeWidth={2.5}
              className={cn(
                "transition-transform",
                isCategoryOpen && "rotate-180",
              )}
            />
          </button>

          <ul className="nav__links flex items-stretch flex-1">
            <li className="nav-item flex items-stretch">
              <Link
                href="/shop?badge=sale"
                className="highlight text-red flex items-center gap-1.5 px-4.5 font-head text-[14px] font-bold tracking-[0.08em] uppercase hover:bg-white/5 transition-all"
              >
                <Star size={13} fill="currentColor" /> SPECIAL OFFERS
              </Link>
            </li>

            {navLinks
              .filter((l) => l.label !== "Sales")
              .map((link) => (
                <li
                  key={link.label}
                  className="nav-item group flex items-stretch relative"
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-1.5 px-[18px] font-head text-[14px] font-bold tracking-[0.08em] uppercase text-white/80 hover:text-gold hover:bg-white/5 transition-all outline-none"
                  >
                    {link.label}
                    {link.hasMega && (
                      <ChevronDown
                        size={10}
                        strokeWidth={2.5}
                        className="group-hover:rotate-180 transition-transform"
                      />
                    )}
                  </Link>

                  {link.hasMega && (
                    <div className="mega-menu absolute top-full left-0 bg-charcoal border border-white/7 border-t-2 border-t-olive shadow-lg min-w-[680px] p-7 grid grid-cols-4 gap-7 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto group-hover:translate-y-0 translate-y-2 transition-all duration-200 z-[900]">
                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Uniforms
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          ACU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          BDU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          ABU's
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Flight Suits
                        </Link>
                      </div>

                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Shirts
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Casual Shirts
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Short Sleeve
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Long Sleeve
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Grunt Style
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Erazor Bits
                        </Link>
                      </div>

                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Bottoms
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Pants
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Shorts
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Belts
                        </Link>
                      </div>

                      <div>
                        <div className="mega-col-title font-head text-[11px] font-bold tracking-[0.14em] uppercase text-gold pb-2.5 border-b border-white/10 mb-2.5">
                          Outerwear
                        </div>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Jackets
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          MA-1 Jackets
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Soft Shells
                        </Link>
                        <Link
                          href="/shop"
                          className="mega-link block text-[13px] text-white/65 py-1 hover:text-white hover:pl-1.5 transition-all"
                        >
                          Children & Infants
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              ))}
          </ul>
        </div>

        {/* Category Side Panel */}
        <div
          className={cn(
            "cat-panel absolute top-full left-0 w-[260px] bg-charcoal border border-white/7 border-t-2 border-t-olive shadow-lg z-[850] transition-all duration-200",
            isCategoryOpen
              ? "opacity-100 visible translate-y-0"
              : "opacity-0 invisible translate-y-1",
          )}
        >
          {availableCategories.map((cat) => (
            <div
              key={cat}
              className="cat-panel-item flex items-center justify-between px-[18px] py-2.5 text-[13px] text-white/75 hover:bg-white/5 hover:text-white transition-all cursor-pointer group italic"
            >
              <span>{cat}</span>
              <ChevronRight
                size={12}
                className="opacity-40 group-hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </nav>

      <main className="flex-1 w-full relative z-0">{children}</main>

      {/* FOOTER */}
      <footer className="footer bg-[#0a0b0a] border-t border-white/5 pt-20 pb-12 px-6 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container max-w-[1340px] mx-auto relative z-10">
          <div className="footer__grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
            {/* Brand - Sector 01 */}
            <div className="footer__brand space-y-8">
              <Link
                href="/"
                className="footer-logo inline-block group"
              >
                <div className="p-2 bg-white/5 border border-white/10 rounded-sm group-hover:border-gold/30 transition-all shadow-inner">
                  <Image
                    src={logo.url}
                    alt={logo.alt || companyName}
                    width={90}
                    height={90}
                    className="object-contain grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-110 transition-all duration-500"
                  />
                </div>
              </Link>

              <div className="space-y-4">
                <p className="text-[14px] text-white/50 leading-relaxed max-w-[300px] font-medium italic">
                  "{companyTagline}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 bg-gold/30" />
                  <span className="text-[10px] text-gold/60 uppercase font-black tracking-[0.3em]">
                    ESTABLISHED {foundedYear}
                  </span>
                </div>
              </div>

              <div className="footer-socials flex gap-3">
                {enabledSocials.map((social, idx) => (
                  <a
                    key={`${social.platform}-${idx}`}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn w-10 h-10 bg-white/5 border border-white/10 rounded-sm flex items-center justify-center text-white/40 hover:bg-gold hover:text-ink hover:border-gold transition-all group"
                    aria-label={social.platform}
                  >
                    <div className="group-hover:scale-110 transition-transform">
                      {renderSocialIcon(social.platform)}
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Categories - Sector 02 */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <h4 className="font-head text-[16px] font-black text-white uppercase tracking-[0.2em]">
                  Top Categories
                </h4>
              </div>
              <ul className="footer-links flex flex-col gap-4 text-[13px] text-white/40 font-black uppercase tracking-widest">
                {[
                  "Apparel & Uniforms",
                  "Tactical Pants & Shirts",
                  "Military Footwear",
                  "Backpacks & Bags",
                  "Custom Dog Tags"
                ].map((item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="hover:text-gold hover:pl-2 transition-all flex items-center gap-2 group"
                    >
                      <ChevronRight size={12} className="text-gold opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Mission Support - Sector 03 */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <h4 className="font-head text-[16px] font-black text-white uppercase tracking-[0.2em]">
                  Mission Support
                </h4>
              </div>
              <ul className="footer-links flex flex-col gap-4 text-[13px] text-white/40 font-black uppercase tracking-widest">
                {[
                  { label: "Privacy Policy", href: privacyUrl },
                  { label: "Customer Service", href: "/faq" },
                  { label: "Shipping & Delivery", href: "/shipping" },
                  { label: "Returns & Replacement", href: "/returns" },
                  { label: "Contact Command", href: "/contact" }
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-gold hover:pl-2 transition-all flex items-center gap-2 group"
                    >
                      <ChevronRight size={12} className="text-gold opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Command - Sector 04 */}
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                <h4 className="font-head text-[16px] font-black text-white uppercase tracking-[0.2em]">
                  Command Center
                </h4>
              </div>

              <div className="footer-contact flex flex-col gap-8">
                {locations.map((loc, index) => (
                  <div
                    key={loc.id ?? index}
                    className="footer-contact-item flex gap-4 items-start group"
                  >
                    <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-all shrink-0">
                      <MapPin size={14} className="text-gold opacity-50 group-hover:opacity-100" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-white/80 font-black text-[11px] uppercase tracking-widest leading-none">
                        {loc.name}
                      </h5>
                      <p className="text-[12px] text-white/40 font-medium leading-relaxed">
                        {loc.address}
                      </p>
                      {loc.phone && phoneDisplay && (
                        <a
                          href={`tel:${loc.phone.replace(/\D/g, "")}`}
                          className="text-[12px] text-gold/60 hover:text-gold font-black transition-colors"
                        >
                          {loc.phone}
                        </a>
                      )}
                    </div>
                  </div>
                ))}

                <div className="footer-contact-item flex gap-4 items-start group">
                  <div className="w-8 h-8 rounded-sm bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-gold/30 transition-all shrink-0">
                    <Mail size={14} className="text-gold opacity-50 group-hover:opacity-100" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-white/80 font-black text-[11px] uppercase tracking-widest leading-none">
                      Secure Channel
                    </h5>
                    <a
                      href={`mailto:${primaryEmail}`}
                      className="text-[13px] text-gold/60 hover:text-gold font-black transition-colors break-all"
                    >
                      {primaryEmail}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom Bar */}
          <div className="footer__bottom mt-20 pt-10 border-t border-white/5 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="space-y-2 text-center lg:text-left">
              <p className="text-[10px] font-black tracking-[0.3em] uppercase text-white/20 italic">
                {copyrightText}
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-4">
                {["VISA", "MASTERCARD", "PAYPAL", "AMEX"].map((p) => (
                  <span
                    key={p}
                    className="text-[9px] font-black tracking-widest text-white/10 border border-white/5 px-2 py-0.5 rounded-sm"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="flex items-center gap-4 group">
                <div className="flex flex-col items-end">
                  <span className="text-[8px] font-black text-gold/40 uppercase tracking-widest leading-none">Currency</span>
                  <span className="text-[11px] font-black text-white/60 uppercase tracking-widest">Active Selector</span>
                </div>
                <div className="min-w-[140px]">
                  <Select
                    onValueChange={(value) => {
                      dispatch(setCurrenyCurrency(value));
                    }}
                    value={currencyselector || ""}
                  >
                    <SelectTrigger className="h-10 bg-white/5 border-white/10 text-[11px] text-white font-black uppercase tracking-[0.2em] rounded-sm focus:ring-1 focus:ring-gold/30 hover:bg-white/[0.08] transition-all">
                      <SelectValue placeholder="CURRENCY" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#121311] border-gold/30 text-white font-black uppercase tracking-[0.15em] text-[10px]">
                      {availableCurrencies.map((d) => (
                        <SelectItem key={d.code} value={d.code} className="hover:bg-gold/10 focus:bg-gold/10">
                          {d.name} ({d.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <button
        className={cn(
          "back-to-top fixed bottom-8 right-8 w-11 h-11 bg-olive text-white rounded-full flex items-center justify-center transition-all duration-500 z-[999] shadow-xl hover:bg-olive-lt shadow-black/50 overflow-hidden group",
          isScrolled
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-8 pointer-events-none",
        )}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <ArrowUp
          size={18}
          className="group-hover:-translate-y-1 transition-transform"
        />
      </button>
    </div>
  );
}
