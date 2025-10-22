class SwiftAPIError(Exception):
    """Base exception for SwiftAPI SDK"""

    def __init__(self, message: str, status_code: int = None):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class AuthenticationError(SwiftAPIError):
    """Raised when authentication fails"""
    pass


class RateLimitError(SwiftAPIError):
    """Raised when rate limit is exceeded"""
    pass


class NotFoundError(SwiftAPIError):
    """Raised when resource is not found"""
    pass


class ValidationError(SwiftAPIError):
    """Raised when request validation fails"""
    pass
