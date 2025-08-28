const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, 'build');
const customOutputPath = 'C:/Manthra Dev Files/Tumor Project/TumorApp_UI_Hosting';
const elementsPath = path.join(__dirname, 'elements');
const outputDir = fs.existsSync(customOutputPath) ? customOutputPath : elementsPath;

console.log(`⚙️ Using output path: ${outputDir}`);

// Clean or create output directory
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Copy root-level build files (manifest, logos, etc.)
fs.readdirSync(buildDir).forEach(file => {
  const fullPath = path.join(buildDir, file);
  if (fs.lstatSync(fullPath).isFile()) {
    fs.copyFileSync(fullPath, path.join(outputDir, file));
  }
});

// Process index.html (remove hashed filenames)
let indexHtmlPath = path.join(buildDir, 'index.html');
let indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
indexHtml = indexHtml.replace(/main\.[a-f0-9]{8,}(\.js|\.css|\.js\.map|\.css\.map)/g, (m, ext) => `main${ext}`);
fs.writeFileSync(path.join(outputDir, 'index.html'), indexHtml);

// Copy JS/CSS/Map assets (static)
const handleAsset = (type) => {
  const srcDir = path.join(buildDir, 'static', type);
  const outDir = path.join(outputDir, 'static', type);
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs.readdirSync(srcDir).filter(f => f.startsWith('main.'));
  files.forEach(file => {
    const cleanName = file.replace(/main\.[a-f0-9]+\./, 'main.');
    fs.copyFileSync(path.join(srcDir, file), path.join(outDir, cleanName));
  });
};

handleAsset('js');
handleAsset('css');

// Clean asset-manifest.json
const manifestPath = path.join(buildDir, 'asset-manifest.json');
const outManifestPath = path.join(outputDir, 'asset-manifest.json');

if (fs.existsSync(manifestPath)) {
  const rawManifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const newManifest = {
    files: {},
    entrypoints: []
  };

  for (const [key, value] of Object.entries(rawManifest.files)) {
    if (!key.startsWith('main') && key !== 'index.html') continue;

    const cleanKey = key.replace(/main\.[a-f0-9]+\./, 'main.');
    const cleanValue = value.replace(/main\.[a-f0-9]+\./, 'main.');

    newManifest.files[cleanKey] = cleanValue;
  }

  newManifest.entrypoints = rawManifest.entrypoints
    .filter(e => e.includes('main.'))
    .map(e => e.replace(/main\.[a-f0-9]+\./, 'main.'));

  fs.writeFileSync(outManifestPath, JSON.stringify(newManifest, null, 2));
  console.log(`🛠️ asset-manifest.json cleaned and saved.`);
}

console.log(`✅ Postbuild complete. Output ready at: ${outputDir}`);
