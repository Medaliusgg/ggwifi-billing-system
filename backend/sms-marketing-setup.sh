#!/bin/bash

# SMS Marketing Setup Script for GGNetworks
# This script sets up SMS marketing integration with phone number collections

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_status "Starting SMS Marketing setup for GGNetworks..."

# Create directories
mkdir -p /etc/ggnetworks/sms
mkdir -p /var/log/ggnetworks/sms

# Create SMS configuration
print_status "Creating SMS configuration..."
cat > /etc/ggnetworks/sms/config.json << 'EOF'
{
  "sms_gateway": {
    "provider": "africastalking",
    "api_key": "YOUR_API_KEY",
    "api_secret": "YOUR_API_SECRET",
    "sender_id": "GGNetworks",
    "base_url": "https://api.africastalking.com/version1/messaging",
    "timeout": 30000
  },
  "templates": {
    "welcome_message": "Welcome to GGNetworks! Enjoy high-speed internet access.",
    "promotional_message": "Special offer: Get 20% off on monthly plans this week!",
    "payment_reminder": "Your GGNetworks payment is due. Please recharge to continue.",
    "service_alert": "Your GGNetworks service will expire soon. Recharge now."
  }
}
EOF

# Create SMS service script
print_status "Creating SMS service script..."
cat > /usr/local/bin/ggnetworks-sms.sh << 'EOF'
#!/bin/bash

# GGNetworks SMS Service Script
SMS_CONFIG="/etc/ggnetworks/sms/config.json"
SMS_LOG="/var/log/ggnetworks/sms/sms.log"
DB_HOST="localhost"
DB_USER="ggnetworks"
DB_PASS="ggnetworks_password"
DB_NAME="ggnetworks"

# Load configuration
if [ -f "$SMS_CONFIG" ]; then
    SENDER_ID=$(jq -r '.sms_gateway.sender_id' "$SMS_CONFIG")
    API_KEY=$(jq -r '.sms_gateway.api_key' "$SMS_CONFIG")
    API_SECRET=$(jq -r '.sms_gateway.api_secret' "$SMS_CONFIG")
    BASE_URL=$(jq -r '.sms_gateway.base_url' "$SMS_CONFIG")
else
    echo "SMS configuration not found"
    exit 1
fi

# Log function
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$SMS_LOG"
}

# Send SMS function
send_sms() {
    local phone_number="$1"
    local message="$2"
    
    # Validate phone number
    if [[ ! "$phone_number" =~ ^\+255[0-9]{8}$ ]]; then
        log_message "Invalid phone number format: $phone_number"
        return 1
    fi
    
    # Send SMS via API
    response=$(curl -s -X POST "$BASE_URL" \
        -H "Accept: application/json" \
        -H "Content-Type: application/json" \
        -H "apiKey: $API_KEY" \
        -d "{
            \"username\": \"$API_KEY\",
            \"to\": \"$phone_number\",
            \"message\": \"$message\",
            \"from\": \"$SENDER_ID\"
        }")
    
    # Parse response
    if echo "$response" | jq -e '.SMSMessageData.Recipients[0].status' > /dev/null; then
        status=$(echo "$response" | jq -r '.SMSMessageData.Recipients[0].status')
        message_id=$(echo "$response" | jq -r '.SMSMessageData.Recipients[0].messageId')
        
        if [ "$status" = "Success" ]; then
            log_message "SMS sent successfully to $phone_number (ID: $message_id)"
            
            # Update database
            mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -e "
                INSERT INTO sms_messages (phone_number, message_content, status, message_id, sent_at)
                VALUES ('$phone_number', '$message', 'SENT', '$message_id', NOW())
                ON DUPLICATE KEY UPDATE
                status = 'SENT', message_id = '$message_id', sent_at = NOW();
            "
            return 0
        else
            log_message "SMS failed to send to $phone_number: $status"
            return 1
        fi
    else
        log_message "SMS API error: $response"
        return 1
    fi
}

# Get phone numbers by segment
get_phone_numbers_by_segment() {
    local segment="$1"
    
    case "$segment" in
        "hotspot_users")
            mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "
                SELECT DISTINCT phone_number FROM users 
                WHERE role = 'HOTSPOT_USER' AND status = 'ACTIVE' 
                AND phone_number IS NOT NULL AND phone_number != ''
            "
            ;;
        "pppoe_users")
            mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "
                SELECT DISTINCT phone_number FROM users 
                WHERE role = 'PPPOE_USER' AND status = 'ACTIVE' 
                AND phone_number IS NOT NULL AND phone_number != ''
            "
            ;;
        "all_users")
            mysql -h"$DB_HOST" -u"$DB_USER" -p"$DB_PASS" "$DB_NAME" -sN -e "
                SELECT DISTINCT phone_number FROM users 
                WHERE status = 'ACTIVE' 
                AND phone_number IS NOT NULL AND phone_number != ''
            "
            ;;
        *)
            log_message "Unknown segment: $segment"
            return 1
            ;;
    esac
}

# Send campaign
send_campaign() {
    local campaign_name="$1"
    local segment="$2"
    local message="$3"
    
    log_message "Starting campaign: $campaign_name (Segment: $segment)"
    
    # Get phone numbers
    phone_numbers=$(get_phone_numbers_by_segment "$segment")
    
    if [ -z "$phone_numbers" ]; then
        log_message "No phone numbers found for segment: $segment"
        return 1
    fi
    
    # Count phone numbers
    count=$(echo "$phone_numbers" | wc -l)
    log_message "Found $count phone numbers for campaign"
    
    # Send SMS to each phone number
    success_count=0
    failed_count=0
    
    while IFS= read -r phone_number; do
        if send_sms "$phone_number" "$message"; then
            ((success_count++))
        else
            ((failed_count++))
        fi
        
        # Rate limiting
        sleep 0.1
    done <<< "$phone_numbers"
    
    log_message "Campaign completed: $success_count successful, $failed_count failed"
}

# Main function
case "$1" in
    "send")
        send_sms "$2" "$3"
        ;;
    "campaign")
        send_campaign "$2" "$3" "$4"
        ;;
    *)
        echo "Usage: $0 {send|campaign}"
        echo "  send <phone> <message>"
        echo "  campaign <name> <segment> <message>"
        exit 1
        ;;
esac
EOF

chmod +x /usr/local/bin/ggnetworks-sms.sh

# Create monitoring script
print_status "Creating monitoring script..."
cat > /usr/local/bin/monitor-sms.sh << 'EOF'
#!/bin/bash

# SMS Marketing Monitoring Script

echo "=== GGNetworks SMS Marketing Status ==="

# Check recent SMS statistics
echo -e "\n=== Recent SMS Statistics (Last 24 hours) ==="
mysql -hlocalhost -uggnetworks -pggnetworks_password ggnetworks -e "
SELECT 
    COUNT(*) as total_messages,
    SUM(CASE WHEN status = 'SENT' THEN 1 ELSE 0 END) as sent,
    SUM(CASE WHEN delivery_status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
    SUM(CASE WHEN status = 'FAILED' THEN 1 ELSE 0 END) as failed
FROM sms_messages 
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
"

# Check phone number segments
echo -e "\n=== Phone Number Segments ==="
mysql -hlocalhost -uggnetworks -pggnetworks_password ggnetworks -e "
SELECT 
    'Hotspot Users' as segment, COUNT(*) as count
FROM users WHERE role = 'HOTSPOT_USER' AND status = 'ACTIVE' AND phone_number IS NOT NULL
UNION ALL
SELECT 
    'PPPoE Users' as segment, COUNT(*) as count
FROM users WHERE role = 'PPPOE_USER' AND status = 'ACTIVE' AND phone_number IS NOT NULL
UNION ALL
SELECT 
    'All Active Users' as segment, COUNT(*) as count
FROM users WHERE status = 'ACTIVE' AND phone_number IS NOT NULL;
"
EOF

chmod +x /usr/local/bin/monitor-sms.sh

# Set proper permissions
chown -R root:root /etc/ggnetworks/sms
chmod -R 755 /etc/ggnetworks/sms
chown -R root:root /var/log/ggnetworks/sms
chmod -R 755 /var/log/ggnetworks/sms

print_success "SMS Marketing setup completed!"
echo ""
echo "=== Setup Summary ==="
echo "SMS Configuration: /etc/ggnetworks/sms/config.json"
echo "SMS Service: /usr/local/bin/ggnetworks-sms.sh"
echo "Monitoring: /usr/local/bin/monitor-sms.sh"
echo "Logs: /var/log/ggnetworks/sms/"
echo ""
echo "=== Next Steps ==="
echo "1. Update SMS API credentials in /etc/ggnetworks/sms/config.json"
echo "2. Test SMS sending: /usr/local/bin/ggnetworks-sms.sh send +255123456789 'Test message'"
echo "3. Send campaign: /usr/local/bin/ggnetworks-sms.sh campaign 'Test Campaign' hotspot_users 'Test message'"
echo "4. Monitor activity: /usr/local/bin/monitor-sms.sh"
