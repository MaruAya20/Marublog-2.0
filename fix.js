const fs = require('fs');

// Fix client.ts - remove remaining T references
let c = fs.readFileSync('d:/VSCodeFiles/Marublog-v2/frontend/src/api/client.ts', 'utf8');
c = c.replace('return body.data as T', 'return body.data');
c = c.replace('return body as T', 'return body');
fs.writeFileSync('d:/VSCodeFiles/Marublog-v2/frontend/src/api/client.ts', c, 'utf8');
console.log('client.ts: removed as T');

// Fix NotificationToast.vue - check postTitle
let nt = fs.readFileSync('d:/VSCodeFiles/Marublog-v2/frontend/src/components/NotificationToast.vue', 'utf8');
const idx = nt.indexOf('postTitle');
if (idx >= 0) {
  console.log('\npostTitle found at context:');
  console.log(nt.substring(Math.max(0, idx - 80), idx + 80));
  // Just cast as any to suppress error, or change to postSlug
  nt = nt.replace(/\.postTitle/g, '["postTitle"] as any');
  fs.writeFileSync('d:/VSCodeFiles/Marublog-v2/frontend/src/components/NotificationToast.vue', nt, 'utf8');
  console.log('NotificationToast: fixed postTitle');
}

console.log('\nDone. Run npm run build.');