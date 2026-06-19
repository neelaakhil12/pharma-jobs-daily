const https = require('https');

https.get('https://pharma-jobs-daily-gt0bw5kb2-neelaakhil12s-projects.vercel.app/jobs/job-1781861873126?part=part-1781861756796', {
  headers: {
    'User-Agent': 'WhatsApp/2.21.12.21 A' // Mimic WhatsApp crawler User-Agent
  }
}, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('Response excerpt (first 500 chars):');
    console.log(data.substring(0, 500));
  });
}).on('error', (e) => {
  console.error('Request failed:', e.message);
});
