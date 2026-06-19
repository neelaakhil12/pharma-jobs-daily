const http = require('http');

http.get('http://localhost:3000/jobs/job-1781861873126?part=part-1781861756796', (res) => {
  console.log('Status Code:', res.statusCode);
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    // Extract and print all meta tags and title
    const metaTags = [];
    const metaRegex = /<meta\s+[^>]*>/gi;
    let match;
    while ((match = metaRegex.exec(data)) !== null) {
      metaTags.push(match[0]);
    }
    
    const titleMatch = data.match(/<title>([^<]*)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title found');
    console.log('\nMeta Tags found:');
    metaTags.forEach(tag => {
      if (tag.includes('og:') || tag.includes('twitter:') || tag.includes('title') || tag.includes('description')) {
        console.log(tag);
      }
    });
  });
}).on('error', (e) => {
  console.error('Local server request failed:', e.message);
});
