import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, '..', 'MealMentor_AI_Project_Proposal.html');
let content = fs.readFileSync(htmlPath, 'utf8');

// Replace all <div class="page-break"></div>
content = content.replace(/<div class="page-break"><\/div>/gi, '');

fs.writeFileSync(htmlPath, content, 'utf8');
console.log('✅ Cleaned up extra page-break divs');
