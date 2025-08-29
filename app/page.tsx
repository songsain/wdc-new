import Image from "next/image";

export default function Home() {
  return (
    <div className="font-sans min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a] text-white p-8">
      
      {/* 로고 */}
      <header className="mb-12">
        <Image
          src="/wonderchain-logo.png" // 로고 이미지 파일
          alt="WonderChain Logo"
          width={200}
          height={60}
        />
      </header>

      {/* 소개 텍스트 */}
      <main className="text-center space-y-6 max-w-xl">
        <h1 className="text-4xl font-bold">Welcome to WonderChain</h1>
        <p className="text-lg text-gray-300">
          Explore the next generation Web3.5 ecosystem. Join our community and
          experience blockchain innovation like never before.
        </p>

        {/* 버튼 영역 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
          <a
            href="https://wonderchain.net"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 transition-colors px-6 py-3 rounded-md font-semibold"
          >
            Visit Website
          </a>
          <a
            href="https://t.me/wonderchain"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black hover:bg-gray-200 transition-colors px-6 py-3 rounded-md font-semibold"
          >
            Join Telegram
          </a>
        </div>
      </main>

      {/* 푸터 */}
      <footer className="mt-auto text-gray-400 text-sm pt-12">
        © 2025 WonderChain. All rights reserved.
      </footer>
    </div>
  );
}
