const fs = require('fs');
const path = require('path');

// 1. Read the JSON file
const postsPath = path.join(__dirname, 'blog', 'posts.json');
const posts = JSON.parse(fs.readFileSync(postsPath, 'utf8'));

// 2. Read the HTML template
// We'll use the main post.html as the base, but strip out the JS-fetching logic
const templatePath = path.join(__dirname, 'blog', 'post.html');
let template = fs.readFileSync(templatePath, 'utf8');

posts.forEach(post => {
    const url = `https://lynxtech.netlify.app/blog/${post.slug}`;
    
    // --- Build the HTML Body ---
    let bodyHtml = '';
    post.body.forEach(block => {
        let inner = '';
        
        // Simple markdown parser for [text](url) and **bold**
        const parseInline = (text) => {
            if (!text) return '';
            return text
                .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
                .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        };

        switch (block.type) {
            case 'p':
                bodyHtml += `<p>${parseInline(block.text)}</p>\n`;
                break;
            case 'h2':
                bodyHtml += `<h2>${block.text}</h2>\n`;
                break;
            case 'h3':
                bodyHtml += `<h3>${block.text}</h3>\n`;
                break;
            case 'ul':
                bodyHtml += `<ul>\n${block.items.map(i => `  <li>${parseInline(i)}</li>`).join('\n')}\n</ul>\n`;
                break;
            case 'ol':
                bodyHtml += `<ol>\n${block.items.map(i => `  <li>${parseInline(i)}</li>`).join('\n')}\n</ol>\n`;
                break;
            case 'cta':
                bodyHtml += `
                <div class="post-service-cta">
                    ${block.heading ? `<h3>${block.heading}</h3>` : ''}
                    ${block.text ? `<p>${parseInline(block.text)}</p>` : ''}
                    ${block.buttonText ? `<a href="${block.buttonHref}" class="btn btn-primary">${block.buttonText} <i class="fas fa-arrow-right" aria-hidden="true"></i></a>` : ''}
                </div>\n`;
                break;
            case 'html':
                bodyHtml += block.html + '\n';
                break;
        }
    });

    // --- Build the Metadata ---
    const articleSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "description": post.metaDescription || post.excerpt,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": { "@type": "Organization", "name": "LYNX Technology", "url": "https://lynxtech.netlify.app/" },
        "publisher": { 
            "@type": "Organization", 
            "name": "LYNX Technology", 
            "logo": { "@type": "ImageObject", "url": "https://lynxtech.netlify.app/assests/logo/lynx-mark.svg" } 
        },
        "mainEntityOfPage": { "@type": "WebPage", "@id": url }
    }, null, 2);

    const breadcrumbSchema = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://lynxtech.netlify.app/" },
            { "@type": "ListItem", "position": 2, "name": "Insights", "item": "https://lynxtech.netlify.app/blog" },
            { "@type": "ListItem", "position": 3, "name": post.title, "item": url }
        ]
    }, null, 2);

    // --- Create the new static HTML ---
    // We replace the default head content with our post-specific content
    let newHtml = template;

    // Replace Title & Meta
    newHtml = newHtml.replace(/<title>.*?<\/title>/, `<title>${post.title} — LYNX Technology</title>`);
    newHtml = newHtml.replace(/<meta name="description" content=".*?">/, `<meta name="description" content="${post.metaDescription || post.excerpt}">`);
    newHtml = newHtml.replace(/<link id="canonicalLink" rel="canonical" href=".*?">/, `<link id="canonicalLink" rel="canonical" href="${url}">`);
    newHtml = newHtml.replace(/<meta id="ogUrl" property="og:url" content=".*?">/, `<meta id="ogUrl" property="og:url" content="${url}">`);
    newHtml = newHtml.replace(/<meta id="ogTitle" property="og:title" content=".*?">/, `<meta id="ogTitle" property="og:title" content="${post.title}">`);
    newHtml = newHtml.replace(/<meta id="ogDescription" property="og:description" content=".*?">/, `<meta id="ogDescription" property="og:description" content="${post.metaDescription || post.excerpt}">`);

    // Remove the inline JS that dynamically overwrites the head
    newHtml = newHtml.replace(/<script>\s*\(function \(\) \{\s*var slug = new URLSearchParams[\s\S]*?<\/script>/, '');

    // Inject Schema
    newHtml = newHtml.replace('</head>', `<script type="application/ld+json">\n${articleSchema}\n</script>\n<script type="application/ld+json">\n${breadcrumbSchema}\n</script>\n</head>`);

    // Replace the Body content
    newHtml = newHtml.replace(/<h1 id="postTitle">.*?<\/h1>/, `<h1 id="postTitle">${post.title}</h1>`);
    newHtml = newHtml.replace(/<span class="eyebrow" id="postCategory">.*?<\/span>/, `<span class="eyebrow" id="postCategory">${post.category === 'troubleshoot' ? 'IT Support' : 'Development'}</span>`);
    newHtml = newHtml.replace(/<p class="post-meta" id="postMeta"><\/p>/, `<p class="post-meta" id="postMeta">Published ${new Date(post.date).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}</p>`);
    
    // Replace the JS loading div with the actual content
    newHtml = newHtml.replace(/<div class="post-body" id="postBody">\s*<p class="post-loading">Loading post…<\/p>\s*<\/div>/, `<div class="post-body" id="postBody">\n${bodyHtml}\n</div>`);

    // Remove the script that fetches the JSON at the bottom
    newHtml = newHtml.replace(/<script>\s*\(function \(\) \{\s*var root = document.getElementById\('postRoot'\);[\s\S]*?<\/script>/, '');

    // Fix the nav links to point to static files instead of JS
    newHtml = newHtml.replace(/href="\/blog\/post\.html\?slug=.*?"/g, (match) => {
        const slugMatch = match.match(/slug=(.*?)"/);
        if (slugMatch) {
            return `href="/blog/${slugMatch[1]}"`;
        }
        return match;
    });

    // Write the file
    const outputPath = path.join(__dirname, 'blog', `${post.slug}.html`);
    fs.writeFileSync(outputPath, newHtml);
    console.log(`Generated: blog/${post.slug}.html`);
});

console.log('Done! All static posts generated.');