import { getApiDocs } from "@/utils/swagger";
import ReactSwagger from "./react-swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <main className="bg-white flex min-h-screen flex-col items-center justify-between p-24">
      <section className="container">
        <ReactSwagger spec={spec} />
      </section>
    </main>
  );
}
