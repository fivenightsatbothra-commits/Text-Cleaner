# Text Cleaner ✨

> A privacy-focused, offline-first web tool to clean messily copied text from PDFs, websites, and emails.

**Live Demo**: Just open `index.html` in your browser!

![Text Cleaner Preview](preview.png)

## Why this exists?
We've all been there: you copy text from a PDF and it comes with **weird line breaks**. You copy code and it has **broken indentation**. You want to extract emails but don't want to paste private data into an online converter.

**Text Cleaner** solves this by running entirely in your browser. No data ever leaves your device.

## Features

### 🔹 Phase 1: Smart Formatting
- **Smart Unwrap**: Intelligently fixes broken line breaks (perfect for PDFs) while preserving paragraphs.
- **Trim & Normalize**: Removes trailing spaces, tabs, and collapses multiple spaces into one.
- **Fix Quotes**: Converts "smart quotes" to "straight quotes" for coding compatibility.

### 🔹 Phase 2: Transformation
- **Case Converters**: Sentence case, Title Case, UPPERCASE.
- **Line Operations**: Sort lines alphabetically or remove duplicates.

### 🔹 Phase 3: Deep Cleaning
- **HTML Stripper**: Removes all `<div>`, `<span>`, and other tags.
- **Email Extractor**: Puts all found emails into a clean list.
- **Real-time Stats**: Words, Characters, Lines, and Reading Time.

## Tech Stack
- **HTML5 / CSS3** (Glassmorphism UI)
- **Vanilla JavaScript** (No heavy frameworks)
- **Zero Dependencies**

## Usage
1. Download this folder.
2. Double click `index.html`.
3. Paste text and click any tool in the toolbar.
