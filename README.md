# LearnOnchain: Decentralized Learning Management System

LearnOnchain is a cutting-edge, blockchain-integrated Learning Management System (LMS) built for the Web3 era. It combines the power of Next.js, React, and blockchain technologies to create a decentralized platform for course creation, consumption, and certification.

## 🚀 Key Features

- **Course Browsing & Filtering**: Easy navigation through available courses
- **Blockchain-Powered Payments**: Purchase courses using cryptocurrency
- **Progress Tracking**: Mark chapters as completed and track overall course progress
- **Student Dashboard**: Personalized view of enrolled courses and progress
- **Teacher Mode**: Create and manage courses effortlessly
- **Chapter Management**: Create, edit, and reorder chapters with drag-and-drop functionality
- **Rich Media Support**: Upload thumbnails, attachments, and videos using UploadThing
- **HLS Video Streaming**: High-quality video playback powered by Pinata
- **Rich Text Editor**: Create engaging chapter descriptions
- **Blockchain Authentication**: Secure login using Onchainkit
- **NFT Certificates**: Mint course completion certificates as NFTs on the Base Sepolia network

## 🛠 Technologies Used

- **Frontend**: Next.js 13, React, Tailwind CSS
- **Backend**: Node.js, MongoDB
- **Blockchain**: Solidity, Base Sepolia network
- **Authentication**: Clerk with Coinbase Developer Platform
- **File Storage**: UploadThing, Pinata
- **Payment Processing**: Smart Wallet,Onchainkit, Stripe (for traditional payments)
- **Smart Contract Interaction**: Wagmi
- **Video Streaming**: HLS with Pinata
- **Basename Viewing**: Onchainkit


## 🔗 Links
- [link to devolio project](https://devfolio.co/projects/base-learn-7633)
- [link to live-site](https://base-learn.vercel.app)
- [link to X](https://x.com/onchainlearn)


## 🔧 Setup & Installation

1. Clone the repository:

   ```
   git clone https://github.com/your-username/learnOnchain.git
   cd learnOnchain
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the necessary environment variables (database connection, API keys, contract addresses, etc.)

4. Run the development server:

   ```
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser to view the application.

## 🌐 Smart Contract

The NFT minting functionality is powered by a smart contract deployed on the Base Sepolia network.

Contract Address: `0xF2784350B0e502a1d7bE0A13B425E3f84E2CE8e5`

You can view the contract on [Base Sepolia Explorer](https://sepolia.basescan.org/address/0xF2784350B0e502a1d7bE0A13B425E3f84E2CE8e5).

## 🧪 Testing

To run the test suite:
