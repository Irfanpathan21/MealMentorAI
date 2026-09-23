import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function inspectPages() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const htmlPath = path.resolve(__dirname, '..', 'MealMentor_AI_Project_Proposal.html');
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, { waitUntil: 'networkidle0' });

  // Evaluate text content of sections and page breaks
  const info = await page.evaluate(() => {
    const divs = Array.from(document.querySelectorAll('.formal-page, .content, .title-page'));
    return divs.map((div, i) => {
      const h1 = div.querySelector('h1, h2')?.innerText || 'No Heading';
      return { index: i + 1, heading: h1.replace(/\n/g, ' '), height: div.offsetHeight };
    });
  });

  console.log('Sections overview:', JSON.stringify(info, null, 2));
  await browser.close();
}

inspectPages();
