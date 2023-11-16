import Space from "../space/page";
export default function Page({ params }: { params: { id: string } }) {
  return <Space detailId={params.id}></Space>;
}
