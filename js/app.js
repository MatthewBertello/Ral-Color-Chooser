/**
 * RAL Color Chooser Application
 * Main application logic for the RAL color visualization tool
 */

// Application state
let ralColors = [];
let currentHex = '#2E5978';
let filteredColors = [];

// DOM elements
const colorList = document.getElementById('colorList');
const searchInput = document.getElementById('searchInput');
const countDisplay = document.getElementById('countDisplay');
const camperBody = document.getElementById('camperBody');
const colorCodeDisplay = document.getElementById('colorCodeDisplay');
const colorNameDisplay = document.getElementById('colorNameDisplay');
const imageSearchLink = document.getElementById('imageSearchLink');

/**
 * Initialize the application
 */
async function init() {
    try {
        // Load RAL color data
        const response = await fetch('data/ral-colors.json');
        ralColors = await response.json();
        filteredColors = [...ralColors];
        
        // Initial render
        renderColors(filteredColors);
        
        // Set default color (RAL 5009 - Azure Blue)
        const defaultColor = ralColors.find(c => c.code === 'RAL 5009');
        if (defaultColor) {
            changeColor(defaultColor.hex, defaultColor.code, defaultColor.name);
        }
        
        // Setup search functionality
        setupSearch();
    } catch (error) {
        console.error('Error initializing application:', error);
        // Fallback: show error message to user
        colorList.innerHTML = '<div class="p-4 text-red-600">Error loading color data. Please refresh the page.</div>';
    }
}

/**
 * Setup search input event listener
 */
function setupSearch() {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase().trim();
        
        if (term === '') {
            filteredColors = [...ralColors];
        } else {
            filteredColors = ralColors.filter(color => 
                color.code.toLowerCase().includes(term) || 
                color.name.toLowerCase().includes(term)
            );
        }
        
        renderColors(filteredColors);
    });
}

/**
 * Render the color list
 * @param {Array} colors - Array of color objects to render
 */
function renderColors(colors) {
    colorList.innerHTML = '';
    countDisplay.textContent = `Showing ${colors.length} colors`;

    colors.forEach(color => {
        const btn = document.createElement('button');
        btn.className = "color-btn w-full text-left p-2 rounded-lg hover:bg-slate-100 flex items-center group transition-all";
        btn.setAttribute('aria-label', `Select ${color.code} ${color.name}`);
        btn.onclick = () => changeColor(color.hex, color.code, color.name);
        
        btn.innerHTML = `
            <div class="w-10 h-10 rounded shadow-sm border border-slate-200 mr-3 flex-shrink-0" 
                 style="background-color: ${color.hex};"
                 aria-hidden="true"></div>
            <div class="flex-1 min-w-0">
                <div class="font-bold text-slate-800 text-sm truncate">${escapeHtml(color.code)}</div>
                <div class="text-xs text-slate-500 truncate">${escapeHtml(color.name)}</div>
            </div>
        `;
        
        colorList.appendChild(btn);
    });
}

/**
 * Change the selected color and update the visualization
 * @param {string} hex - Hex color code
 * @param {string} code - RAL color code
 * @param {string} name - RAL color name
 */
function changeColor(hex, code, name) {
    currentHex = hex;
    
    // Update SVG fill
    if (camperBody) {
        camperBody.setAttribute('fill', hex);
    }
    
    // Update display labels
    if (colorCodeDisplay) {
        colorCodeDisplay.textContent = code;
    }
    if (colorNameDisplay) {
        colorNameDisplay.textContent = name;
    }

    // Update real-world image search link
    if (imageSearchLink) {
        const encodedQuery = encodeURIComponent(`${code} ${name} object examples`);
        imageSearchLink.href = `https://www.google.com/search?tbm=isch&q=${encodedQuery}`;
    }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

