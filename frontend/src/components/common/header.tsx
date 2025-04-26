import Link from 'next/link';
import Image from 'next/image';




export const navItems = [
    { href: '/', label: 'Home' },
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/', label: 'Website' },
]


export default function Header() {
    return (
        // bg-[#100355]
      <header className="w-full py-2 px-10 flex justify-between items-center h-20 mb-4 border">
        <div className="flex items-center gap-2">
          
          <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <Image src="/icon.svg" alt="briefly" width={30} height={30} />
            <h1 className=''>Briefly</h1>
          </Link>
          
         
        </div>
        <div>
          {navItems.map((item) => (
            <Link
              href={item.href}
              key={item.label}
              className="text-gray-700 hover:text-gray-900 px-4 py-2 rounded-md"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </header>
    );
  }
