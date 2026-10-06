import configPromise from '@payload-config'
import {getPayload} from "payload";

import {Navbar} from "@/app/(app)/(home)/navbar";
import {Footer} from "@/app/(app)/(home)/footer";
import {SearchFilters} from "@/app/(app)/(home)/search-filters";
import {Category} from "@/payload-types";
import {CustomCategory} from "@/app/(app)/(home)/types";

interface IProps {
    children?: React.ReactNode
}

const Layout = async ({children}: IProps) => {

    const payload = await getPayload({
        config: configPromise
    })

    const data = await payload.find({
        collection: 'categories',
        depth: 1,
        pagination: false,
        where: {
            parent: {
                exists: false
            }
        },
        sort: 'name'

    })
    const formattedData: CustomCategory[] = data.docs.map(doc => ({
        ...doc,
        subcategories: (doc.subcategories?.docs ?? []).map((doc) => ({
            ...(doc as Category)
        }))
    }))

    console.log(formattedData)
  return (
    <div className="flex flex-col min-h-screen">
        <Navbar/>
        <SearchFilters data={formattedData} />
        <div className='flex-1 bg-[#F4F4F0]'>{children}</div>
        <Footer/>
    </div>
  );
};

export default Layout;