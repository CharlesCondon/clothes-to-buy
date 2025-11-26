import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: "URL is required" },
                { status: 400 }
            );
        }

        // Validate URL format
        let validUrl: URL;
        try {
            validUrl = new URL(url);
        } catch {
            return NextResponse.json(
                { error: "Invalid URL format" },
                { status: 400 }
            );
        }

        // Fetch the page HTML
        const response = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate, br",
                Connection: "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Cache-Control": "max-age=0",
            },
        });

        if (!response.ok) {
            if (response.status === 403) {
                return NextResponse.json(
                    {
                        error: "Unable to access this website. The site may be blocking automated requests. Please try manually entering the product details.",
                        blocked: true,
                    },
                    { status: 403 }
                );
            }

            return NextResponse.json(
                { error: "Failed to fetch the product page" },
                { status: response.status }
            );
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Initialize product data
        const productData: {
            name: string | null;
            brand: string | null;
            price: number | null;
            salePrice: number | null;
            currency: string | null;
            image_url: string | null;
            category: string | null;
        } = {
            name: null,
            brand: null,
            price: null,
            salePrice: null,
            currency: null,
            image_url: null,
            category: null,
        };

        // 1. Try to extract from JSON-LD structured data
        $('script[type="application/ld+json"]').each((_, element) => {
            try {
                const jsonData = JSON.parse($(element).html() || "{}");

                // Handle single object or array of objects
                const products = Array.isArray(jsonData)
                    ? jsonData
                    : [jsonData];

                for (const item of products) {
                    if (item["@type"] === "Product") {
                        if (!productData.name && item.name) {
                            productData.name = item.name;
                        }

                        if (!productData.brand && item.brand) {
                            productData.brand =
                                typeof item.brand === "string"
                                    ? item.brand
                                    : item.brand.name;
                        }

                        if (!productData.price && item.offers) {
                            const offers = Array.isArray(item.offers)
                                ? item.offers[0]
                                : item.offers;

                            if (offers.price) {
                                productData.price = parseFloat(offers.price);
                            }

                            if (offers.priceCurrency) {
                                productData.currency = offers.priceCurrency;
                            }

                            if (offers.priceSpecification) {
                                const specs = Array.isArray(
                                    offers.priceSpecification
                                )
                                    ? offers.priceSpecification
                                    : [offers.priceSpecification];

                                // extract valid numeric prices
                                const specPrices = specs
                                    .map((s: { price: string }) =>
                                        parseFloat(s.price)
                                    )
                                    .filter((p: number) => !isNaN(p));

                                if (specPrices.length > 0) {
                                    const highest = Math.max(...specPrices);
                                    const lowest = Math.min(...specPrices);

                                    // Highest price = original price
                                    if (!productData.price) {
                                        productData.price = highest;
                                    }

                                    // Lowest price = sale price (only if different)
                                    if (lowest !== highest) {
                                        productData.salePrice = lowest;
                                    }

                                    // Prefer priceCurrency inside priceSpecification if missing
                                    if (!productData.currency) {
                                        const c = specs.find(
                                            (s: { priceCurrency: number }) =>
                                                s.priceCurrency
                                        )?.priceCurrency;
                                        if (c) productData.currency = c;
                                    }
                                }
                            }
                        }

                        if (!productData.image_url && item.image) {
                            const image = Array.isArray(item.image)
                                ? item.image[0]
                                : item.image;
                            productData.image_url =
                                typeof image === "string" ? image : image.url;
                        }
                    }
                }
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
                // Skip invalid JSON-LD
            }
        });

        // 2. Extract from Open Graph meta tags
        if (!productData.name) {
            productData.name =
                $('meta[property="og:title"]').attr("content") ||
                $('meta[name="og:title"]').attr("content") ||
                $('meta[property="twitter:title"]').attr("content") ||
                $("title").text() ||
                null;
        }

        if (!productData.image_url) {
            productData.image_url =
                $('meta[property="og:image"]').attr("content") ||
                $('meta[name="og:image"]').attr("content") ||
                $('meta[property="twitter:image"]').attr("content") ||
                null;
        }

        if (!productData.price) {
            const priceContent =
                $('meta[property="og:price:amount"]').attr("content") ||
                $('meta[property="product:price:amount"]').attr("content") ||
                null;

            if (priceContent) {
                productData.price = parseFloat(priceContent);
            }

            // Try to get currency from meta tags
            if (!productData.currency) {
                productData.currency =
                    $('meta[property="og:price:currency"]').attr("content") ||
                    $('meta[property="product:price:currency"]').attr(
                        "content"
                    ) ||
                    null;
            }
        }

        // 3. Extract brand from meta tags
        if (!productData.brand) {
            productData.brand =
                $('meta[property="og:brand"]').attr("content") ||
                $('meta[property="product:brand"]').attr("content") ||
                $('meta[name="brand"]').attr("content") ||
                null;
        }

        // 4. Fallback: Try common selectors for price
        if (!productData.price) {
            const priceSelectors = [
                ".price",
                '[class*="price"]',
                '[id*="price"]',
                "[data-price]",
                'span[itemprop="price"]',
            ];

            for (const selector of priceSelectors) {
                const priceText = $(selector).first().text();
                const priceMatch = priceText.match(/[\d,]+\.?\d*/g);
                if (priceMatch) {
                    const cleanPrice = priceMatch[0].replace(/,/g, "");
                    productData.price = parseFloat(cleanPrice);
                    if (!isNaN(productData.price)) break;
                }
            }
        }

        // 5. Attempt to categorize based on URL and title
        if (!productData.category) {
            const textToAnalyze = `${url} ${
                productData.name || ""
            }`.toLowerCase();

            if (textToAnalyze.match(/\b(shirt|tee|blouse|top|tank|polo)\b/i)) {
                productData.category = "shirts";
            } else if (
                textToAnalyze.match(/\b(pant|jean|trouser|short|skirt)\b/i)
            ) {
                productData.category = "pants";
            } else if (
                textToAnalyze.match(
                    /\b(shoe|sneaker|boot|sandal|heel|loafer)\b/i
                )
            ) {
                productData.category = "shoes";
            } else if (
                textToAnalyze.match(
                    /\b(jacket|coat|hoodie|sweater|cardigan)\b/i
                )
            ) {
                productData.category = "outerwear";
            } else if (
                textToAnalyze.match(
                    /\b(bag|hat|watch|belt|scarf|jewelry|accessory)\b/i
                )
            ) {
                productData.category = "accessories";
            } else {
                productData.category = "other";
            }
        }

        // 6. Clean up the product name (remove site name, extra text)
        if (productData.name) {
            // Remove common patterns like " | Site Name" or " - Site Name"
            productData.name = productData.name
                .replace(/\s*[|\-–]\s*.+$/, "")
                .trim();
        }

        // 7. Make image URL absolute if it's relative
        if (
            productData.image_url &&
            !productData.image_url.startsWith("http")
        ) {
            try {
                productData.image_url = new URL(
                    productData.image_url,
                    validUrl.origin
                ).toString();
            } catch {
                // If URL construction fails, keep the original
            }
        }

        if (!productData.brand) {
            productData.brand =
                $('meta[property="og:site_name"]').attr("content") ||
                $('meta[property="site_name"]').attr("content") ||
                $('meta[property="product:site_name"]').attr("content") ||
                $('meta[name="site_name"]').attr("content") ||
                null;
        }

        // Set default currency to USD if not found
        if (!productData.currency) {
            productData.currency = "USD";
        }

        // Return the scraped data
        return NextResponse.json(productData);
    } catch (error) {
        console.error("Scraping error:", error);
        return NextResponse.json(
            { error: "Failed to scrape product information" },
            { status: 500 }
        );
    }
}
