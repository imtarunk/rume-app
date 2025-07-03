import { getPortfolioData } from "@/components/templates/v1/data";
import V1Portfolio from "@/components/templates/v1/v1";
import V2Portfolio from "@/components/templates/v1/v2";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const PreviewPage = async ({ params }: { params: { userId: string } }) => {
  const { userId } = await params;
  const data = await getPortfolioData({ userId });

  let content;
  switch (data.templateId) {
    case "classic-v1":
      content = <V1Portfolio data={data} />;
      break;
    case "modern-v2":
      content = <V2Portfolio data={data} />;
      break;
    default:
      content = <div>No valid template selected.</div>;
  }

  return <div className={inter.className}>{content}</div>;
};

export default PreviewPage;
