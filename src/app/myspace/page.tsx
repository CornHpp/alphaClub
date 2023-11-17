import MySpace from "@/app/home/page";
export default function Page({ params }: { params: { id: string } }) {
  return <MySpace isMySpace={true}></MySpace>;
}
