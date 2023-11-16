import Space from "../page";
// import { getAllSpace } from "@/service/space";
export default function Page({ params }: { params: { id: string } }) {
  return <Space detailId={params.id}></Space>;
}

// export async function generateStaticParams() {
//   const data = {
//     pageNum: 1,
//     pageSize: 10000000,
//   };
//   const dynamicRes = await getAllSpace(data);
//   let { pageList = [] } = dynamicRes.result;
//   return pageList.map((item) => ({
//     id: item.sid,
//   }));
// }
