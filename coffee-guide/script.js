{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // --- Configuration & Data ---\
const CUPS_TO_WATER = 300; // Grams of water per "cup"\
const GRINDER_SETTINGS = \{\
    "1zpresso": \{\
        "AeroPress": "5.0 - 6.0 clicks",\
        "Cup One": "6.0 - 7.0 clicks",\
        "Moccamaster KGBV": "7.0 - 8.0 clicks"\
    \},\
    "baratza": \{\
        "AeroPress": "12 - 16",\
        "Cup One": "14 - 18",\
        "Moccamaster KGBV": "18 - 22"\
    \}\
\};\
\
// --- State Variables ---\
let selectedCups = 0;\
let selectedWater = 0;\
let selectedMaker = '';\
let selectedRatio = 0;\
let selectedGrinder = '';\
\
// --- Step 1: Cup Selection ---\
function initCupOptions() \{\
    const cups = [1, 2, 4, 6, 8];\
    const cupOptions = document.getElementById('cup-options');\
    cupOptions.innerHTML = cups.map(c => `<button onclick="selectCups($\{c\})">$\{c\} Cups</button>`).join('');\
\}\
\
function selectCups(cups) \{\
    selectedCups = cups;\
    selectedWater = cups * CUPS_TO_WATER;\
    \
    // Auto-select brewer based on cups\
    const makerOptionsContainer = document.getElementById('maker-options');\
    makerOptionsContainer.innerHTML = '';\
    \
    if (cups <= 2) \{\
        document.getElementById('maker-hint').textContent = 'For single servings, choose between the AeroPress/XL and Cup One.';\
        makerOptionsContainer.innerHTML = `\
            <button onclick="selectMaker('AeroPress')">AeroPress / XL</button>\
            <button onclick="selectMaker('Cup One')">Moccamaster Cup One</button>\
        `;\
    \} else \{\
        selectedMaker = 'Moccamaster KGBV';\
        document.getElementById('maker-hint').textContent = `The Moccamaster KGBV is the best choice for $\{cups\} cups.`;\
        makerOptionsContainer.innerHTML = `<button onclick="selectMaker('Moccamaster KGBV')">Moccamaster KGBV</button>`;\
        // Since maker is auto-selected, move straight to the next step\
        showStep(3); \
        return;\
    \}\
    showStep(2);\
\}\
\
// --- Step 2: Maker Selection (For 1-2 Cups) ---\
function selectMaker(maker) \{\
    selectedMaker = maker;\
    showStep(3);\
\}\
\
// --- Step 3: Ratio Selection ---\
function initRatioOptions() \{\
    const ratioButtons = document.getElementById('ratio-options').querySelectorAll('button');\
    ratioButtons.forEach(button => \{\
        button.onclick = () => \{\
            selectedRatio = parseInt(button.dataset.ratio);\
            showStep(4);\
        \};\
    \});\
\}\
\
// --- Step 4: Grinder Selection ---\
function initGrinderOptions() \{\
    const grinderButtons = document.getElementById('grinder-options').querySelectorAll('button');\
    grinderButtons.forEach(button => \{\
        button.onclick = () => \{\
            selectedGrinder = button.dataset.grinder;\
            calculateAndDisplayResult();\
        \};\
    \});\
\}\
\
// --- Final Step: Calculation & Display ---\
function calculateAndDisplayResult() \{\
    // Math: Coffee Weight (g) = Water Weight (g) / Ratio \
    const coffeeWeight = selectedWater / selectedRatio;\
    const roundedCoffeeWeight = Math.round(coffeeWeight);\
\
    // Get the display text for the ratio\
    let ratioText = '';\
    if (selectedRatio === 14) ratioText = 'Strong (1:14)';\
    else if (selectedRatio === 16) ratioText = 'Medium (1:16)';\
    else ratioText = 'Mild (1:18)';\
\
    // Adjust maker name for lookup (e.g., 'AeroPress / XL' -> 'AeroPress')\
    const lookupMaker = selectedMaker.includes('AeroPress') ? 'AeroPress' : selectedMaker.split(' ')[0]; \
    const grindSetting = GRINDER_SETTINGS[selectedGrinder][lookupMaker];\
\
    // Update the result display\
    document.getElementById('result-cups').textContent = selectedCups;\
    document.getElementById('result-maker').textContent = selectedMaker;\
    document.getElementById('result-ratio-text').textContent = ratioText;\
    document.getElementById('result-water').textContent = selectedWater.toLocaleString();\
    document.getElementById('result-coffee').textContent = roundedCoffeeWeight.toLocaleString();\
    document.getElementById('result-grind-setting').textContent = grindSetting;\
\
    showStep('result-area');\
\}\
\
// --- UI Utility Functions ---\
function showStep(stepId) \{\
    // Hide all steps\
    document.querySelectorAll('.step').forEach(step => step.classList.add('hidden'));\
\
    // Show the desired step\
    const stepToShow = document.getElementById(typeof stepId === 'number' ? `step-$\{stepId\}` : stepId);\
    if (stepToShow) \{\
        stepToShow.classList.remove('hidden');\
    \}\
\}\
\
function resetApp() \{\
    // Reset state\
    selectedCups = 0;\
    selectedWater = 0;\
    selectedMaker = '';\
    selectedRatio = 0;\
    selectedGrinder = '';\
    // Show the first step\
    showStep(1);\
\}\
\
// --- Initialize the App ---\
document.addEventListener('DOMContentLoaded', () => \{\
    initCupOptions();\
    initRatioOptions();\
    initGrinderOptions();\
    showStep(1); // Start on the first step\
\});}