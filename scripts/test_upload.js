import http from 'http';

const boundary = '----WebKitFormBoundaryXYZ123';
const postData = [
  '--' + boundary,
  'Content-Disposition: form-data; name="file"; filename="test_preview.png"',
  'Content-Type: image/png',
  '',
  'sample_image_data_here',
  '--' + boundary + '--',
  ''
].join('\r\n');

const req = http.request({
  host: 'localhost',
  port: 5000,
  path: '/api/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'multipart/form-data; boundary=' + boundary,
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Upload response:', body));
});

req.write(postData);
req.end();
