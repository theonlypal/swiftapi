"""
Basic usage examples for SwiftAPI Python SDK
"""

from swiftapi import SwiftAPI, TierEnum

def main():
    # Initialize client with API key
    client = SwiftAPI(api_key="sk_your_api_key_here")

    # Or authenticate with email/password
    # client = SwiftAPI()
    # client.login("your@email.com", "your_password")

    # Get current user information
    user = client.get_current_user()
    print(f"Email: {user.email}")
    print(f"Tier: {user.tier}")
    print(f"Monthly volume: ${user.monthly_volume:.2f}")

    # Create a new API key
    new_key = client.create_api_key("My Production Key")
    print(f"\nNew API key created: {new_key.key}")
    print(f"Key ID: {new_key.id}")

    # List all API keys
    keys = client.list_api_keys()
    print(f"\nTotal API keys: {len(keys)}")
    for key in keys:
        status = "Active" if key.is_active else "Revoked"
        print(f"  - {key.name}: {status}")

    # Get usage statistics
    usage = client.get_usage()
    print(f"\nUsage Statistics:")
    print(f"  API calls today: {usage.calls.today}")
    print(f"  API calls this month: {usage.calls.month}")
    print(f"  Rate limit (minute): {usage.rate_limits.minute_remaining} remaining")
    print(f"  Rate limit (hour): {usage.rate_limits.hour_remaining} remaining")

    # Create a payment
    transaction = client.create_payment(
        amount=100.00,
        currency="usd",
        metadata={"order_id": "ORDER_12345"}
    )
    print(f"\nPayment created:")
    print(f"  Transaction ID: {transaction.id}")
    print(f"  Amount: ${transaction.amount:.2f}")
    print(f"  Fee: ${transaction.fee_amount:.2f}")
    print(f"  Status: {transaction.status}")

    # Upgrade subscription
    subscription = client.create_subscription(TierEnum.PRO)
    print(f"\nSubscription upgrade initiated:")
    print(f"  Tier: {subscription.tier}")
    print(f"  Status: {subscription.status}")
    if subscription.client_secret:
        print(f"  Complete payment with client secret: {subscription.client_secret}")

if __name__ == "__main__":
    main()
