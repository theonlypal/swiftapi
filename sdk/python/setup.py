from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="swiftapi",
    version="1.0.0",
    author="SwiftAPI",
    author_email="support@getswiftapi.com",
    description="Official Python SDK for SwiftAPI - Unified infrastructure API for AI agents",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/theonlypal/swiftapi",
    packages=find_packages(),
    classifiers=[
        "Development Status :: 5 - Production/Stable",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.8",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
    ],
    python_requires=">=3.8",
    install_requires=[
        "requests>=2.28.0",
        "pydantic>=2.0.0",
    ],
)
