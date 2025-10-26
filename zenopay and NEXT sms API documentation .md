1. ZENOPAY PAYMENT API
ZenoPay API Integration Guide – Mobile Money Tanzania
Secure Mobile Money Payments Integration
API Endpoint
URL:
https://zenoapi.com/api/payments/mobile_money_tanzania
Method:
POST
Authentication
Include your API key in the header:
x-api-key: YOUR_API_KEY
Note: Replace
YOUR_API_KEY
with the key provided by ZenoPay.
Request Body
Submit the following JSON payload:
{
"order_id": "3rer407fe-3ee8-4525-456f-ccb95de38250",
"buyer_email": "iam@gmail.com",
"buyer_name": "John Joh",
"buyer_phone": "0744963858",
"amount": 1000
}
Parameter Descriptions
ParameterTypeRequiredDescription
order_idstring✅Unique transaction ID (e.g., UUID)
buyer_emailstring✅Payer's valid email address
buyer_namestring✅Payer's full name
Tanzanian mobile number (format:
buyer_phone
string
✅
07XXXXXXXX
)Amount in TZS (e.g.,
amount
number
✅
1000
= 1000 TZS)
Sample cURL Request
curl -X POST "https://zenoapi.com/api/payments/mobile_money_tanzania" \
-H "Content-Type: application/json" \
-H "x-api-key: YOUR_API_KEY" \
-d '{
"order_id": "3rer407fe-3ee8-4525-456f-ccb95de38250",
"buyer_email": "iam@gmail.com",
"buyer_name": "John Joh",
"buyer_phone": "0744963858",
"amount": 1000
}'
Successful Response
{
"status": "success",
"resultcode": "000",
"message": "Request in progress. You will receive a callback shortly",
"order_id": "3rer407fe-3ee8-4525-456f-ccb95de38250"
}
Error Response
{
"status": "error",
"message": "Invalid API Key or request payload"
}
Check Order Status
URL:
https://zenoapi.com/api/payments/order-status
Method:
GET
Parameter:
order_id=3rer407fe-3ee8-4525-456f-ccb95de38250Sample Request
curl -X GET "https://zenoapi.com/api/payments/order-status?order_id=3rer407fe-3ee8-4525-456f-ccb95de38
-H "x-api-key: YOUR_API_KEY"
Sample Response
{
"reference": "0936183435",
"resultcode": "000",
"result": "SUCCESS",
"message": "Order fetch successful",
"data": [
{
"order_id": "3rer407fe-3ee8-4525-456f-ccb95de38250",
"creation_date": "2025-05-19 08:40:33",
"amount": "1000",
"payment_status": "COMPLETED",
"transid": "CEJ3I3SETSN",
"channel": "MPESA-TZ",
"reference": "0936183435",
"msisdn": "255744963858"
}
]
}
Webhook Notifications
ZenoPay can send automatic notifications to your server when payment status changes to COMPLETED.
Webhook Setup
Include the
webhook_url
parameter in your payment request to receive status updates:
{
"order_id": "3rer407fe-3ee8-4525-456f-ccb95de38250",
"buyer_email": "iam@gmail.com",
"buyer_name": "John Joh",
"buyer_phone": "0744963858",
"amount": 1000,
"webhook_url": "https://your-domain.com/payment-webhook"
}
Webhook Authentication
ZenoPay will send the
x-api-keyin the request header when calling your webhook URL. Verify this key to ensure the request is legitimate.
Webhook Payload Example
{"order_id":"677e43274d7cb","payment_status":"COMPLETED","reference":"1003020496","metadata":{"produc
Note: Webhooks are only triggered when payment status changes to COMPLETED.
Support
For assistance, contact:
Email: support@zenoapi.com
Website: https://zenoapi.com
ZenoPay Team
Simplifying Digital Payments in Tanzania










2. NEXT SMS API DOCUMENTATION.
READ this carefully . its the correct NEXT SMS API DOCUMENTATION.                                                                                                                                                                                                    Developer API
This page will help you get started with API.

This document will provide instructions on how to quickly integrate SMS messaging services into various solutions by using HTTP application programming interface (HTTP API). The HTTP API can be used for sending SMS messages, making Number Context (number validation) requests and receiving inbound SMS messages sent from mobile phones.

API is based on REST standards, enabling you to use your browser for accessing URLs. In order to interact with our API, any HTTP client in any programming language can be used.

Base URL
Submit all requests to the base URL. All the requests are submitted thorough HTTP POST method.

Plain Text
https://messaging-service.co.tz
Content-Type & Accept header
API supports JSON and XML Content-Types and Accept criteria that should be specified in the header. If the Content-Type is not specified you will receive a General error. Depending which Accept type is chosen in the deader for the request, the same one will be applied in the response.

Content-Type: application/json

Accept header: application/json

Authorization
We support basic authorization using a username and password with Base64 encoding variation RFC2045-MIME.

Username and password are combined into a string username:password.

The resulting string is encoded using the RFC2045-MIME variant of Base64.

The authorization method and a space, like this: "Basic ", are put before the encoded string.

note: these below are the creadentials

Username: medalius

Password: Kolombo@123

Base64 encoded string: QWxhZGRpbjpvcGVuIHNlc2FtZQ==

Authorization header: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==

Gerenate your Base64 encoded string here: you can generate it.                                                                                                               API Status codes
Besides standard HTTP status code, status object may be returned as part of the API response message, delivery report or message log.

Status json object example:                                                                                                                                                                                                 {  
   "groupId":3,
   "groupName":"DELIVERED",
   "id":5,
   "name":"DELIVERED_TO_HANDSET",
   "description":"Message delivered to handset"
}                                                                                                                                                                                                                                                    General status codes

PENDING (group id: 18) - general status codes

Message has been processed and sent to the next instance i.e. mobile operator.

Id	Status
50	PENDING_WAITING_DELIVERY - Message has been processed and sent to the next instance i.e. mobile operator with request acknowledgment from their platform. Delivery report has not yet been received, and is awaited thus the status is still pending.
51	ENROUTE (SENT) - Message has been processed and sent to the next instance i.e. mobile operator.
52	PENDING_ACCEPTED - Message has been accepted and processed, and is ready to be sent to the next instance i.e. operator.
DELIVERY (group id: 20) - general status codes

Delivery report received from mobile operators.

View More
Id	Status
73	DELIVERED - The message was successfully delivered.
74	EXPIRED - The SMSC was unable to deliver the message in a specified amount of time.For instance when the phone was turned off.
75	DELETED - The message was deleted.
76	UNDELIVERABLE - The SMS was unable to deliver the message.For instance, when the number does not exist. This status is also returned when SMSC does not send accurate status.
77	ACCEPTED - The SMS was accepted and will be send.
78	UNKNOWN - Unknown error occured.
79	REJECTED - The message was rejected.The provider could have blocked phonenumbers in this range.
80	SKIPPED - The message was skipped.
REJECTED (group id: 19) - general status codes

Message has been received, but has either been rejected by our system, or the operator has reverted Rejected as final status.

View More
Id	Status
53	REJECTED_NETWORK - Message has been received, but the network is either out of our coverage or not setup on your account. Your account manager can inform you on the coverage status or setup the network in question.
54	REJECTED_PREFIX_MISSING - Message has been received, but has been rejected as the number is not recognized due to either incorrect number prefix or number length. This information is different for each network and is regularly updated.
55	REJECTED_DND - Message has been received, and rejected due to the user being subscribed to DND (Do Not Disturb) services, disabling any service traffic to their number.
56	REJECTED_SOURCE - Your account is set to accept only registered sender ID-s while the sender ID defined in the request has not been registered on your account.
57	REJECTED_NOT_ENOUGH_CREDITS - Your account is out of credits for further submission - please top up your account. For further assistance in topping up or applying for online account topup service you may contact your account manager.
58	REJECTED_SENDER - The sender ID has been blacklisted on your account - please remove the blacklist on your account or contact Support for further assistance.
59	REJECTED_DESTINATION - The destination number has been blacklisted either at the operator request or on your account - please contact Support for more information.
60	REJECTED_PREPAID_PACKAGE_EXPIRED - Account credits have been expired past their validity period - please topup your subaccount with credits to extend the validity period.
61	REJECTED_DESTINATION_NOT_REGISTERED - Your account has been setup for submission only to a single number for testing purposes - kindly contact your manager to remove the limitation.
62	REJECTED_ROUTE_NOT_AVAILABLE - Mesage has been received on the system, however your account has not been setup to send messages i.e. no routes on your account are available for further submission. Your account manager will be able to setup your account based on your preference.
63	REJECTED_FLOODING_FILTER - Message has been rejected due to a anti-flooding mechanism. By default, a single number can only receive 20 varied messages and 6 identical messages per hour. If there is a requirement, the limitation can be extended per account on request to your account manager.
64	REJECTED_SYSTEM_ERROR - The request has been rejected due to an expected system system error, please retry submission or contact our technical support team for more details.
65	REJECTED_DUPLICATE_MESSAGE_ID -The request has been rejected due to a duplicate message ID specified in the submit request, while message ID-s should be a unique value
66	REJECTED_INVALID_UDH - Message has been received, while our system detected the message was formatted incorrectly because of either an invalid ESM class parameter (fully featured binary message API method) or an inaccurate amount of characters when using esmclass:64 (UDH). For more information feel free to visit the below articles or contact our Support team for clarification. https://en.wikipedia.org/wiki/User_Data_Header, https://en.wikipedia.org/wiki/Concatenated_SMS
67	REJECTED_MESSAGE_TOO_LONG - Message has been received, but the total message length is more than 25 parts or message text which exceeds 4000 bytes as per our system limitation.
68	MISSING_TO - The request has been received, however the "to" parameter has not been set or it is empty, i.e. there must be valid recipients to send the message.
69	REJECTED_INVALID_DESTINATION - The request has been received, however the destination is invalid - the number prefix is not correct as it does not match a valid number prefix by any mobile operator. Number length is also taken into consideration in verifying number number validity.
Test Mode
You can make a request just to test our API for your development environment, and get responses and understanding them. This feature will send you only dummy data generate from your request. No charges are involved in testing mode, it is free and your current sms balance will not be reducted for the requests you send to the test APIs.

TEST APIs url

For single message text request:

POST https://messaging-service.co.tz/api/sms/v1/test/text/single

For multiple messages text request:

POST https://messaging-service.co.tz/api/sms/v1/test/text/multi

Further instructions are on Send SMS Section  below(notice here)                                                                                                               Send Sms
In a few simple steps, we will explain how to send an SMS using Nextbyte HTTPS API.

Firstly, you'll need a valid Nextbyte account. When you sign up for the account, you will set a username and password. Next, your username and password has to be encoded in base64 like described in the Authorization Section:

The message will be sent only to a valid phone number (numbers), written in international format e.g.255738234345. We strongly recommend using the E.164 number formatting. E.164 numbers are internationally standardized to a fifteen digit maximum length. Phone numbers are usually prefixed with + (plus sign), followed by a country code, network code and the subscriber number. Phone numbers that are not E.164 formatted may work, depending on the handset or network.

When sending a message you can specify reference value which associates the API request payload with your data. This is very useful when fetching delivery reports and logs. This is also useful when at any circumstance the requester does not receive a response from the API endpoint and wants to synchronise information at some point later.                                                                                                                                                                                                                                   POST
Single destination
https://messaging-service.co.tz/api/sms/v1/text/single
Now, you are ready to send your first SMS message using:

POST https://messaging-service.co.tz/api/sms/v1/text/single

For testing your request use the url below:

POST https://messaging-service.co.tz/api/sms/v1/test/text/single

Request body contains the message you wish to send with from, to and message parameters.                                         Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.post("https://messaging-service.co.tz/api/sms/v1/test/text/single")
  .header("Authorization", "Basic aW0yM246MjNuMjNu")
  .header("Content-Type", "application/json")
  .header("Accept", "application/json")
  .body("{\"from\":\"N-SMS\", \"to\":\"255716718040\",  \"text\": \"Your message\", \"reference\": \"aswqetgcv\"}")
  .asString();


HEADERS
Authorization
Basic dGVzdDE6MTIzNDU2

Content-Type
application/json

Accept
application/json

Body
raw                                                                                                                                                                                                                             {"from": "N-SMS", "to": "255716718040", "text": "Your message", "reference":"xaefcgt"}                                                                                                                     {
  "messages": [
    {
      "to": "255716718040",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    }
  ]
}                                                                                                                                                                                                                                                                                                                                                                              POST
Multiple destinations
https://messaging-service.co.tz/api/sms/v1/text/single
For sending the single messages to multiple phone numbers, you need to perform:

POST https://messaging-service.co.tz/api/sms/v1/text/single

Request body contains the message you wish to send with from, to and message parameters.                                             Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.post("https://messaging-service.co.tz/api/sms/v1/text/single")
  .header("Authorization", "Basic dGVzdDE6MTIzNDU2")
  .header("Content-Type", "application/json")
  .header("Accept", "application/json")
  .body("{\"from\":\"N-SMS\", \"to\":[\"255655912841\", \"255716718040\"],  \"text\": \"Your message\", \"reference\": \"aswqetgcv\"}")
  .asString();                                                                                                                                                                                                                         HEADERS
Authorization
Basic dGVzdDE6MTIzNDU2

Content-Type
application/json

Accept
application/json

Body
raw                                                                                                                                                                                                                   {"from":"N-SMS", "to":["255655912841", "255716718040"],  "text": "Your message", "reference": "aswqetgcv"}                                                                                                                                                                                                                                         {
  "messages": [
    {
      "to": "255655912841",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    },
    {
      "to": "255716718040",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    }
  ]
}
POST
Multiple messages to Multiple destinations (Example 2)
https://messaging-service.co.tz/api/sms/v1/text/multi
For sending the multiple messages to multiple phone numbers, you need to perform:

POST https://messaging-service.co.tz/api/sms/v1/text/multi
HEADERS
Authorization
Basic dGVzdDE6MTIzNDU2

Content-Type
application/json

Accept
application/json

Body
raw (json)                                                     
{"messages": [{"from": "N-SMS","to": ["255716718040","255758483019"],"text": "Your message"},{"from": "N-SMS","to": ["255758483019", "255655912841","255716718040"],"text": "Your other message"}], "reference": "aswqetgcv"}                                                                                                                                                                                                                            {
  "messages": [
    {
      "to": "255716718040",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    },
    {
      "to": "255758483019",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    },
    {
      "to": "255758483019",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    },
    {
      "to": "255655912841",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    },
    {
      "to": "255716718040",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "smsCount": 1
    }
  ]
}                                                                                                                                                                                                                                                                                                                        POST
Schedule SMS
https://messaging-service.co.tz/api/sms/v1/text/single
To send schedule sms you required to have the following parameters:

from - your Sender ID

to - recipient phone number with the format begin with 255

text - your text message

date - date of the day to which you want to send your sms, format of Year-month-date exapmle:2020-10-01

time - time of the day to which you want to send your sms, 24 hours format exapmle:12:00

Optional parameters to the schedule sms

repeat - you can add this parameter when you want your sms to be repeated. This must be with these values in order to work: hourly, daily, weekly or monthly

start_date - this parameter defines the date from this your sms can start sending, format of Year-month-date exapmle:2020-10-01.

end_date - this parameter defines the date from this your sms can end sending, format of Year-month-date exapmle:2021-01-01.                                                                                                                                                                                          {
  "messages": [
    {
      "to": "255716718040",
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 26,
        "name": "PENDING_ACCEPTED",
        "description": "Pending accepted , will be sent on scheduled time."
      },
      "smsCount": 1
    }
  ]
}                                                                                                                                                                                                                                       HEADERS
Authorization
Basic dGVzdDE6MTIzNDU2

Content-Type
application/json

Accept
application/json

Body
raw                                                                                                                                                                                                                                                                                                                                                                                                     {"from": "N-SMS", "to": "255716718040", "text": "Your message", "date": "2020-10-01" , "time": "12:00"}                          .                                                                                                                                                                                                                                GET
Send Sms Via Link
https://messaging-service.co.tz/link/sms/v1/text/single?username=myuser&password=mypass&from=N-SMS&to=255655000000&text=TestMessage
PARAMS
username
myuser

password
mypass

from
N-SMS

to
255655000000

text
TestMessage

                                                                                                                                                                                                                                                      Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.get("https://messaging-service.co.tz/link/sms/v1/text/single?username=myuser&password=mypass&from=N-SMS&to=255655000000&text=TestMessage")
  .asString();
                                                                                                                                                                                                                                         Sms Delivery Reports
GET https://messaging-service.co.tz/api/sms/v1/reports

Delivery report per recipient can only be retrieved/queried once, hence make sure to store them for your reference once retrieved. Available query parameters are:

size:

Specify the number of reports to be retrieved per request. The default and maximum size is 500.

https://messaging-service.co.tz/api/sms/v1/reports?size=200

sender:
Get delivery reports for a specific sender.

https://messaging-service.co.tz/api/sms/v1/reports?sender=N-SMS

messageId:
The ID uniquely identifies the message sent. You will receive a messageId in the response after sending a message.

https://messaging-service.co.tz/api/sms/v1/reports?messageId=348833233

The following additional parameters are still used but will be deprecated in the next minor upgrade.

sentSince and sentUntil:
These are dates within the delivery reports you request to see. These are required both in order to get your requested reports.

reference:

This is the special value which was used during sending a message to associate the sent message with specific API request values.

Using these parameters is optional you can just use the provided API url to get all of the delivery reports status which you have never retrieved before.

Examples on how requests can be made is shown as follows in API url:

https://messaging-service.co.tz/api/sms/v1/reports?sentFrom=2020-01-01&sentUntil=2020-12-31

if no data is found the results will be returned as follows:

{
    "results":[]
}                                                                                                                                                                                                                                          GET
Get all delivery reports
https://messaging-service.co.tz/api/sms/v1/reports
HEADERS
Authorization
Basic aW0yM246MTIzN44DU2

Content-Type
application/json

Accept
application/json                                                                                                                                                                                                                                                                                                              Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.get("https://messaging-service.co.tz/api/sms/v1/reports")
  .header("Authorization", "Basic aW0yM246MTIzNDU2")
  .header("Accept", "application/json")
  .body("")
  .asString();
                                                                                                                                                                                                                                                                                                                               {
  "results": [
    {
      "messageId": "2808579298410163167",
      "sentAt": "2020-02-08 12:28:51",
      "doneAt": "2020-04-21 18:23:07",
      "to": "255716718040",
      "smsCount": 1,
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "error": {
        "groupId": 0,
        "groupName": "OK",
        "id": 0,
        "name": "NO_ERROR",
        "description": "No Error",
        "permanent": false
      }
    },
    {
      "messageId": "28227686813403535606",
      "sentAt": "2020-02-21 12:21:00",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "smsCount": 1,
      "status": null,
      "error": null
    },
    {
      "messageId": "28089492984101631440",
      "sentAt": "2020-02-05 12:28:51",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "smsCount": 1,
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "error": {
        "groupId": 0,
        "groupName": "OK",
        "id": 0,
        "name": "NO_ERROR",
        "description": "No Error",
        "permanent": false
      }
    }
  ]
}                                                                                                                                                                                                                                  GET
Get delivery reports with messageId
https://messaging-service.co.tz/api/sms/v1/reports?messageId=28089492984101631440
HEADERS
Authorization
Basic aW0yM246MTIzNDU2

Accept
application/json

PARAMS
messageId
28089492984101631440                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.get("https://messaging-service.co.tz/api/sms/v1/reports?messageId=28089492984101631440")
  .header("Authorization", "Basic aW0yM246MTIzNDU2")
  .header("Accept", "application/json")
  .body("")
  .asString();
                                                                                                                                                                                                                                           {
  "results": [
    {
      "messageId": "28089492984101631440",
      "sentAt": "2020-02-05 12:28:51",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "smsCount": 1,
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "error": {
        "groupId": 0,
        "groupName": "OK",
        "id": 0,
        "name": "NO_ERROR",
        "description": "No Error",
        "permanent": false
      }
    }
  ]
}                                                                                                                                                                                                                                                         GET
Get delivery reports with specific date range (To be deprecated)
https://messaging-service.co.tz/api/sms/v1/reports?sentSince=2020-02-01&sentUntil=2020-02-20
HEADERS
Authorization
Basic aW0yM246MTIzNDU2

Accept
application/json

PARAMS
sentSince
2020-02-01

sentUntil
2020-02-20                                                                                                                                                                                                                                         Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.get("https://messaging-service.co.tz/api/sms/v1/reports?sentSince=2020-02-01&sentUntil=2020-02-20")
  .header("Authorization", "Basic aW0yM246MTIzNDU2")
  .header("Accept", "application/json")
  .body("")
  .asString();
 {
  "results": [
    {
      "messageId": "28089492984101631440",
      "sentAt": "2020-02-05 12:28:51",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "smsCount": 1,
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "error": {
        "groupId": 0,
        "groupName": "OK",
        "id": 0,
        "name": "NO_ERROR",
        "description": "No Error",
        "permanent": false
      }
    }
  ]
}                                                                                                                                                                                                                                                                                                                                                                                                  Sent Sms Logs
Logs with sent SMS message history can be requested for all messages by using a single request:

GET https://messaging-service.co.tz/api/sms/v1/logs

GET
Get all sent SMS logs
http://messaging-service.co.tz/api/sms/v1/logs?from=NEXTSMS&limit=5&offset=20
Let's see what happens when you request all of your logs, without any query parameter:                                                                                 Unirest.setTimeouts(0, 0);
HttpResponse<String> response = Unirest.get("https://messaging-service.co.tz/api/sms/v1/logs")
  .header("Authorization", "Basic aW0yM246MTIzNDU2")
  .header("Content-Type", "application/json")
  .header("Accept", "application/json")
  .body("")
  .asString();
 HEADERS
Authorization
Basic aW0yM246MTIzNDU2

Content-Type
application/json

Accept
application/json

PARAMS
from
NEXTSMS

limit
5

offset
20                                                                                                                                                                                                                                                                                                         {
  "results": [
    {
      "messageId": "28695733526003536021",
      "sentAt": "2020-04-15 16:09:00",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "from": "NEXTSMS",
      "text": "test",
      "smsCount": 1,
      "status": {
        "groupId": 1,
        "groupName": "PENDING",
        "id": 7,
        "name": "PENDING_ENROUTE",
        "description": "Message sent to next instance"
      },
      "error": null
    },
    {
      "messageId": "28255409354101630625",
      "sentAt": "2020-02-24 17:21:00",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "from": "NEXTSMS",
      "text": "test",
      "smsCount": 1,
      "status": {
        "groupId": 5,
        "groupName": "REJECTED",
        "id": 12,
        "name": "REJECTED_NOT_ENOUGH_CREDITS",
        "description": "Not enough credits"
      },
      "error": null
    },
    {
      "messageId": "28089492984101631440",
      "sentAt": "2020-02-05 12:28:51",
      "doneAt": "2020-04-18 18:23:07",
      "to": "255716718040",
      "from": "NEXTSMS",
      "text": "Your message",
      "smsCount": 1,
      "status": {
        "groupId": 3,
        "groupName": "DELIVERED",
        "id": 5,
        "name": "DELIVERED_TO_HANDSET",
        "description": "Message delivered to handset"
      },
      "error": {
        "groupId": 0,
        "groupName": "OK",
        "id": 0,
        "name": "NO_ERROR",
        "description": "No Error",
        "permanent": false
      }
    }
  ]
}