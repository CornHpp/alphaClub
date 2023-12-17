import MySpace from "@/app/home/page";
import { LeaveInsights } from "@/lib/appInsights";
export default function Page({ params }: { params: { id: string } }) {
  return <MySpace isMySpace={true}></MySpace>;
}
