import requests
from typing import Dict, List, Optional
from .models import User, APIKey, Subscription, Transaction, Usage, TierEnum
from .exceptions import SwiftAPIError, AuthenticationError, RateLimitError, NotFoundError


class SwiftAPI:
    """Official Python client for SwiftAPI"""

    def __init__(self, api_key: Optional[str] = None, base_url: str = "https://api.getswiftapi.com"):
        """
        Initialize SwiftAPI client

        Args:
            api_key: Your SwiftAPI API key (optional for auth endpoints)
            base_url: Base URL for SwiftAPI (default: https://api.getswiftapi.com)
        """
        self.base_url = base_url.rstrip('/')
        self.api_key = api_key
        self.access_token: Optional[str] = None
        self.session = requests.Session()

        if self.api_key:
            self.session.headers['Authorization'] = f'Bearer {self.api_key}'

    def _request(self, method: str, endpoint: str, **kwargs) -> Dict:
        """Make HTTP request to SwiftAPI"""
        url = f"{self.base_url}{endpoint}"

        if self.access_token and not self.api_key:
            self.session.headers['Authorization'] = f'Bearer {self.access_token}'

        try:
            response = self.session.request(method, url, **kwargs)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            status_code = e.response.status_code
            try:
                error_detail = e.response.json().get('detail', str(e))
            except:
                error_detail = str(e)

            if status_code == 401:
                raise AuthenticationError(error_detail, status_code)
            elif status_code == 404:
                raise NotFoundError(error_detail, status_code)
            elif status_code == 429:
                raise RateLimitError(error_detail, status_code)
            else:
                raise SwiftAPIError(error_detail, status_code)
        except requests.exceptions.RequestException as e:
            raise SwiftAPIError(str(e))

    def signup(self, email: str, password: str) -> Dict:
        """
        Create new user account

        Args:
            email: User email address
            password: User password

        Returns:
            Dictionary with access_token and user info
        """
        response = self._request('POST', '/auth/signup', json={
            'email': email,
            'password': password
        })
        self.access_token = response['access_token']
        return response

    def login(self, email: str, password: str) -> Dict:
        """
        Authenticate and get access token

        Args:
            email: User email address
            password: User password

        Returns:
            Dictionary with access_token and user info
        """
        response = self._request('POST', '/auth/login', json={
            'email': email,
            'password': password
        })
        self.access_token = response['access_token']
        return response

    def get_current_user(self) -> User:
        """
        Get current user information

        Returns:
            User object with current user details
        """
        data = self._request('GET', '/auth/me')
        return User(**data)

    def create_api_key(self, name: str) -> APIKey:
        """
        Generate new API key

        Args:
            name: Name for the API key

        Returns:
            APIKey object with the new key
        """
        data = self._request('POST', '/api-keys', json={'name': name})
        return APIKey(**data)

    def list_api_keys(self) -> List[APIKey]:
        """
        List all API keys for the current user

        Returns:
            List of APIKey objects
        """
        data = self._request('GET', '/api-keys')
        return [APIKey(**key) for key in data]

    def delete_api_key(self, key_id: str) -> Dict:
        """
        Revoke an API key

        Args:
            key_id: ID of the API key to revoke

        Returns:
            Success confirmation
        """
        return self._request('DELETE', f'/api-keys/{key_id}')

    def create_subscription(self, tier: TierEnum) -> Subscription:
        """
        Upgrade or change subscription tier

        Args:
            tier: Target subscription tier

        Returns:
            Subscription object with payment details
        """
        data = self._request('POST', '/subscriptions', json={'tier': tier.value})
        return Subscription(**data)

    def create_payment(
        self,
        amount: float,
        currency: str = "usd",
        metadata: Optional[Dict] = None
    ) -> Transaction:
        """
        Process payment with 2% fee capture

        Args:
            amount: Payment amount in dollars
            currency: Currency code (default: usd)
            metadata: Additional payment metadata

        Returns:
            Transaction object with payment details
        """
        data = self._request('POST', '/payments', json={
            'amount': amount,
            'currency': currency,
            'metadata': metadata or {}
        })
        return Transaction(**data)

    def get_usage(self) -> Usage:
        """
        Get usage statistics for the current user

        Returns:
            Usage object with detailed statistics
        """
        data = self._request('GET', '/usage')
        return Usage(**data)

    def health_check(self) -> Dict:
        """
        Check API health status

        Returns:
            Health status dictionary
        """
        return self._request('GET', '/health')
