interface IProps {
    params: Promise<{
        category: string;
        subcategory: string;
    }>
}



const Page = async ({params}: IProps) => {
    const {category,subcategory} = await params;

    return (
        <div>{category}/{subcategory}</div>
    );
};

export default Page;