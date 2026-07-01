import * as cheerio from 'cheerio';

export interface ScrapedProduct {
  name: string;
  slug: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  categoryNames: string[];
  primaryImage: string;
  gallery: string[];
}


export async function scrapeAlliedSurplus(limit: number = 20): Promise<ScrapedProduct[]> {
  try {
    const response = await fetch('https://alliedsurplus.com/shop/');
    const html = await response.text();
    const $ = cheerio.load(html);
    const products: ScrapedProduct[] = [];

    // Select product items from the shop grid
    $('li.product').each((i, el) => {
      if (i >= limit) return false;

      const $el = $(el);
      
      // Porto Theme selectors
      const name = $el.find('.woocommerce-loop-product__title').text().trim() || 
                   $el.find('.product-loop-title h3').text().trim() ||
                   $el.find('h3').text().trim();
                   
      const href = $el.find('a').first().attr('href') || '';
      const slug = href.split('/').filter(Boolean).pop() || `product-${i}`;
      
      // Price extraction (handle ranges)
      const priceText = $el.find('.price').text().replace(/[^\d.\-]/g, '').trim();
      let price = 0;
      let compareAtPrice: number | undefined;

      if (priceText.includes('-')) {
        const prices = priceText.split('-').map(p => parseFloat(p)).filter(p => !isNaN(p));
        price = prices[0] || 0;
        compareAtPrice = prices[1];
      } else {
        price = parseFloat(priceText) || 0;
      }

      const primaryImage = $el.find('.product-image img').first().attr('src') || 
                           $el.find('img').first().attr('src') || '';
      
      const categoryNames: string[] = [];
      // Porto theme categories are often in .links-primary or similar
      $el.find('a[href*="product-category"]').each((_, cat) => {
        const catText = $(cat).text().trim();
        if (catText && !categoryNames.includes(catText)) {
          categoryNames.push(catText);
        }
      });

      if (name && name !== "Select options" && name !== "Read more") {
        products.push({
          name,
          slug,
          sku: `AS-${slug.toUpperCase()}`,
          price,
          compareAtPrice,
          description: `Imported from Allied Surplus: ${name}`,
          categoryNames: categoryNames.length > 0 ? categoryNames : ["General Surplus"],
          primaryImage,
          gallery: []
        });
      }
    });

    return products;
  } catch (error) {
    console.error('Scraping Allied Surplus failed:', error);
    return [];
  }
}
