const https = require('https');

https.get('https://pharma-jobs-daily.vercel.app/jobs/job-1781861873126?part=part-1781861756796', {
  headers: {
    'User-Agent': 'WhatsApp/2.21.12.21 A' // Mimic WhatsApp crawler User-Agent
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers x-robots-tag:', res.headers['x-robots-tag'] || 'None');
  
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const ogTitle = data.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
    const ogImage = data.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i);
    
    console.log('OG Title:', ogTitle ? ogTitle[1] : 'Not found');
    console.log('OG Image:', ogImage ? ogImage[1] : 'Not found');
  });
}).on('error', (e) => {
  console.error('Request failed:', e.message);
});
