import { TbMailFilled } from "react-icons/tb";
import { RiCustomerService2Fill } from "react-icons/ri";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

const Header = async () => {
  const res = await fetch(`${BASE_URL}/api/pages/contactpage`, {
    cache: "no-store",
  });
  const data = await res.json();
  const contact = data?.data || [];
  return (
    <header className="w-full hidden md:block shadow-md bg-white border border-gray-200">
      <div className="2xl:container mx-auto px-4 2xl:px-8 py-0.5 flex items-center justify-between">
        <div className="flex gap-2 text-xs items-center">
          <TbMailFilled className="text-xl text-gray-700" />
          {contact?.emails?.slice(0, 1).map((email: any, idx: number) => (
            <p key={idx} className="text-sm">
              {email}
            </p>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-[#2E2E2E] font-medium text-xs">
          <div className="flex flex-col text-right">
            <span className="text-xs text-[#6B6B6B]">Helpline</span>
            {contact?.numbers?.slice(0, 1).map((num: any, idx: number) => (
              <p
                key={idx}
                className="text-xs border-b border-transparent hover:border-[#2E2E2E] hover:border-b-1 transition-all duration-300"
              >
                {num}
              </p>
            ))}
          </div>
          <RiCustomerService2Fill className="text-3xl" />
        </div>
      </div>
    </header>
  );
};

export default Header;
