import Link from "next/link";
import { TbMailFilled } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";

const Header = () => {
  return (
    <header className="w-full shadow-md bg-white border border-gray-200">
      <div className="container mx-auto px-4 xl:px-8 py-0.5 flex items-center justify-between">
        <div className="flex gap-2 text-xs items-center">
          <TbMailFilled className="text-xl text-gray-700" /> hydraulic@gmail.com
        </div>

        <div className="flex items-center space-x-2 text-[#2E2E2E] font-medium text-xs">
          <div className="flex flex-col text-right">
            <span className="text-xs text-[#6B6B6B]">Helpline</span>
            <Link
              href="tel:+919876543210"
              className="text-xs border-b border-transparent hover:border-[#2E2E2E] hover:border-b-1 transition-all duration-300"
            >
              +91 98765 43210
            </Link>
          </div>
          <RiCustomerService2Fill className="text-3xl" />
        </div>
      </div>
    </header>
  );
};

export default Header;
