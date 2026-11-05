import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cart/cartSlice";
import { fetchProducts } from "../redux/products/productsSlice";
import "./Home.css";

const categories = [
  { id: "men", number: "01", name: "Men", note: "Tailored & street", style: "from-[#292824] via-[#72695c] to-[#3b3934]" },
  { id: "women", number: "02", name: "Women", note: "Fluid & bold", style: "from-[#6a453b] via-[#d06b4a] to-[#422e29]" },
  { id: "kids", number: "03", name: "Kids", note: "Playful & durable", style: "from-[#363351] via-[#7d68c4] to-[#343044]" },
  { id: "affiliate", number: "04", name: "Affiliate", note: "Earn with Orung", style: "from-[#47483f] via-[#a59a7d] to-[#3c3b35]" },
];

const previewProducts = [
  { _id: "orung-preview-jacket", name: "Overdyed Field Jacket", category: { name: "Men" }, price: 118, tag: "NEW", preview: true },
  { _id: "orung-preview-dress", name: "Silhouette Wrap Dress", category: { name: "Women" }, price: 96, tag: "BESTSELLER", preview: true },
  { _id: "orung-preview-hoodie", name: "Sketch Print Hoodie Set", category: { name: "Kids" }, price: 54, tag: "LIMITED", preview: true },
  { _id: "orung-preview-trench", name: "Studio Trench Coat", category: { name: "Women" }, price: 142, tag: "RESTOCKED", preview: true },
];

const buttonBase =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#121212] px-5 font-mono text-[10px] tracking-[.08em] transition hover:-translate-y-0.5";
const buttonDark = `${buttonBase} bg-[#121212] text-[#faf9f6] hover:border-[#ff4e1f] hover:bg-[#ff4e1f] hover:text-[#121212]`;
const buttonOutline = `${buttonBase} bg-transparent text-[#121212] hover:bg-[#121212] hover:text-[#faf9f6]`;
const kicker = "mb-4 flex items-center gap-3 font-mono text-[10px] tracking-[.16em] text-[#89847b]";
const sectionTitle =
  "m-0 max-w-[790px] font-display text-[clamp(42px,5.2vw,70px)] font-black uppercase leading-[.92] tracking-[-.015em]";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

function ProductArtwork({ index }) {
  const artworks = [
    <><rect width="300" height="400" fill="#232323" /><path d="M90 100 150 60l60 40-10 50H100Z" fill="#FF4E1F" /><rect x="110" y="150" width="80" height="200" fill="#3a3a3a" /></>,
    <><rect width="300" height="400" fill="#5c3a2e" /><path d="M150 60c-40 0-60 50-50 100l10 180h80l10-180c10-50-10-100-50-100Z" fill="#FF4E1F" /></>,
    <><rect width="300" height="400" fill="#2c2a4d" /><circle cx="150" cy="150" r="55" fill="#6C4CFF" /><rect x="110" y="200" width="80" height="140" rx="14" fill="#4a4870" /></>,
    <><rect width="300" height="400" fill="#3a3a34" /><path d="M80 120h140l-20 220h-100Z" fill="#8c8570" /><circle cx="150" cy="90" r="30" fill="#FF4E1F" /></>,
  ];

  return <svg className="size-full transition-transform duration-500 group-hover:scale-[1.06] group-hover:-rotate-1" viewBox="0 0 300 400" aria-hidden="true">{artworks[index]}</svg>;
}

function Home() {
  const dispatch = useDispatch();
  const { items: products, loading, error } = useSelector((state) => state.products);
  const { token } = useSelector((state) => state.auth);
  const [newsletterMessage, setNewsletterMessage] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".orung-reveal").forEach((section) => revealObserver.observe(section));
    return () => revealObserver.disconnect();
  }, []);

  const displayProducts = products.length ? products.slice(0, 4) : previewProducts;

  return (
    <div className="orung-page min-h-screen overflow-hidden bg-[#faf9f6] font-sans text-[#121212]" id="top">
      <main>
        <section className="mx-auto grid w-[min(100%-80px,1280px)] grid-cols-[1.5fr_1fr] items-end gap-10 pt-[70px] max-[1000px]:grid-cols-1 max-[1000px]:gap-0 max-[560px]:w-[calc(100%-40px)] max-[560px]:pt-[52px]">
          <div className="relative z-[1] pb-[42px] max-[560px]:pb-8">
            <p className="mb-5 flex items-center gap-3 font-mono text-[10px] tracking-[.16em] text-[#ff4e1f]">
              <span className="size-[7px] animate-pulse rounded-full bg-[#ff4e1f]" /> NEW SEASON — NOW LIVE
            </p>
            <h1 className="m-0 font-display text-[clamp(64px,8vw,112px)] font-black uppercase leading-[.79] tracking-[-.035em] max-[560px]:text-[clamp(48px,12vw,76px)]">
              <span className="block whitespace-nowrap">The Fashion</span>
              <span className="block whitespace-nowrap">You <em className="not-italic text-[#ff4e1f]">Imagined</em></span>
            </h1>
            <p className="mb-[30px] mt-7 max-w-[430px] text-[15px] leading-[1.75] text-[#47443f]">
              Orung turns the outfit in your head into the one on your back — for men,
              women and kids, styled by people who wear it too.
            </p>
            <div className="flex flex-wrap gap-[11px]">
              <Link className={buttonDark} to="/user/products/women">SHOP WOMEN <ArrowRight size={16} /></Link>
              <Link className={buttonOutline} to="/user/products/men">SHOP MEN <ArrowRight size={16} /></Link>
            </div>
          </div>

          <div className="relative flex min-h-[220px] items-end justify-center pb-2.5 max-[1000px]:min-h-[170px] max-[1000px]:items-center max-[560px]:min-h-[145px]" aria-hidden="true">
            <div className="relative size-[190px] max-[1000px]:size-[160px] max-[560px]:size-[135px]">
              <svg className="orung-seal-rotation absolute inset-0 size-full" viewBox="0 0 200 200">
                <defs><path id="orung-stamp-circle" d="M100,100 m-78,0 a78,78 0 1,1 156,0 a78,78 0 1,1 -156,0" /></defs>
                <text className="fill-[#121212] font-mono text-[11.5px] tracking-[3px]">
                  <textPath href="#orung-stamp-circle">ORUNG • THE FASHION YOU IMAGINED • ORUNG • THE FASHION YOU IMAGINED •</textPath>
                </text>
              </svg>
              <span className="absolute left-1/2 top-1/2 grid size-[66px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#121212]">
                <span className="orung-seal-mark relative grid size-8 place-items-center font-sans text-[25px] font-semibold leading-none text-[#faf9f6]">
                  O
                  <span className="absolute right-0 top-0 size-2 rounded-full bg-[#ff4e1f]" />
                </span>
              </span>
            </div>
          </div>

          <div className="col-span-full mt-14 flex justify-between gap-[18px] border-y border-[#121212]/15 py-4 font-mono text-[11px] tracking-[.08em] text-[#89847b] max-[560px]:mt-8 max-[560px]:flex-wrap max-[560px]:py-[13px] max-[560px]:text-[8px]">
            <span>EST. ORUNG</span><span className="max-[560px]:hidden">MEN — WOMEN — KIDS — AFFILIATE</span><span>FREE SHIPPING OVER $60</span>
          </div>
        </section>

        <div className="mt-0 overflow-hidden border-y border-[#121212] bg-[#121212] py-4 text-[#faf9f6]">
          <div className="orung-marquee-track flex w-max">
            {Array.from({ length: 2 }, (_, index) => (
              <span className="flex shrink-0 items-center gap-0 whitespace-nowrap font-display text-[26px] font-bold uppercase tracking-[.02em]" key={index} aria-hidden={index === 1}>
                <span className="px-7">NEW ARRIVALS</span><b className="text-xl text-[#ff4e1f]">✦</b><span className="px-7">MEN</span><b className="text-xl text-[#ff4e1f]">✦</b>
                <span className="px-7">WOMEN</span><b className="text-xl text-[#ff4e1f]">✦</b><span className="px-7">KIDS</span><b className="text-xl text-[#ff4e1f]">✦</b>
                <span className="px-7">BECOME AN AFFILIATE</span><b className="text-xl text-[#ff4e1f]">✦</b>
              </span>
            ))}
          </div>
        </div>

        <section className="orung-reveal mx-auto w-[min(100%-80px,1280px)] py-[110px] max-[560px]:w-[calc(100%-40px)] max-[560px]:py-20" aria-labelledby="category-title">
          <p className={kicker}>SHOP BY CATEGORY</p>
          <h2 className={sectionTitle} id="category-title">Wherever your imagination points, there&apos;s a rack for it.</h2>
          <div className="mt-14 grid grid-cols-4 gap-0.5 border border-[#121212] max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
            {categories.map((category) => {
              const content = (
                <>
                  <span className="absolute inset-0 overflow-hidden transition-transform duration-500 group-hover:scale-[1.08]" aria-hidden="true">
                    <span className="absolute left-[34%] top-[17%] size-[110px] rounded-full border border-[#faf9f6]/60" />
                    <span className={`absolute bottom-[19%] right-[17%] h-[42%] w-[35%] rounded-[48%_48%_5px_5px] border border-[#faf9f6]/60 ${category.id === "women" ? "h-[48%] w-[39%] rotate-[-8deg] bg-[#ff4e1f]/35" : ""} ${category.id === "kids" ? "h-[37%] w-[40%] rounded-[46%_46%_8px_8px] border-0 bg-[#6c4cff]/80" : ""} ${category.id === "affiliate" ? "h-[42%] w-[42%] rounded-full bg-[#faf9f6]/20" : ""}`} />
                  </span>
                  <span className="absolute right-[17px] top-[17px] z-[2] grid size-[37px] place-items-center rounded-full border border-[#faf9f6]/60 text-[#faf9f6] transition group-hover:rotate-45 group-hover:border-[#ff4e1f] group-hover:bg-[#ff4e1f]">
                    <ArrowUpRight size={20} />
                  </span>
                  <span className="relative z-[1] flex flex-col text-[#faf9f6]">
                    <span className="mb-2 font-mono text-[11px] uppercase tracking-[.08em] text-[#faf9f6]/80">{category.number} · {category.note}</span>
                    <strong className="font-display text-[38px] font-black uppercase leading-[.95]">{category.name}</strong>
                  </span>
                </>
              );
              const className = `group relative isolate flex aspect-[3/4] items-end overflow-hidden border-r border-[#121212] bg-gradient-to-br p-[26px] max-[1000px]:p-6 max-[560px]:border-r-0 max-[560px]:border-b last:border-r-0 max-[560px]:last:border-b-0 ${category.style} before:absolute before:inset-0 before:z-0 before:bg-gradient-to-b before:from-transparent before:from-[35%] before:to-black/80 before:content-['']`;
              return category.id === "affiliate" ? (
                <a className={`${className} max-[1000px]:border-r-0`} href="#affiliate" key={category.id}>{content}</a>
              ) : (
                <Link
                  className={`${className} ${category.id === "women" ? "max-[1000px]:border-r-0" : ""} ${category.id === "men" || category.id === "women" ? "max-[1000px]:border-b" : ""}`}
                  to={`/user/products/${category.id}`}
                  id={category.id}
                  key={category.id}
                >
                  {content}
                </Link>
              );
            })}
          </div>
        </section>

        <section className="orung-reveal mx-auto w-[min(100%-80px,1280px)] py-[110px] max-[560px]:w-[calc(100%-40px)] max-[560px]:py-20">
          <div className="grid grid-cols-[.9fr_1.1fr] items-center gap-[70px] max-[1000px]:grid-cols-1 max-[1000px]:gap-9">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-[#121212]/15 bg-[#f1efe9]">
              <svg className="size-full" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <rect width="400" height="400" fill="#F1EFE9" />
                <circle cx="200" cy="150" r="120" fill="none" stroke="#121212" strokeWidth="1.4" opacity="0.5" />
                <path d="M60,330 C120,220 280,220 340,330" fill="none" stroke="#FF4E1F" strokeWidth="10" strokeLinecap="round" />
                <circle cx="200" cy="150" r="46" fill="#6C4CFF" />
                <circle cx="200" cy="150" r="10" fill="#121212" />
              </svg>
            </div>
            <div>
              <p className={kicker}>OUR STORY</p>
              <p className="mb-[22px] mt-0 max-w-[560px] font-display text-[30px] font-bold leading-[1.25]">
                We built Orung on a simple bet: most people already know exactly what they want to wear — nobody makes it in their size, colour, or budget.
              </p>
              <p className="mb-[22px] max-w-[560px] text-[19px] leading-[1.65] text-[#45413b]">
                So we design in small batches, listen to what our community sketches in the comments, and ship the pieces that actually get requested. No warehouse of guesses — just the fit you pictured, made real.
              </p>
              <div className="mt-[30px] flex flex-wrap gap-[clamp(20px,4vw,54px)]">
                <div className="flex flex-col gap-1"><strong className="font-display text-[40px] leading-none text-[#ff4e1f]">120+</strong><span className="font-mono text-[9px] tracking-[.08em] text-[#89847b]">DROPS SHIPPED</span></div>
                <div className="flex flex-col gap-1"><strong className="font-display text-[40px] leading-none text-[#ff4e1f]">40K</strong><span className="font-mono text-[9px] tracking-[.08em] text-[#89847b]">STYLES IMAGINED</span></div>
                <div className="flex flex-col gap-1"><strong className="font-display text-[40px] leading-none text-[#ff4e1f]">4.8/5</strong><span className="font-mono text-[9px] tracking-[.08em] text-[#89847b]">FIT RATING</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="orung-reveal mx-auto w-[min(100%-80px,1280px)] py-[110px] max-[560px]:w-[calc(100%-40px)] max-[560px]:py-20" id="products" aria-labelledby="products-title">
          <div className="mb-[50px] flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className={kicker}>TRENDING NOW</p>
              <h2 className={`${sectionTitle} max-w-[700px]`} id="products-title">Picked by the people who imagined them first.</h2>
            </div>
            <Link className={`${buttonOutline} shrink-0`} to="/user/products/women">VIEW ALL PRODUCTS <ArrowRight size={16} /></Link>
          </div>

          {loading && products.length === 0 && (
            <p className="mb-5 text-sm text-[#89847b]" role="status">Loading the latest pieces…</p>
          )}
          {error && (
            <p className="mb-5 text-sm text-[#8b3c27]" role="alert">
              Live products couldn&apos;t be loaded. Showing the collection preview instead.
            </p>
          )}
          <div className="grid grid-cols-4 gap-7 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1">
              {displayProducts.map((product, index) => {
                const outOfStock = !product.preview && Number(product.quantity) <= 0;
                const categorySlug = product.category?.name?.toLowerCase() || "women";
                return (
                  <article className="min-w-0" key={product._id}>
                    <div className="group relative mb-4 aspect-[3/4] overflow-hidden rounded-[6px] border border-[#121212]/15 bg-[#f1efe9]">
                      <Link className="relative grid size-full place-items-center overflow-hidden" to={`/user/products/${categorySlug}`} aria-label={`View ${product.name}`}>
                        {product.image ? (
                          <img className="size-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} loading="lazy" />
                        ) : (
                          <ProductArtwork index={index % 4} />
                        )}
                        <span className="absolute left-3 top-3 rounded-full bg-[#121212] px-[9px] py-[5px] font-mono text-[10px] tracking-[.08em] text-[#faf9f6]">{product.tag || (index === 0 ? "NEW" : "ORUNG EDIT")}</span>
                      </Link>
                      <button
                        className="absolute bottom-3 right-3 grid size-[38px] translate-y-2 place-items-center rounded-full bg-[#faf9f6] text-lg opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 disabled:cursor-not-allowed disabled:opacity-70"
                        type="button"
                        aria-label={product.preview ? `${product.name} preview only` : outOfStock ? `${product.name} is sold out` : `Add ${product.name} to bag`}
                        disabled={product.preview || outOfStock}
                        onClick={() => dispatch(addToCart(product))}
                      >
                        +
                      </button>
                    </div>
                    <div className="flex justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="mb-1 overflow-hidden text-ellipsis whitespace-nowrap text-[15px] font-semibold">{product.name}</h3>
                        <span className="font-mono text-[10px] tracking-[.06em] text-[#89847b]">{product.category?.name || "ORUNG"}</span>
                      </div>
                      <span className="shrink-0 font-mono text-sm font-bold">{formatPrice(product.price)}</span>
                    </div>
                  </article>
                );
              })}
          </div>
        </section>

        <section className="orung-reveal mx-auto w-[min(100%-80px,1280px)] py-20 max-[560px]:w-[calc(100%-40px)]" id="affiliate">
          <div className="relative grid grid-cols-[1.2fr_1fr] items-center gap-[60px] overflow-hidden rounded-[14px] bg-[#121212] px-[60px] py-[70px] text-[#faf9f6] max-[1000px]:grid-cols-1 max-[1000px]:gap-10 max-[1000px]:px-[30px] max-[1000px]:py-[46px] max-[560px]:px-[24px]">
            <div className="pointer-events-none absolute -right-[175px] -top-[240px] size-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,78,31,.37),transparent_70%)]" />
            <div className="relative z-[1]">
              <p className={`${kicker} text-[#faf9f6]/60`}>ORUNG AFFILIATE</p>
              <h2 className="mb-[18px] mt-0 max-w-[600px] font-display text-[clamp(42px,5vw,67px)] font-black uppercase leading-[.91]">
                Your feed already has the taste. Now get paid for it.
              </h2>
              <p className="mb-6 max-w-[470px] text-base leading-[1.65] text-[#faf9f6]/75">
                Share the pieces you&apos;d wear anyway. Every link is tracked, every sale is paid out — no minimum followers, no gatekeeping.
              </p>
              <Link className={`${buttonBase} border-[#ff4e1f] bg-[#ff4e1f] font-bold hover:border-[#faf9f6] hover:bg-[#faf9f6]`} to="/signup">
                APPLY TO BECOME AN AFFILIATE <ArrowRight size={16} />
              </Link>
            </div>
            <ul className="relative z-[1] m-0 flex list-none flex-col gap-5 p-0">
              <li className="flex items-start gap-[13px] text-[14.5px] leading-[1.6] text-[#faf9f6]/90"><span className="grid size-[26px] shrink-0 place-items-center rounded-full border border-[#ff4e1f]/55 font-mono text-[11px] text-[#ff4e1f]">1</span> Earn up to 15% commission on every order you refer.</li>
              <li className="flex items-start gap-[13px] text-[14.5px] leading-[1.6] text-[#faf9f6]/90"><span className="grid size-[26px] shrink-0 place-items-center rounded-full border border-[#ff4e1f]/55 font-mono text-[11px] text-[#ff4e1f]">2</span> Get early access to drops before they go public.</li>
              <li className="flex items-start gap-[13px] text-[14.5px] leading-[1.6] text-[#faf9f6]/90"><span className="grid size-[26px] shrink-0 place-items-center rounded-full border border-[#ff4e1f]/55 font-mono text-[11px] text-[#ff4e1f]">3</span> Personal dashboard to track clicks, sales and payouts.</li>
              <li className="flex items-start gap-[13px] text-[14.5px] leading-[1.6] text-[#faf9f6]/90"><span className="grid size-[26px] shrink-0 place-items-center rounded-full border border-[#ff4e1f]/55 font-mono text-[11px] text-[#ff4e1f]">4</span> Paid out monthly — straight to your bank or wallet.</li>
            </ul>
            <ArrowDownRight className="pointer-events-none absolute -bottom-[60px] -right-[25px] text-[#ff4e1f]/15" size={190} strokeWidth={0.7} aria-hidden="true" />
          </div>
        </section>

        <section className="orung-reveal mx-auto w-[min(100%-80px,1280px)] max-[560px]:w-[calc(100%-40px)]">
          <div className="grid grid-cols-[1fr_auto] items-center gap-10 border-y border-[#121212]/15 py-14 max-[1000px]:grid-cols-1 max-[1000px]:gap-7">
            <div>
              <p className={`${kicker} mb-[9px]`}>STAY IN THE LOOP</p>
              <h2 className="m-0 font-display text-[clamp(30px,3.6vw,47px)] font-black uppercase leading-[.95]">Get the next drop before it drops.</h2>
            </div>
            <form
              className="flex min-w-[360px] border-b-[1.5px] border-[#121212] pb-2.5 max-[1000px]:min-w-0"
              onSubmit={(event) => {
                event.preventDefault();
                setNewsletterMessage("Newsletter signup isn’t connected yet.");
              }}
            >
              <label className="sr-only" htmlFor="orung-newsletter-email">Your email address</label>
              <input
                className="min-w-0 flex-1 border-0 bg-transparent font-sans text-[15px] text-[#121212] outline-none placeholder:text-[#89847b] focus:ring-0"
                id="orung-newsletter-email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
              <button className="inline-flex cursor-pointer items-center gap-2 border-0 bg-transparent font-mono text-[12px] tracking-[.1em] hover:text-[#ff4e1f]" type="submit">
                SUBSCRIBE <ArrowRight size={16} />
              </button>
            </form>
          </div>
          {newsletterMessage && <p className="mt-3 text-sm text-[#8b3c27]" role="status">{newsletterMessage}</p>}
        </section>
      </main>

      <footer className="mx-auto w-[min(100%-80px,1280px)] pb-[30px] pt-[70px] max-[560px]:w-[calc(100%-40px)]">
        <div className="mb-[70px] grid grid-cols-[1.4fr_repeat(4,1fr)] gap-10 max-[1000px]:grid-cols-2 max-[560px]:grid-cols-1 max-[560px]:gap-8">
          <div>
            <Link className="mb-[17px] inline-flex items-center gap-2.5 font-display text-[25px] font-black tracking-[.04em]" to="/">
              <span className="grid size-[31px] place-items-center rounded-full bg-[#121212] font-sans text-[17px] font-medium text-[#faf9f6]">O</span>ORUNG
            </Link>
            <p className="m-0 max-w-[265px] text-[13px] leading-[1.7] text-[#89847b]">
              The fashion you imagined, made for men, women and kids — and shared by the people who love it.
            </p>
          </div>
          <div className="flex flex-col items-start gap-[11px]">
            <h3 className="mb-2 mt-1 font-mono text-[9px] font-normal tracking-[.1em] text-[#89847b]">SHOP</h3>
            <Link className="text-[13px] hover:text-[#ff4e1f]" to="/user/products/men">Men</Link>
            <Link className="text-[13px] hover:text-[#ff4e1f]" to="/user/products/women">Women</Link>
            <Link className="text-[13px] hover:text-[#ff4e1f]" to="/user/products/kids">Kids</Link>
          </div>
          <div className="flex flex-col items-start gap-[11px]">
            <h3 className="mb-2 mt-1 font-mono text-[9px] font-normal tracking-[.1em] text-[#89847b]">ORUNG</h3>
            <a className="text-[13px] hover:text-[#ff4e1f]" href="#category-title">Our story</a>
            <a className="text-[13px] hover:text-[#ff4e1f]" href="#affiliate">Affiliate</a>
            <Link className="text-[13px] hover:text-[#ff4e1f]" to="/signup">Join the community</Link>
          </div>
          <div className="flex flex-col items-start gap-[11px]">
            <h3 className="mb-2 mt-1 font-mono text-[9px] font-normal tracking-[.1em] text-[#89847b]">HELP</h3>
            <Link className="text-[14px] hover:text-[#ff4e1f]" to={token ? "/customer/purchases" : "/login"}>Track order</Link>
            <Link className="text-[14px] hover:text-[#ff4e1f]" to="/cart">Returns</Link>
            <a className="text-[14px] hover:text-[#ff4e1f]" href="#products">Size guide</a>
            <Link className="text-[14px] hover:text-[#ff4e1f]" to="/login">Contact us</Link>
          </div>
          <div className="flex flex-col items-start gap-[11px]">
            <h3 className="mb-2 mt-1 font-mono text-[9px] font-normal tracking-[.1em] text-[#89847b]">LEGAL</h3>
            <a className="text-[14px] hover:text-[#ff4e1f]" href="#top">Privacy policy</a>
            <a className="text-[14px] hover:text-[#ff4e1f]" href="#top">Terms of service</a>
            <a className="text-[14px] hover:text-[#ff4e1f]" href="#top">Shipping info</a>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-[14px] border-t border-[#121212]/15 pt-[21px] font-mono text-[8px] tracking-[.08em] text-[#89847b]">
          <span>© {new Date().getFullYear()} ORUNG. ALL RIGHTS RESERVED.</span>
          <div className="flex gap-[18px]">
            <span>INSTAGRAM</span><span>TIKTOK</span><span>PINTEREST</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
