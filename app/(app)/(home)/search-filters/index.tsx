import {SearchInput} from "@/app/(app)/(home)/search-filters/search-input";
import {Categories} from "@/app/(app)/(home)/search-filters/categories";
import {CustomCategory} from "@/app/(app)/(home)/types";

interface IProps {
    data: CustomCategory[];
}

export const SearchFilters = ({data}: IProps) => {
  return (
    <div className="px-4 lg:px-12 py-8 border-b flex flex-col full-w gap-4">
        <SearchInput data={data}/>
       <div className='hidden lg:block'>
           <Categories data={data}/>
       </div>
    </div>
  );
};