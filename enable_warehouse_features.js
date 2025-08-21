const fs = require('fs');
const path = require('path');

const controllerPath = path.join(__dirname, 'src/api/v1/Controllers/warehouseController/warehouseController.ts');

function enableWarehouseFeatures() {
    try {
        // Read the current controller file
        let content = fs.readFileSync(controllerPath, 'utf8');
        
        // Change the configuration flag from false to true
        content = content.replace(
            'const ENABLE_USER_NAME_FEATURES = false;',
            'const ENABLE_USER_NAME_FEATURES = true;'
        );
        
        // Write the updated content back
        fs.writeFileSync(controllerPath, content, 'utf8');
        
        console.log('✅ Successfully enabled warehouse user name features!');
        console.log('🔄 Please restart your server for the changes to take effect.');
        
    } catch (error) {
        console.error('❌ Error enabling warehouse features:', error.message);
        console.log('📁 Make sure you are running this script from the project root directory');
    }
}

function disableWarehouseFeatures() {
    try {
        // Read the current controller file
        let content = fs.readFileSync(controllerPath, 'utf8');
        
        // Change the configuration flag from true to false
        content = content.replace(
            'const ENABLE_USER_NAME_FEATURES = true;',
            'const ENABLE_USER_NAME_FEATURES = false;'
        );
        
        // Write the updated content back
        fs.writeFileSync(controllerPath, content, 'utf8');
        
        console.log('✅ Successfully disabled warehouse user name features!');
        console.log('🔄 Please restart your server for the changes to take effect.');
        
    } catch (error) {
        console.error('❌ Error disabling warehouse features:', error.message);
        console.log('📁 Make sure you are running this script from the project root directory');
    }
}

function checkStatus() {
    try {
        const content = fs.readFileSync(controllerPath, 'utf8');
        const isEnabled = content.includes('const ENABLE_USER_NAME_FEATURES = true;');
        
        console.log(`📊 Warehouse User Name Features Status: ${isEnabled ? '✅ ENABLED' : '❌ DISABLED'}`);
        
        if (isEnabled) {
            console.log('💡 Features are enabled. The controller will save both user ID and name.');
        } else {
            console.log('💡 Features are disabled. The controller will only save user ID (for backward compatibility).');
        }
        
    } catch (error) {
        console.error('❌ Error checking status:', error.message);
    }
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
    case 'enable':
        enableWarehouseFeatures();
        break;
    case 'disable':
        disableWarehouseFeatures();
        break;
    case 'status':
        checkStatus();
        break;
    default:
        console.log('🚀 Warehouse Features Management Script');
        console.log('');
        console.log('Usage:');
        console.log('  node enable_warehouse_features.js enable   - Enable user name features');
        console.log('  node enable_warehouse_features.js disable  - Disable user name features');
        console.log('  node enable_warehouse_features.js status   - Check current status');
        console.log('');
        console.log('Note: After enabling/disabling, restart your server for changes to take effect.');
        break;
}
