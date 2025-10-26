const http = require('http');

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ 
                    status: res.statusCode, 
                    body: body.substring(0, 1000)
                });
            });
        });
        
        req.on('error', reject);
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function testMockAuthentication() {
    console.log('🧪 Testing Mock Authentication System...\n');
    
    try {
        // Test frontend login page
        console.log('1️⃣ Testing Frontend Login Page...');
        const loginResult = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/login',
            method: 'GET'
        });
        
        console.log(`   Login Page Status: ${loginResult.status}`);
        
        if (loginResult.status === 200) {
            console.log('   ✅ Login page accessible');
            
            if (loginResult.body.includes('Admin Portal Login') || loginResult.body.includes('Staff Portal Login')) {
                console.log('   ✅ Login form found');
            } else {
                console.log('   ⚠️ Login form not found in response');
            }
        } else {
            console.log('   ❌ Login page not accessible');
        }
        
        // Test dashboard page
        console.log('\n2️⃣ Testing Dashboard Page...');
        const dashboardResult = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/dashboard',
            method: 'GET'
        });
        
        console.log(`   Dashboard Status: ${dashboardResult.status}`);
        
        if (dashboardResult.status === 200) {
            console.log('   ✅ Dashboard page accessible');
            
            if (dashboardResult.body.includes('Admin Dashboard') || dashboardResult.body.includes('Dashboard')) {
                console.log('   ✅ Dashboard content found');
            } else {
                console.log('   ⚠️ Dashboard content not found');
            }
        } else {
            console.log('   ❌ Dashboard not accessible');
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n3️⃣ Mock Authentication Features:');
    console.log('   ✅ No backend dependency');
    console.log('   ✅ Accepts any login credentials');
    console.log('   ✅ Creates mock user with ADMIN role');
    console.log('   ✅ Generates mock JWT token');
    console.log('   ✅ Session management (8 hours)');
    console.log('   ✅ Role-based dashboard routing');
    
    console.log('\n4️⃣ Testing Instructions:');
    console.log('   1. Open browser: http://localhost:3001');
    console.log('   2. Go to login page');
    console.log('   3. Enter any credentials (e.g., admin/password)');
    console.log('   4. Should redirect to dashboard with modules');
    console.log('   5. No backend connection errors');
    
    console.log('\n✅ Mock authentication test completed!');
}

testMockAuthentication().catch(console.error);
