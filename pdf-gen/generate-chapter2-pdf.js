import puppeteer from 'puppeteer';
import path from 'path';

async function generateChapter2PDF() {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  const htmlPath = path.resolve('../MealMentor_AI_Chapter_2.html');
  const pdfPath = path.resolve('../MealMentor_AI_Chapter_2.pdf');

  console.log(`Loading HTML from: ${htmlPath}`);
  await page.goto(`file:///${htmlPath.replace(/\\/g, '/')}`, {
    waitUntil: 'networkidle0'
  });

  console.log('Generating PDF...');
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
      <div style="width:100%; text-align:center; font-size:10px; font-family:'Times New Roman', serif; color:#555;">
        <span class="pageNumber"></span>
      </div>
    `
  });

  console.log(`✅ Chapter 2 PDF generated successfully at: ${pdfPath}`);
  await browser.close();
}

generateChapter2PDF().catch(err => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
