interface IProps {
    params: Promise<{
        category: string
    }>
}



const Page = async ({params}: IProps) => {
  const {category} = await params;

    return (
    <div>{category}</div>
  );
};

export default Page;