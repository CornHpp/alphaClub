import MySpace from "@/app/page";
export default function Page({ params }: { params: { id: string } }) {
  return <MySpace isMySpace={true}></MySpace>;
}
