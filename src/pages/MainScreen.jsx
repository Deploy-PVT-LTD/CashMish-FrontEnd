import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import mobileimg from "../assets/hero-devices-bundle.jpg"
import appleIcon from "../assets/apple.png"
import samsungIcon from "../assets/samsung.png"
import googleIcon from "../assets/google.png"
import quickIphone from "../assets/quick-iphone.webp"
import quickSamsung from "../assets/quick-samsung.webp"
import quickGooglePixel from "../assets/quick-google-pixel.webp"
import quickTablets from "../assets/quick-tablets.webp"
import quickMacbooks from "../assets/quick-macbooks.png"
import quickLaptops from "../assets/quick-laptops.png"
import quickSmartwatches from "../assets/quick-smartwatches.webp"
import quickOtherElectronics from "../assets/quick-other-electronics.webp"
import {
  Search, ArrowRight, Truck, Zap, ShieldCheck, Star, Users, DollarSign, Package,
  MoreHorizontal, Smartphone, CircleDollarSign, Tablet, Laptop, Watch, Headphones, Lock,
} from "lucide-react";
import Header from "../components/layout/header.jsx";
import AboutUs from "./About.jsx";
import Chatbot from "../components/Chatbot.jsx";
import { BASE_URL } from "../lib/api";

const CATEGORIES = [
  { key: "iphone", label: "iPhone", icon: appleIcon },
  { key: "samsung", label: "Samsung", icon: samsungIcon },
  { key: "google", label: "Google", icon: googleIcon },
];

const STATS = [
  { icon: Star, value: "4.8/5", label: "Customer rating" },
  { icon: Users, value: "10,000+", label: "Devices purchased" },
  { icon: DollarSign, value: "$2.3M+", label: "Paid to customers" },
  { icon: Package, value: "Free shipping", label: "On all accepted devices" },
  { icon: ShieldCheck, value: "100% secure", label: "Your data, our priority" },
];

const STEPS = [
  { number: "1", icon: Smartphone, title: "Tell us about your device", desc: "Answer a few simple questions about its condition." },
  { number: "2", icon: Package, title: "Ship it free", desc: "We'll send you a prepaid shipping label." },
  { number: "3", icon: CircleDollarSign, title: "Get paid", desc: "Once your device is verified, we send your payment." },
];

// Quick links into the sell flow. iPhone/Samsung/Google Pixel are brands within
// the "Mobile Phones" category (so they skip straight to model selection); the
// rest are their own categories (managed in the admin Categories page).
const QUICK_CATEGORIES = [
  { label: "iPhones", categorySlug: "mobile-phones", brand: "Apple", icon: quickIphone },
  { label: "Samsung", categorySlug: "mobile-phones", brand: "Samsung", icon: quickSamsung },
  { label: "Google Pixel", categorySlug: "mobile-phones", brand: "Google", icon: quickGooglePixel },
  { label: "Tablets", categorySlug: "tablets", icon: quickTablets },
  { label: "MacBooks", categorySlug: "macbooks", icon: quickMacbooks },
  { label: "Laptops", categorySlug: "laptops", icon: quickLaptops },
  { label: "Smartwatches", categorySlug: "smartwatches", icon: quickSmartwatches },
  { label: "Other Electronics", categorySlug: "other-electronics", icon: quickOtherElectronics },
];

const PhoneFlipLanding = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("iphone");
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchBoxRef = useRef(null);
  const [allCategories, setAllCategories] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/api/categories`)
      .then((res) => res.json())
      .then((data) => setAllCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Error fetching categories:", err));

    fetch(`${BASE_URL}/api/reviews/approved`)
      .then((res) => res.json())
      .then((data) => setReviews(Array.isArray(data) ? data.slice(0, 3) : []))
      .catch((err) => console.error("Error fetching reviews:", err));
  }, []);

  // Some reviews already have their own quote marks in the description, some
  // don't — strip either way so we can wrap them consistently ourselves.
  const stripQuotes = (text) => (text || "").trim().replace(/^["“]+|["”]+$/g, "");

  const handleQuickCategorySelect = (tile) => {
    const category = allCategories.find((c) => c.slug === tile.categorySlug);
    if (!category) {
      // Category isn't live yet (e.g. not seeded/active) — fall back to the
      // normal picker rather than sending the customer into a dead end.
      navigate("/categoryselection");
      return;
    }

    [
      "selectedBrand", "selectedModel", "selectedMobileId", "selectedMobileImage",
      "selectedCarrier", "selectedStorage", "selectedCondition",
      "screenCondition", "bodyCondition", "batteryCondition", "conditionAnswers", "estimatedPrice",
    ].forEach((key) => localStorage.removeItem(key));

    localStorage.setItem("selectedCategory", category.slug);
    localStorage.setItem("selectedCategoryName", category.name);
    localStorage.setItem("selectedCategoryData", JSON.stringify(category));

    if (tile.brand) {
      // Brand already known (iPhone/Samsung/Google Pixel tiles) — skip straight
      // to model selection instead of making them pick the brand again.
      localStorage.setItem("selectedBrand", tile.brand);
      navigate("/modelselection");
    } else {
      navigate("/brandselection");
    }
  };

  // Shared by both "click a dropdown suggestion" and "submit the search form" —
  // pre-fills category/brand/model so the flow skips straight to condition.
  const selectMobileAndGo = (match) => {
    const category = allCategories.find((c) => c.slug === match.category);

    [
      "selectedBrand", "selectedModel", "selectedMobileId", "selectedMobileImage",
      "selectedCarrier", "selectedStorage", "selectedCondition",
      "screenCondition", "bodyCondition", "batteryCondition", "conditionAnswers", "estimatedPrice",
    ].forEach((key) => localStorage.removeItem(key));

    if (category) {
      localStorage.setItem("selectedCategory", category.slug);
      localStorage.setItem("selectedCategoryName", category.name);
      localStorage.setItem("selectedCategoryData", JSON.stringify(category));
    }
    localStorage.setItem("selectedBrand", match.brand);
    localStorage.setItem("selectedModel", match.phoneModel);
    localStorage.setItem("selectedMobileId", match._id);
    if (match.image) localStorage.setItem("selectedMobileImage", match.image);

    setShowSuggestions(false);
    // Category, brand, and model are all already known — skip straight to condition.
    navigate("/conditionselection");
  };

  const searchMobiles = async (query) => {
    // Escape regex special characters — the backend builds a RegExp directly
    // from this string, so unescaped input (e.g. unbalanced parentheses) can crash it.
    const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const res = await fetch(`${BASE_URL}/api/mobiles?search=${encodeURIComponent(safeQuery)}&limit=8`);
    const data = await res.json();
    return Array.isArray(data.mobiles) ? data.mobiles : [];
  };

  // Live suggestions dropdown as the customer types (debounced).
  useEffect(() => {
    const query = search.trim();
    if (query.length < 2) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      setShowSuggestions(false);
      return;
    }
    setSuggestionsLoading(true);
    setShowSuggestions(true);
    const timer = setTimeout(() => {
      searchMobiles(query)
        .then((results) => setSuggestions(results))
        .catch((err) => console.error("Suggestion search error:", err))
        .finally(() => setSuggestionsLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Close the dropdown when clicking outside the search box.
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) {
      navigate("/categoryselection");
      return;
    }

    setSearching(true);
    setSearchError("");
    try {
      const results = await searchMobiles(query);

      if (results.length === 0) {
        setSearchError(`No device found matching "${query}" — try browsing by category instead.`);
        return;
      }

      // Prefer a result whose full name actually contains the typed text
      // (the backend's regex search can be a looser partial match).
      const lowerQuery = query.toLowerCase();
      const match = results.find((m) => `${m.brand} ${m.phoneModel}`.toLowerCase().includes(lowerQuery)) || results[0];

      selectMobileAndGo(match);
    } catch (err) {
      console.error("Search error:", err);
      setSearchError("Something went wrong searching — please try browsing by category instead.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-14 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT */}
          <div>
            <p className="text-green-700 font-bold text-[11px] sm:text-xs tracking-[0.15em] uppercase mb-3 sm:mb-4">
              Same Devices. A Brighter Tomorrow.
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-black text-gray-900 leading-[1.08] mb-4 sm:mb-5 tracking-tight">
              Turn your old tech
              <br />
              <span className="text-green-700">into cash.</span>
            </h1>

            <p className="text-base sm:text-lg font-medium text-gray-600 mb-7 sm:mb-8 lg:whitespace-nowrap">
              Get an instant offer for your device in less than 60 seconds.
            </p>

            {/* Category quick-picks */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.key}
                  type="button"
                  onClick={() => setActiveCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeCategory === cat.key
                    ? "bg-green-800 text-white shadow-sm"
                    : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <img
                    src={cat.icon}
                    alt=""
                    className={`w-4 h-4 object-contain ${activeCategory === cat.key ? "brightness-0 invert" : ""}`}
                  />
                  {cat.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setActiveCategory("other")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${activeCategory === "other"
                  ? "bg-green-800 text-white shadow-sm"
                  : "bg-gray-50 text-gray-700 border border-gray-200 hover:border-gray-300"
                  }`}
              >
                <MoreHorizontal className="w-4 h-4" />
                Other
              </button>
            </div>

            {/* Search / instant quote bar */}
            <div ref={searchBoxRef} className="relative max-w-xl mb-2">
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-1.5 bg-white border border-gray-200 rounded-2xl sm:rounded-full shadow-sm p-1.5"
              >
                <div className="flex items-center flex-1 min-w-0 px-3 sm:px-4">
                  <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                  <input
                    value={search}
                    onChange={(e) => { setSearch(e.target.value); if (searchError) setSearchError(""); }}
                    onFocus={() => { if (search.trim().length >= 2) setShowSuggestions(true); }}
                    placeholder="Search your device by name (e.g. iPhone 15 Pro Max)"
                    className="w-full min-w-0 outline-none text-sm py-2.5 placeholder:text-gray-400"
                    autoComplete="off"
                  />
                </div>
                <button
                  type="submit"
                  disabled={searching}
                  className="bg-green-800 hover:bg-green-700 disabled:opacity-60 text-white font-semibold text-sm px-6 py-3 rounded-full flex items-center justify-center gap-2 whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {searching ? "Searching..." : "Get My Cash Offer"}
                  {!searching && <ArrowRight className="w-4 h-4" />}
                </button>
              </form>

              {/* Live suggestions dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 sm:right-auto sm:w-[calc(100%-9.5rem)] top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-30 overflow-hidden max-h-80 overflow-y-auto">
                  {suggestionsLoading ? (
                    <div className="px-4 py-3 text-sm text-gray-400">Searching...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((m) => (
                      <button
                        key={m._id}
                        type="button"
                        onClick={() => selectMobileAndGo(m)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-green-50 transition-colors text-left cursor-pointer"
                      >
                        {m.image ? (
                          <img src={m.image} alt="" className="w-8 h-8 object-contain rounded-lg bg-gray-50 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-gray-50 shrink-0" />
                        )}
                        <span className="text-sm font-semibold text-gray-800 truncate">
                          {m.brand} {m.phoneModel}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-400">No matching devices</div>
                  )}
                </div>
              )}
            </div>
            <p className={`text-xs text-red-500 max-w-xl ${searchError ? "mb-4" : "mb-6"}`}>
              {searchError || " "}
            </p>

            {/* Trust row */}
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-gray-700">
              <span className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-green-700" strokeWidth={1.5} />
                Free shipping
              </span>
              <span className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-700" strokeWidth={1.5} />
                Fast payment
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-green-700" strokeWidth={1.5} />
                Secure data handling
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative flex justify-center lg:justify-end pt-4 lg:pt-0">
            {/* Handwritten note */}
            <div className="hidden sm:flex absolute -top-2 right-4 lg:right-0 items-start gap-1 z-20 text-gray-700">
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none" className="mt-1 -scale-x-100 rotate-[20deg]">
                <path d="M4 4C4 16 10 26 28 28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M20 25L28 28L26 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="font-handwritten text-2xl leading-6 mt-0.5">
                Good for<br />you. Better<br />for tomorrow.
              </p>
            </div>

            {/* Soft green backdrop */}
            <div className="absolute w-[95%] aspect-square bg-green-100/70 rounded-full -z-10 top-1/2 -translate-y-1/2" />

            {/* The source photo has its own flat background — fade it out at the
                edges so it blends into the green backdrop instead of showing a
                hard rectangle. */}
            <img
              src={mobileimg}
              alt="Sell your iPhone, Samsung, and other devices for instant cash"
              className="relative w-[90%] sm:w-[80%] lg:w-full max-w-xl"
              style={{
                maskImage: "radial-gradient(ellipse 62% 62% at center, black 55%, transparent 85%)",
                WebkitMaskImage: "radial-gradient(ellipse 62% 62% at center, black 55%, transparent 85%)",
              }}
            />
          </div>
        </div>
      </main>

      {/* Stats strip */}
      <div className="w-full mt-6 sm:mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-y-8 gap-x-4">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex items-center gap-4 px-2 sm:px-4 ${i > 0 ? "lg:border-l lg:border-gray-100" : ""}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 bg-green-700">
                  <stat.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <div className="text-base sm:text-lg font-extrabold text-gray-900 leading-tight">{stat.value}</div>
                  <div className="text-xs sm:text-sm font-semibold text-gray-500 leading-tight">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How CashMish Works + Category Quick Links */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-green-700 font-bold text-xs sm:text-sm tracking-[0.15em] uppercase mb-3">
            How CashMish Works
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            From your drawer to dollars in 3 steps.
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-8 sm:gap-3 mb-16 sm:mb-20">
          {STEPS.map((step, i) => (
            <React.Fragment key={step.number}>
              <div className="flex items-center gap-4 max-w-xs">
                <div className="w-8 h-8 rounded-full bg-green-800 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {step.number}
                </div>
                <step.icon className="w-11 h-11 sm:w-12 sm:h-12 text-green-700 shrink-0" strokeWidth={1.5} />
                <div>
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{step.title}</h3>
                  <p className="text-xs sm:text-[13px] text-gray-500 leading-relaxed">{step.desc}</p>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden sm:block flex-1 h-px bg-gray-200 max-w-[48px]" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="text-center mb-8">
          <p className="text-green-700 font-bold text-xs sm:text-sm tracking-[0.15em] uppercase">
            What Are You Ready To CashMish?
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((tile) => (
            <button
              key={tile.label}
              type="button"
              onClick={() => handleQuickCategorySelect(tile)}
              className="flex flex-col items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:border-green-200 hover:shadow-md transition-all cursor-pointer bg-white"
            >
              <div className="w-16 h-16 flex items-center justify-center">
                {typeof tile.icon === "string" ? (
                  <img src={tile.icon} alt="" className="w-16 h-16 object-contain" />
                ) : (
                  <tile.icon className="w-8 h-8 text-green-700" strokeWidth={1.5} />
                )}
              </div>
              <span className="text-xs font-semibold text-gray-700 text-center leading-tight">
                {tile.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Reviews + Security */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-14">
          {/* Reviews */}
          <div className="lg:col-span-3">
            <div className="flex flex-wrap items-end justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <p className="text-green-700 font-bold text-xs sm:text-sm tracking-[0.15em] uppercase mb-3">
                  Thousands Of Happy Sellers
                </p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                  Real people. Real experiences.
                </h2>
              </div>
              <a
                href="/reviews"
                className="border border-green-700 text-green-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors whitespace-nowrap"
              >
                Write a Review
              </a>
            </div>

            {reviews.length > 0 ? (
              <div className="grid sm:grid-cols-3 gap-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border border-gray-100 rounded-2xl p-5 bg-white">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${i < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                      "{stripQuotes(review.description)}"
                    </p>
                    <p className="text-xs font-semibold text-gray-400">— {review.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No reviews yet.</p>
            )}
          </div>

          {/* Security blurb */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row lg:flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
              <Lock className="w-6 h-6 text-green-700" strokeWidth={2} />
            </div>
            <div>
              <p className="text-green-700 font-bold text-xs sm:text-sm tracking-[0.15em] uppercase mb-3">
                Your Data. Your Privacy.
              </p>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
                We take your security seriously.
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-5">
                We follow industry-leading data deletion processes to ensure your personal information is completely removed from your device.
              </p>
              <a
                href="/privacy"
                className="inline-flex items-center gap-2 border border-green-700 text-green-700 font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-green-50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <AboutUs />
      <div className="cursor-pointer">
        <Chatbot />
      </div>
    </div>
  );
};

export default PhoneFlipLanding;
