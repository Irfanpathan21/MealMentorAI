import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const imgDir = path.resolve(__dirname, '..', 'diagrams');

if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

async function generateGanttChart(browser) {
  const page = await browser.newPage();
  await page.setViewport({
    width: 1400,
    height: 750,
    deviceScaleFactor: 3 // Ultra crisp 3x scale factor
  });

  const phases = [
    { num: 'P1', name: 'Phase 1: Environment & Azure Setup', start: 1, duration: 2, color: '#3498DB' },
    { num: 'P2', name: 'Phase 2: Auth & Profile Module', start: 3, duration: 2, color: '#2ECC71' },
    { num: 'P3', name: 'Phase 3: Food Vision & AI Core', start: 5, duration: 3, color: '#9B59B6' },
    { num: 'P4', name: 'Phase 4: Daily Tracking & Journal', start: 8, duration: 2, color: '#E67E22' },
    { num: 'P5', name: 'Phase 5: Charts & Analytics Engine', start: 10, duration: 2, color: '#1ABC9C' },
    { num: 'P6', name: 'Phase 6: AI Dietitian Chat Module', start: 12, duration: 3, color: '#E74C3C' },
    { num: 'P7', name: 'Phase 7: Health Report Analysis', start: 15, duration: 2, color: '#F1C40F' },
    { num: 'P8', name: 'Phase 8: System Testing & UI Polish', start: 17, duration: 2, color: '#34495E' },
    { num: 'P9', name: 'Phase 9: Cloud Deploy & Final APK', start: 19, duration: 2, color: '#D35400' }
  ];

  const html = `<!DOCTYPE html>
<html>
<head>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
  body { padding: 30px; background: #ffffff; width: 1340px; }
  .title { text-align: center; font-size: 20px; font-weight: bold; color: #2C3E50; margin-bottom: 25px; letter-spacing: 0.5px; }

  .gantt-container {
    border: 2px solid #BDC3C7; border-radius: 8px; overflow: hidden; background: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  .header-months {
    display: flex; background: #2C3E50; color: #fff; font-weight: bold; font-size: 14px;
    border-bottom: 2px solid #1A252F;
  }
  .month-col { text-align: center; padding: 8px 0; border-right: 1px solid #34495E; }
  .month-col:last-child { border-right: none; }

  .header-weeks {
    display: grid; grid-template-columns: 320px repeat(20, 1fr);
    background: #ECF0F1; font-size: 11px; font-weight: bold; color: #7F8C8D; text-align: center;
    border-bottom: 2px solid #BDC3C7;
  }
  .week-cell { padding: 6px 0; border-right: 1px solid #BDC3C7; }
  .label-head { padding: 6px 12px; text-align: left; color: #2C3E50; border-right: 2px solid #BDC3C7; font-size: 13px; }

  .row {
    display: grid; grid-template-columns: 320px repeat(20, 1fr);
    border-bottom: 1px solid #ECF0F1; height: 42px; align-items: center;
  }
  .row:nth-child(even) { background: #FAFAFA; }
  .row:last-child { border-bottom: none; }

  .phase-label {
    padding: 0 12px; font-size: 13px; font-weight: 600; color: #2C3E50;
    border-right: 2px solid #BDC3C7; height: 100%; display: flex; align-items: center;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .grid-cell { height: 100%; border-right: 1px solid #F0F0F0; position: relative; }

  .bar-wrapper {
    position: relative; height: 100%; grid-column: span 20; display: grid; grid-template-columns: repeat(20, 1fr);
  }

  .gantt-bar {
    position: absolute; top: 7px; height: 26px; border-radius: 5px;
    display: flex; align-items: center; justify-content: center; color: #fff;
    font-size: 11px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    transition: all 0.2s;
  }
</style>
</head>
<body>
  <div class="title">Figure 7.1: Project Implementation Timeline (20 Weeks / 9 Phases)</div>

  <div class="gantt-container">
    <!-- Month Header -->
    <div class="header-months">
      <div style="width: 320px; text-align: left; padding-left: 12px; border-right: 2px solid #1A252F;">Phases / Tasks</div>
      <div class="month-col" style="flex: 4;">August 2026</div>
      <div class="month-col" style="flex: 4;">September 2026</div>
      <div class="month-col" style="flex: 4;">October 2026</div>
      <div class="month-col" style="flex: 4;">November 2026</div>
      <div class="month-col" style="flex: 4;">December 2026</div>
    </div>

    <!-- Week Header -->
    <div class="header-weeks">
      <div class="label-head">Timeline Overview</div>
      ${Array.from({length: 20}, (_, i) => `<div class="week-cell">W${i+1}</div>`).join('')}
    </div>

    <!-- Rows -->
    ${phases.map(p => {
      const leftPercent = ((p.start - 1) / 20) * 100;
      const widthPercent = (p.duration / 20) * 100;
      return `
        <div class="row">
          <div class="phase-label" title="${p.name}">${p.name}</div>
          <div style="grid-column: span 20; position: relative; height: 100%; display: grid; grid-template-columns: repeat(20, 1fr);">
            ${Array.from({length: 20}, () => `<div class="grid-cell"></div>`).join('')}
            <div class="gantt-bar" style="left: calc(${leftPercent}% + 3px); width: calc(${widthPercent}% - 6px); background-color: ${p.color};">
              ${p.duration} Wk${p.duration > 1 ? 's' : ''} (${p.num})
            </div>
          </div>
        </div>
      `;
    }).join('')}
  </div>
</body>
</html>`;

  await page.setContent(html, { waitUntil: 'networkidle0' });
  const container = await page.$('.gantt-container');
  const imgPath = path.join(imgDir, 'fig_7_1_gantt_chart.png');
  await container.screenshot({ path: imgPath, type: 'png', omitBackground: false });

  console.log(`✅ Saved beautiful crisp Gantt Chart: ${imgPath}`);
  await page.close();
}

async function main() {
  console.log('🚀 Launching browser for Gantt chart generation...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  await generateGanttChart(browser);
  await browser.close();
  console.log('🎉 Gantt chart generated successfully!');
}

main().catch(err => { console.error('❌ Error:', err); process.exit(1); });
