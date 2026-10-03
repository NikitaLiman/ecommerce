import {Navbar} from "@/app/(home)/navbar";
import {Footer} from "@/app/(home)/footer";

interface IProps {
    children?: React.ReactNode
}

const Layout = ({children}: IProps) => {
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <div className='flex-1 bg-[#F4F4F0]'>{children}</div>
        <Footer/>
    </div>
  );
};

export default Layout;