const http = require('http');

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ 
                    status: res.statusCode, 
                    body: body.substring(0, 2000),
                    headers: res.headers
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

async function testLoginRedirect() {
    console.log('🧪 Testing Login and Redirect Flow...\n');
    
    try {
        // Test 1: Login page
        console.log('1️⃣ Testing Login Page...');
        const loginResult = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/login',
            method: 'GET'
        });
        
        console.log(`   Login Page Status: ${loginResult.status}`);
        
        if (loginResult.status === 200) {
            console.log('   ✅ Login page accessible');
            
            if (loginResult.body.includes('Admin Portal Login') || loginResult.body.includes('Login')) {
                console.log('   ✅ Login form found');
            } else {
                console.log('   ⚠️ Login form not found');
            }
        }
        
        // Test 2: Dashboard page (should redirect to login if not authenticated)
        console.log('\n2️⃣ Testing Dashboard Access...');
        const dashboardResult = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/dashboard',
            method: 'GET'
        });
        
        console.log(`   Dashboard Status: ${dashboardResult.status}`);
        
        if (dashboardResult.status === 200) {
            console.log('   ✅ Dashboard page accessible');
            
            if (dashboardResult.body.includes('Admin Dashboard')) {
                console.log('   ✅ Dashboard content found');
            } else if (dashboardResult.body.includes('Login')) {
                console.log('   ⚠️ Redirected to login (expected if not authenticated)');
            } else {
                console.log('   ⚠️ Unknown content');
            }
        }
        
        // Test 3: Root page
        console.log('\n3️⃣ Testing Root Page...');
        const rootResult = await makeRequest({
            hostname: 'localhost',
            port: 3001,
            path: '/',
            method: 'GET'
        });
        
        console.log(`   Root Status: ${rootResult.status}`);
        
        if (rootResult.status === 200) {
            console.log('   ✅ Root page accessible');
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n4️⃣ Debugging Steps:');
    console.log('   1. Open browser: http://localhost:3001');
    console.log('   2. Check browser console for debug logs');
    console.log('   3. Try logging in with any credentials');
    console.log('   4. Check if redirect happens after login');
    console.log('   5. Look for "🔍 Mock AuthStore" and "🔍 ProtectedRoute" logs');
    
    console.log('\n5️⃣ Expected Flow:');
    console.log('   1. User visits /dashboard');
    console.log('   2. ProtectedRoute checks authentication');
    console.log('   3. If not authenticated, redirect to /login');
    console.log('   4. User logs in with any credentials');
    console.log('   5. Mock auth store sets isAuthenticated: true');
    console.log('   6. Navigate to /dashboard');
    console.log('   7. ProtectedRoute allows access');
    console.log('   8. Dashboard renders with modules');
    
    console.log('\n✅ Login redirect test completed!');
}

testLoginRedirect().catch(console.error);
