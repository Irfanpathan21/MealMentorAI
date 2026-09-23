import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  console.log('🚀 Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  const htmlPath = path.resolve(__dirname, '..', 'MealMentor_AI_Project_Proposal.html');
  const pdfPath = path.resolve(__dirname, '..', 'MealMentor_AI_Idea_Proposal_v5_updated.pdf');

  console.log(`📄 Loading HTML from: ${htmlPath}`);
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0',
    timeout: 30000
  });

  console.log('📝 Generating PDF...');
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    margin: {
      top: '1in',
      right: '1in',
      bottom: '1in',
      left: '1.5in'
    },
    printBackground: true,
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width:100%; text-align:center; font-size:10px; font-family:'Times New Roman', serif; color:#555; padding-top:5px;">
        <span class="pageNumber"></span>
      </div>
    `,
  });

  console.log(`✅ PDF saved to: ${pdfPath}`);
  await browser.close();
}

generatePDF().catch(err => {
  console.error('❌ Error generating PDF:', err);
  process.exit(1);
});
