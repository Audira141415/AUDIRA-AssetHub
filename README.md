<div align="center">
  <img src="https://via.placeholder.com/150/8A2BE2/FFFFFF?text=Audira" alt="Audira AssetHub Logo" width="120" height="120" />

  # AUDIRA AssetHub
  
  **Modern, Intelligent, and Sleek IT Asset Management (ITAM) System**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
  [![Created By](https://img.shields.io/badge/Created_By-Agus_Dwi_R_(AUDIRA)-purple.svg)]()
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-blue?logo=prisma)](https://prisma.io/)
</div>

<br/>

## 🌟 Introduction

**AUDIRA AssetHub** is a next-generation IT Asset Management platform meticulously crafted by **Agus Dwi R (AUDIRA)**. It provides a robust, beautifully designed, and highly functional interface for managing hardware, software licenses, network infrastructure, data center racks, and vendor warranties.

AssetHub is designed with a "Neumorphism" aesthetic with vibrant accents, providing a state-of-the-art user experience for IT administrators, engineers, and auditors.

## ✨ Key Features

- 🖥️ **Full-Lifecycle Asset Tracking:** Track servers, laptops, switches, and other devices from procurement to retirement.
- 🏢 **Deep Location Management:** Map assets accurately through Sites ➔ Buildings ➔ Floors ➔ Rooms ➔ Racks ➔ U-Positions.
- 🗄️ **Data Center / Rack Visualization:** Detailed rack elevations to pinpoint hardware in your physical infrastructure.
- 🛡️ **Warranty & Vendor Management:** Never miss a renewal date. Track software licenses, vendor SLAs, and hardware warranties.
- 🔄 **Movement & Audit Logs:** Complete traceability. Know who moved what, when, and where.
- 📱 **QR Code Scanning:** Quickly identify and audit assets on the go using built-in QR generation and scanning capabilities.
- 🤖 **AI Copilot (Coming Soon):** Embedded intelligence for anomaly detection, asset recommendations, and natural language queries.

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Custom Neumorphic Theme)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **Icons:** Lucide React

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js (v18 or higher)
- PNPM (recommended package manager)
- PostgreSQL Database

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/audira-assethub.git
   cd audira-assethub
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up Environment Variables:**
   Copy the example environment file and fill in your credentials. *(Note: `.env` files are ignored from version control for security)*.
   ```bash
   cp .env.example .env
   ```

4. **Initialize the Database:**
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

5. **Start the Development Server:**
   ```bash
   pnpm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🤝 Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for details on how to submit pull requests, report issues, and follow our [Code of Conduct](./CODE_OF_CONDUCT.md).

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

---
<div align="center">
  <b>Built with passion by <a href="https://github.com/">Agus Dwi R (AUDIRA)</a></b>
</div>
