const fs = require('fs');

const themedFaviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="360 -60 1200 1200" width="100%" height="100%">
  <!-- VIORA ELITE - THE IMPERIUM HALLOWEEN EDITION FAVICON -->
  <defs>
    <!-- Background Obsidian Gradient -->
    <radialGradient id="bgObsidian" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#14060c"/>
      <stop offset="55%" stop-color="#090306"/>
      <stop offset="100%" stop-color="#030103"/>
    </radialGradient>

    <!-- Luxury Crimson & Gold Rim Border -->
    <linearGradient id="badgeBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffd57a"/>
      <stop offset="25%" stop-color="#dfb458"/>
      <stop offset="60%" stop-color="#ff1732"/>
      <stop offset="85%" stop-color="#b8091d"/>
      <stop offset="100%" stop-color="#4a0108"/>
    </linearGradient>

    <!-- Crimson Atmospheric Moonlit Glow -->
    <radialGradient id="halloweenAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ff1732" stop-opacity="0.38"/>
      <stop offset="50%" stop-color="#a8081a" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>

    <!-- Master Crown & Arch Gradient: Crimson wing tips flaring into luminous Royal Gold center spear -->
    <linearGradient id="crownHalloween" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ff1a35"/>
      <stop offset="18%" stop-color="#e10c22"/>
      <stop offset="36%" stop-color="#dfb458"/>
      <stop offset="50%" stop-color="#fff8e0"/>
      <stop offset="64%" stop-color="#dfb458"/>
      <stop offset="82%" stop-color="#e10c22"/>
      <stop offset="100%" stop-color="#ff1a35"/>
    </linearGradient>

    <!-- Left Wing Feathers (Angled Gold to Blood Crimson) -->
    <linearGradient id="wingLeft" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8e0"/>
      <stop offset="28%" stop-color="#ffd175"/>
      <stop offset="55%" stop-color="#dfb458"/>
      <stop offset="80%" stop-color="#ff1732"/>
      <stop offset="100%" stop-color="#6e030e"/>
    </linearGradient>

    <!-- Right Wing Feathers (Angled Gold to Blood Crimson) -->
    <linearGradient id="wingRight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fff8e0"/>
      <stop offset="28%" stop-color="#ffd175"/>
      <stop offset="55%" stop-color="#dfb458"/>
      <stop offset="80%" stop-color="#ff1732"/>
      <stop offset="100%" stop-color="#6e030e"/>
    </linearGradient>

    <!-- Inner Tail Dagger Blades (Champagne Gold to Blood Crimson tips) -->
    <linearGradient id="tailInner" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fff8e0"/>
      <stop offset="25%" stop-color="#ffd175"/>
      <stop offset="58%" stop-color="#dfb458"/>
      <stop offset="84%" stop-color="#ff1732"/>
      <stop offset="100%" stop-color="#8a0412"/>
    </linearGradient>

    <!-- Outer Tail Feathers -->
    <linearGradient id="tailOuter" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffd175"/>
      <stop offset="40%" stop-color="#dfb458"/>
      <stop offset="78%" stop-color="#ff1732"/>
      <stop offset="100%" stop-color="#54020a"/>
    </linearGradient>

    <!-- Demonic Heart Ruby Gem Core -->
    <radialGradient id="crestRuby" cx="35%" cy="32%" r="65%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="25%" stop-color="#ff475e"/>
      <stop offset="65%" stop-color="#e10c22"/>
      <stop offset="100%" stop-color="#3b0106"/>
    </radialGradient>

    <!-- Ambient Shadow & Glow Filter for Crest -->
    <filter id="crestGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="#000000" flood-opacity="0.9" />
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ff1732" flood-opacity="0.5" />
    </filter>

    <filter id="gemGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="#ff263e" flood-opacity="0.95" />
    </filter>
  </defs>

  <!-- 1. GOTHIC OBSIDIAN MEDALLION (FAVICON CONTAINER) -->
  <g id="favicon-badge">
    <!-- Obsidian Velvet Rounded Squircle -->
    <rect x="380" y="-40" width="1160" height="1160" rx="270" fill="url(#bgObsidian)" stroke="url(#badgeBorder)" stroke-width="16" />
    <!-- Crimson Atmospheric Core Glow -->
    <circle cx="960" cy="540" r="480" fill="url(#halloweenAura)" />
  </g>

  <!-- 2. VIORA ELITE AUTHENTIC CREST VECTORS (17 EXACT ORIGINAL PATHS) -->
  <g id="viora-imperium-crest" filter="url(#crestGlow)">
    <!-- LEFT WING FEATHERS (6 PATHS) -->
    <g id="left-wing">
      <path fill="url(#wingLeft)" d="M883.75,384.85c-78.76-1.62-269.76-12.26-431.31-16.13-3.79-34.24-3.65-55.68.65-90.28,158.65,42.36,352.05,86.01,430.66,106.41Z"/>
      <path fill="url(#wingLeft)" d="M882.96,392.55c-74.76,16.17-255.16,47.71-409.63,81.12-11.41-31.39-15.78-50.57-19.97-83.76,160.93,3.79,350.62,1.02,429.61,2.63Z"/>
      <path fill="url(#wingLeft)" d="M479.63,494.37c153.86-33.27,329.58-77.99,404.45-94.19-66.95,32.12-225.12,102.85-363.73,169.72-17.76-27.03-29.28-45.53-40.72-75.53Z"/>
      <path fill="url(#wingLeft)" d="M527.83,586.61c138.04-66.57,292.06-147.09,359.12-179.24-56.08,45.49-186.92,145.69-302.89,240.69-24.23-15.19-39.36-33.64-56.22-61.45Z"/>
      <path fill="url(#wingLeft)" d="M593.52,662.94c115.65-94.65,242.09-204.01,298.16-249.41-42.84,55.81-138.08,173.57-226.34,290.26-27.45-4.31-52.17-20.89-71.82-40.85Z"/>
      <path fill="url(#wingLeft)" d="M678.7,714.45c88.06-116.4,176.26-240.39,219.03-296.15-27.91,62.97-89.21,194.8-146.28,326.27-22.55-2.6-65.95-22.19-72.75-30.12Z"/>
    </g>

    <!-- CENTRAL CROWN & UPPER WINGS (1 MASTER PATH) -->
    <path fill="url(#crownHalloween)" d="M1465.95,264.01c-158.32,42.27-351.55,92.58-430.8,113.15-22,7.76-48.68,13.82-78.6,14.09-36.83-.35-68.76-9.42-93.04-19.61-88.87-23.12-263.91-75.49-409.42-114.32,4.9-34.98,14.05-63.07,27.57-96.93,60.09,33.31,121.64,66.6,184.67,99.78,55.4,29.17,110.23,57.35,164.43,84.58,6.47,1.92,58.73,16.76,84.44-9.59,18.45-18.9,25.3-60.96,20.42-81.07-6.68-27.53,6.22-35.17,5.21-36.71-1.08-1.51,15.67-138.33,15.71-138.6.04.27,16.79,137.09,15.79,138.6-1.04,1.54,11.85,9.19,5.13,36.71-4.96,20.34,2.91,62.61,20.42,81.07,27.97,29.49,90.7,8.63,95.05,7.12,54.28-27.03,109.3-55.14,164.98-84.38,61.74-32.42,121.88-64.96,180.43-97.51,13.51,33.86,22.66,68.64,27.6,103.62Z"/>

    <!-- CENTER TAIL BLADES & DAGGER TIPS (4 PATHS) -->
    <g id="tail-blades">
      <path fill="url(#tailOuter)" d="M787.85,965.7c63.19-126.75,123.69-382.72,154.23-442.66-15.34,65.03-55.51,331.39-86.45,468.29-27.63-5.91-41.45-14.44-67.78-25.63Z"/>
      <path fill="url(#tailInner)" d="M949.73,524.19c.63,66.47-4.5,336.81-1.78,477.03-28.39-.09-43.44-2.87-71.38-8.39,31.03-137.26,57.9-403.92,73.15-468.65Z"/>
      <path fill="url(#tailInner)" d="M957.5,523.24c16.56,64.52,47.09,332.08,83.7,468.69-28.2,5.84-43.49,8.92-72.16,9.27-2.71-140.88-10.95-411.82-11.53-477.96Z"/>
      <path fill="url(#tailOuter)" d="M1132.19,962.78c-27,11.98-41.58,21.19-70.01,27.57-36.77-137.22-80.91-405.63-97.42-469.82,31.95,59.13,97.93,316.74,167.43,442.25Z"/>
    </g>

    <!-- RIGHT WING FEATHERS (6 PATHS) -->
    <g id="right-wing">
      <path fill="url(#wingRight)" d="M1036.25,384.85c78.76-1.62,269.76-12.26,431.31-16.13,3.79-34.24,3.65-49.86-.65-84.46-158.65,42.36-352.05,80.19-430.66,100.6Z"/>
      <path fill="url(#wingRight)" d="M1037.04,392.55c74.76,16.17,255.16,47.71,409.63,81.12,11.41-31.39,15.78-50.57,19.97-83.76-160.93,3.79-350.62,1.02-429.61,2.63Z"/>
      <path fill="url(#wingRight)" d="M1440.37,494.37c-153.86-33.27-329.58-77.99-404.45-94.19,66.95,32.12,225.12,102.85,363.73,169.72,17.76-27.03,29.28-45.53,40.72-75.53Z"/>
      <path fill="url(#wingRight)" d="M1392.17,586.61c-138.04-66.57-292.06-147.09-359.12-179.24,56.08,45.49,186.92,145.69,302.89,240.69,24.23-15.19,39.36-33.64,56.22-61.45Z"/>
      <path fill="url(#wingRight)" d="M1326.48,662.94c-115.65-94.65-242.09-204.01-298.16-249.41,42.84,55.81,138.08,173.57,226.34,290.26,27.45-4.31,52.17-20.89,71.82-40.85Z"/>
      <path fill="url(#wingRight)" d="M1241.3,714.45c-88.06-116.4-176.26-240.39-219.03-296.15,27.91,62.97,89.21,194.8,146.28,326.27,22.55-2.6,65.95-22.19,72.75-30.12Z"/>
    </g>
  </g>

  <!-- 3. HALLOWEEN CORE ACCENTS -->
  <g id="halloween-jewel">
    <!-- Glowing Demonic Ruby Heart -->
    <circle cx="960" cy="295" r="18" fill="url(#crestRuby)" filter="url(#gemGlow)" />
    <circle cx="956" cy="291" r="5" fill="#ffffff" opacity="0.9" />
  </g>
</svg>
`;

fs.writeFileSync('d:/VIORA ELITE/HALLOWEEN VIORAELITE/VIORA-ELITE-HALLOWEEN/public/favicon.svg', themedFaviconSvg.trim());
console.log('Successfully written themed favicon.svg');
