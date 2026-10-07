import {Category} from "@/payload-types";
import Link from "next/link";
import {CategoriesGetManyOutputs} from "@/modules/categories/types";

interface IProps {
    isOpen: boolean;
    category: CategoriesGetManyOutputs[1];
    position: {top: number; left: number};
}

export const SubCategoryMenu = ({isOpen,category,position}: IProps) => {
  if(!isOpen || !category.subcategories || category.subcategories.length === 0) return null;
    console.log(category,'category');

  const backgroundColor = category.color || "F5F5F5"

    return (
        <div style={{top: position.top, left: position.left}} className='fixed z-[100]'>
            <div className='pt-3 w-60'>
                <div
                    style={{backgroundColor: backgroundColor}}
                    className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-x-[2px] -translate-y-[2px]">
                    <div>
                        {category.subcategories.map((subcategory: Category) => (
                            <Link className='w-full hover:bg-black textl-left p-4 hover:text-white flex justify-between
                            items-center underline font-medium' key={subcategory.slug} href={`/${category.slug}/${subcategory.slug}`}>{subcategory.name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )

};