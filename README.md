# Blockchain Application

This is mini Blockchain Application. A simple implementation of a decentralized blockchain network using TypeScript. 
This README will guide you through setting up, running, and understanding the application.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The Blockchain application is a basic demonstrationhow a decentralized network can manage transactions and blocks using elliptic curve cryptography, 
we are using secpk256k1 as Bitcoin is using it, nevertheless that is agnostic to elliptic curve.
It's important to note that this is a simplified example and not suitable for production environments.
Current implementation only works for local network

## Features

- Create and manage transactions
- Generate blocks with proof-of-work
- Verify transactions using digital signatures
- Broadcast transactions and blocks to the network
- Add nodes to the network

## Prerequisites

- Node.js
- npm (Node Package Manager)
- TypeScript
- Understanding of blockchain in general

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Fugazzii/blockchain
   cd blockchain

## Contributing
Contributions are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch: git checkout -b feature/my-feature.
3. Make your changes and test thoroughly.
4. Commit your changes: git commit -am 'Add new feature'.
5. Push to the branch: git push origin feature/my-feature.
6. Create a pull request on GitHub.

## License
This project is licensed under the [MIT License](https://opensource.org/license/mit/). 
**Disclaimer:** This project is for educational and demonstration purposes only. It may not be suitable for production use. Use at your own risk.

Feel free to modify the template to match the specifics of your application, including adding more detailed explanations, architecture diagrams, or information about how to extend the codebase. Make sure to replace placeholders like `your-username` with actual values and provide accurate and helpful information to potential users and contributors.
