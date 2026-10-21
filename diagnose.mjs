const API = 'http://localhost:8080/api';

async function diagnose() {
  // Login as manager
  const lr = await fetch(API + '/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'manager@smartstock.ai', password: 'Manager123!' })
  });
  const { token } = await lr.json();
  const h = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };

  // Check inventory
  const inv = await (await fetch(API + '/inventory', { headers: h })).json();
  const pm = inv.find(i => i.productName?.includes('Power Meter') || i.productId === 7);
  console.log('Smart Power Meter inventory:', pm);

  // Check supplier orders
  const orders = await (await fetch(API + '/supplier-orders', { headers: h })).json();
  const pmOrders = orders.filter(o => o.productName?.includes('Power Meter') || o.productId === 7);
  console.log('Active orders for Power Meter:', pmOrders);

  // Check recommendations
  const recs = await (await fetch(API + '/reorders/recommendations', { headers: h })).json();
  const pmRec = recs.filter(r => r.productName?.includes('Power Meter') || r.productId === 7);
  console.log('Recommendations for Power Meter:', pmRec);
  console.log('All recommendation statuses:', recs.map(r => `${r.productName}: ${r.status}`));

  // Generate predictions then reorders
  console.log('\nGenerating predictions...');
  await fetch(API + '/predictions/generate-all', { method: 'POST', headers: h });
  console.log('Generating reorders...');
  const genRes = await fetch(API + '/reorders/generate', { method: 'POST', headers: h });
  console.log('Generate status:', genRes.status);

  // Check again
  const recs2 = await (await fetch(API + '/reorders/recommendations', { headers: h })).json();
  const pmRec2 = recs2.filter(r => r.productName?.includes('Power Meter') || r.productId === 7);
  console.log('\nAfter regeneration - Power Meter recs:', pmRec2);
  console.log('All recs after:', recs2.map(r => `${r.productName}: ${r.status} (stock=${r.currentStock})`));

  // Check NovaTech supplier user
  console.log('\n--- NovaTech Supplier Check ---');
  const suppliers = await (await fetch(API + '/suppliers', { headers: h })).json();
  const nova = suppliers.find(s => s.name?.includes('NovaTech'));
  console.log('NovaTech supplier:', nova);

  // Try login as NovaTech
  if (nova) {
    const novaLogin = await fetch(API + '/auth/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: nova.contactEmail, password: 'Password123!' })
    });
    console.log('NovaTech login status:', novaLogin.status);
    if (novaLogin.ok) {
      const nd = await novaLogin.json();
      console.log('NovaTech user:', nd.user);
    } else {
      console.log('NovaTech login failed:', await novaLogin.text());
    }
  }
}

diagnose().catch(console.error);
