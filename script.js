document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const inputText = document.getElementById('input-text');
    const outputText = document.getElementById('output-text');
    const clearBtn = document.getElementById('clear-btn');
    const copyBtn = document.getElementById('copy-btn');
    const pasteBtn = document.getElementById('paste-btn');
    const toast = document.getElementById('toast');

    // Stats Elements
    const statWords = document.getElementById('stat-words');
    const statChars = document.getElementById('stat-chars');
    const statLines = document.getElementById('stat-lines');
    const statTime = document.getElementById('stat-time');

    // Stats Logic
    function updateStats() {
        const text = inputText.value || "";
        const chars = text.length;
        const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        const lines = text.trim() === '' ? 0 : text.split(/\n/).length;
        // Approx 200 words per minute
        const time = Math.ceil(words / 200);

        statChars.textContent = chars.toLocaleString();
        statWords.textContent = words.toLocaleString();
        statLines.textContent = lines.toLocaleString();
        statTime.textContent = time < 1 ? '< 1m' : `~${time}m`;
    }

    // Utilities
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 2000);
    }

    function setOutput(text) {
        outputText.value = text;
        // Animation effect
        outputText.parentElement.style.borderColor = 'var(--accent-color)';
        setTimeout(() => {
            outputText.parentElement.style.borderColor = 'var(--border-color)';
        }, 500);
    }

    // --- PHASE 1: Smart Formatting ---
    const FormatTools = {
        'smart-unwrap': (text) => {
            // Merge lines that do NOT end with punctuation (., !, ?) 
            // Negative lookbehind to check for punctuation before newline
            // We replace "newline followed by non-newline" 

            // Heuristic: If a line ends with a letter/comma/hyphen, and next line starts with a letter -> Merge
            // We use a regex to look for "char + \n + char" structure

            // 1. Preserve double newlines (paragraphs)
            let temp = text.replace(/\n\n+/g, '___PARAGRAPH___');

            // 2. Replace single newlines with space if not preceded by . ! ?
            // This regex matches a char that is NOT .!? followed by newline
            temp = temp.replace(/([^\.\!\?])\n/g, '$1 ');

            // 3. Restore paragraphs
            return temp.replace(/___PARAGRAPH___/g, '\n\n').trim();
        },
        'trim-space': (text) => {
            // 1. Normalize tabs -> space
            text = text.replace(/\t/g, ' ');
            // 2. Collapse multiple spaces
            text = text.replace(/[ ]+/g, ' ');
            // 3. Trim lines
            text = text.split('\n').map(line => line.trim()).filter(x => x !== '').join('\n');
            return text;
        },
        'fix-quotes': (text) => {
            return text.replace(/[\u2018\u2019]/g, "'")
                .replace(/[\u201C\u201D]/g, '"')
                .replace(/[\u2013\u2014]/g, '-');
        }
    };

    // --- PHASE 2: Transformations ---
    const TransformTools = {
        'sent-case': (text) => {
            // Lowercase everything first
            const lower = text.toLowerCase();
            // Capitalize first char of sentences (start of text (.))
            return lower.replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase());
        },
        'title-case': (text) => {
            // Basic title case (not perfect but good for simple cleanup)
            return text.toLowerCase().split(' ').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
        },
        'upper-case': (text) => text.toUpperCase(),
        'sort-lines': (text) => {
            return text.split('\n')
                .filter(line => line.trim() !== '')
                .sort((a, b) => a.localeCompare(b))
                .join('\n');
        }
    };

    // --- PHASE 3: Deep Clean ---
    const CleanTools = {
        'strip-html': (text) => {
            // Create a temp element to use browser parsing (safer than regex)
            const div = document.createElement('div');
            div.innerHTML = text;
            return div.textContent || div.innerText || '';
        },
        'extract-emails': (text) => {
            const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
            const matches = text.match(emailRegex);
            return matches ? [...new Set(matches)].join('\n') : "No emails found.";
        }
    };

    // Main Tool Handler
    document.querySelector('.toolbar-container').addEventListener('click', (e) => {
        const btn = e.target.closest('.tool-btn');
        if (!btn) return;

        const action = btn.dataset.action;
        let originalText = inputText.value;

        if (!originalText && btn.id !== 'clear-btn') return;

        let result = originalText;

        // Route action
        if (FormatTools[action]) result = FormatTools[action](originalText);
        else if (TransformTools[action]) result = TransformTools[action](originalText);
        else if (CleanTools[action]) result = CleanTools[action](originalText);

        // Handle Clear Special Case
        if (btn.id === 'clear-btn') {
            inputText.value = '';
            outputText.value = '';
            updateStats();
            return;
        }

        setOutput(result);

        // Auto-scroll to result on mobile if needed
        if (window.innerWidth < 768) {
            outputText.scrollIntoView({ behavior: 'smooth' });
        }
    });

    // --- Copy / Paste Handlers ---
    copyBtn.addEventListener('click', () => {
        if (!outputText.value) return;
        navigator.clipboard.writeText(outputText.value).then(() => {
            showToast('Copied Result!');
            copyBtn.style.color = 'var(--success-color)';
            setTimeout(() => copyBtn.style.color = '', 1500);
        });
    });

    pasteBtn.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            inputText.value = text;
            updateStats();
        } catch (err) {
            showToast('Permission denied to read clipboard');
        }
    });

    // Real-time Stats
    inputText.addEventListener('input', updateStats);

    // Initial Stat update (in case of browser autofill)
    updateStats();
});
