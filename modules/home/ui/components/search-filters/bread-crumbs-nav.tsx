import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import Link from "next/link";

interface IProps {
    activeCategoryName?: string | null;
    activeCategory?: string | null;
    activeSubCategoryName?: string | null;
}


export const BreadCrumbNav = ({
                                  activeSubCategoryName,
                                  activeCategory,
                                  activeCategoryName,
                              }: IProps) => {
    if (!activeCategoryName || activeCategory === "all") {
        return null;
    }

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {activeSubCategoryName ? (
                    <>
                        <BreadcrumbItem>
                            <BreadcrumbLink
                                className="text-xl font-medium underline text-primary"
                            >
                                <Link href={`/${activeCategory}`}>
                                    {activeCategoryName}
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        <BreadcrumbSeparator className="text-primary font-medium text-lg">
                            /
                        </BreadcrumbSeparator>

                        <BreadcrumbItem>
                            <BreadcrumbPage className="text-xl font-medium">
                                {activeSubCategoryName}
                            </BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                ) : (
                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-xl font-medium">
                            {activeCategoryName}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
};
