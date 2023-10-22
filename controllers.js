const axios = require("axios");
const puppeteer = require("puppeteer");
const cmsApi_Token = '46cdca019eb46375ecd5aed96da9e932891a79102651ddfffbf3a0a7a7d37758';

// GET CONTENT
const getContent = async (category) => {
  const url = {
    'uncuffed': 'https://www.kalw.org/podcast/uncuffed',
    'radio-stories': 'https://www.kalw.org/podcast/uncuffed-radio-stories/',
  };
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(url[category], {
    waitUntil: "networkidle2",
  });

  const nxtPageBtn = '.EplA-nextPage';

  // Function to safely extract data from the page
  const extractData = () => {
    const storyElements = Array.from(document.querySelectorAll('.PromoAE'));

    return storyElements.map((element) => {
      const media = element.querySelector('.PromoAE-media a')?.getAttribute("href");
      const image = element.querySelector('.PromoAE-media picture .Image')?.getAttribute("src");
      const byline = element.querySelector('.PromoAE-byline')?.innerText;
      const title = element.querySelector('.PromoAE-title')?.innerText;
      const description = element.querySelector('.PromoAE-description')?.innerText;
      const audioUrl = element.querySelector('ps-stream-url[data-stream-url]')?.getAttribute("data-stream-url");

      return {
        media,
        image,
        byline,
        title,
        description,
        audioUrl,
      };
    });
  };

  const episodes = [];

  // Loop to load and extract data from all pages
  while (true) {
    const pageData = await page.evaluate(extractData);
    episodes.push(...pageData);

    // Click "Next Page" button if it exists
    const nextPageButton = await page.$(nxtPageBtn);
    if (!nextPageButton) {
      break; // No more pages to load
    }

    await page.click(nxtPageBtn);
    await page.waitForTimeout(2000); // Wait for some time for new content to load, adjust as needed
  }

  browser.close();
  return { episodes, total: episodes.length };
};


// GET RE-ENTRY STORIES
const getReentryStories = async () => {
  const page_url = 'https://www.kalw.org/law-justice/2023-05-30/on-the-other-side-of-the-wall-uncuffed-presents-re-entry-stories';
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto(page_url, {
    waitUntil: "networkidle2",
  });

  const nxtPageBtn = '.EplA-nextPage';

  // GET TEXT FROM SIBLINGS OF FIRST ENH DIV
  const featured_Content = () => {
    const divElements = Array.from(document.querySelectorAll('.ArtP-articleBody'));

    return divElements.map((element) => {
      const featured_content = element.querySelector('.Enh');
      const siblingParagraphs = [];

      // Find all sibling <p> tags after the .ArtP-articleBody div
      let nextSibling = featured_content.nextElementSibling;
      while (nextSibling && nextSibling.tagName === 'P') {
        siblingParagraphs.push(nextSibling.textContent.trim());
        nextSibling = nextSibling.nextElementSibling;
      }

      return siblingParagraphs; // Return siblingParagraphs as an array
    });
  };


  // GET FEATURED STORY
  const featured_story = () => {
    const storyElements = Array.from(document.querySelectorAll('.ArtP-mainContent'));

    return storyElements.map((element) => {
      const headLine = element.querySelector('.ArtP-headline')?.innerText;
      const featured_byline = element.querySelector('.ArtP-contentInfo .ArtP-byline')?.innerText;
      const featured_content = element.querySelector('.Enh')?.innerText;
      const featured_image = element.querySelector('.ArtP-lead picture .Image')?.getAttribute("src");
      const featured_audio_link = element.querySelector('.ArtP-contentInfo ps-stream-url')?.getAttribute("data-stream-url");
      const featured_fb_link = element.querySelector('a[data-platform="facebook"]')?.getAttribute("href");
      const featured_twitter_link = element.querySelector('a[data-platform="twitter"]')?.getAttribute("href");
      const featured_Li_link = element.querySelector('a[data-platform="linkedin"]')?.getAttribute("href");
      const featured_email_link = element.querySelector('a[data-platform="mailto"]')?.getAttribute("href");

      return {
        headLine,
        featured_byline,
        featured_image,
        featured_audio_link,
        featured_fb_link,
        featured_twitter_link,
        featured_Li_link,
        featured_email_link,
      };
    });
  };

  // Function to safely extract data from the page
  const extractData = () => {
    const storyElements = Array.from(document.querySelectorAll('.AudioEnh-info'));

    return storyElements.map((element) => {
      const title = element.querySelector('.AudioEnh-title')?.innerText
        .replace(/_/g, ': ').replace('.mp3', '');
      const audioUrl = element.querySelector('ps-stream-url')?.getAttribute("data-stream-url");

      return {
        title,
        audioUrl,
      };
    });
  };

  const episodes = [];

  const paragraphData = await page.evaluate(featured_Content);
  const featuredData = await page.evaluate(featured_story);
  featuredData[0]['featuredContent'] = paragraphData[0];
  episodes.push(featuredData[0]);

  // Loop to load and extract data from all pages
  while (true) {
    const pageData = await page.evaluate(extractData);
    episodes.push(...pageData);

    // Click "Next Page" button if it exists
    const nextPageButton = await page.$(nxtPageBtn);
    if (!nextPageButton) {
      break; // No more pages to load
    }

    await page.click(nxtPageBtn);
    await page.waitForTimeout(2000); // Wait for some time for new content to load, adjust as needed
  }

  browser.close();
  return { episodes, total: episodes.length };
};

module.exports = { getContent, getReentryStories };