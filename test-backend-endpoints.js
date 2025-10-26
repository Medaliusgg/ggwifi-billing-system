const http = require('http');

function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({ 
                    status: res.statusCode, 
                    body: body,
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

async function testBackendEndpoints() {
    console.log('🧪 Testing Backend Authentication Endpoints...\n');
    
    try {
        // Test 1: Admin Login
        console.log('1️⃣ Testing Admin Login...');
        const adminLoginResult = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/auth/admin-login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'admin',
            phoneNumber: '0742844024',
            password: 'Kolombo@123%'
        });
        
        console.log(`   Admin Login Status: ${adminLoginResult.status}`);
        console.log(`   Response: ${adminLoginResult.body.substring(0, 200)}`);
        
        if (adminLoginResult.status === 200) {
            console.log('   ✅ Admin login successful');
        } else {
            console.log('   ❌ Admin login failed');
        }
        
        // Test 2: Staff Login
        console.log('\n2️⃣ Testing Staff Login...');
        const staffLoginResult = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/auth/staff-login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        }, {
            username: 'technician1',
            staffId: 'TECH001',
            password: 'Kolombo@123%'
        });
        
        console.log(`   Staff Login Status: ${staffLoginResult.status}`);
        console.log(`   Response: ${staffLoginResult.body.substring(0, 200)}`);
        
        if (staffLoginResult.status === 200) {
            console.log('   ✅ Staff login successful');
        } else {
            console.log('   ❌ Staff login failed');
        }
        
        // Test 3: Dashboard Stats
        console.log('\n3️⃣ Testing Dashboard Stats...');
        const dashboardResult = await makeRequest({
            hostname: 'localhost',
            port: 8080,
            path: '/api/v1/admin/dashboard/stats',
            method: 'GET'
        });
        
        console.log(`   Dashboard Status: ${dashboardResult.status}`);
        console.log(`   Response: ${dashboardResult.body.substring(0, 200)}`);
        
        if (dashboardResult.status === 200) {
            console.log('   ✅ Dashboard stats accessible');
        } else {
            console.log('   ❌ Dashboard stats failed');
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
    
    console.log('\n✅ Backend endpoint testing completed!');
}

testBackendEndpoints().catch(console.error);
