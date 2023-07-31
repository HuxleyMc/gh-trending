import {
  allTrendingResponse,
  developersTrendingResponse,
  languageTrendingResponse,
} from "@/constants/exampleResponses";
import Image from "next/image";

const Endpoint = ({
  endpoint,
  description,
  params,
  response,
  exampleUrl,
}: {
  endpoint: string;
  exampleUrl?: string;
  description: string;
  params: Array<{
    name: string;
    description: string;
    required: boolean;
    possibleValues?: Array<string>;
  }>;
  response: string;
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mt-6 mb-2">{description}</h3>
      <p className={`${exampleUrl ? "mb-2" : "mb-4"} font-semibold`}>
        Endpoint: <code className="p-1 font-normal">{endpoint}</code>
      </p>
      {exampleUrl ? (
        <p className="mb-4 font-semibold">
          Example URL: <code className="p-1 font-normal">{exampleUrl}</code>
        </p>
      ) : null}
      <p className="mb-2 font-bold">Parameters:</p>
      <ul className="list-disc list-inside mb-4">
        {params.map((param) => (
          <ul key={param.name}>
            <p>
              <span className="font-medium">
                {param.required ? "Required:" : "Optional:"}
              </span>{" "}
              {param.description}
            </p>
            <code className="p-1">`{param.name}`</code>:{" "}
            {param.possibleValues && (
              <>
                {param.possibleValues.map((value) => (
                  <code key={value} className=" p-1">
                    {value}
                  </code>
                ))}
              </>
            )}
          </ul>
        ))}
      </ul>
      <p className="mb-4 font-bold">Response Format:</p>
      <pre className="p-2 border-white border bg-slate-200 bg-opacity-10">
        {response}
      </pre>
    </div>
  );
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="container mx-auto p-6">
        <h1 className="text-4xl font-bold mb-6">GitHub Trending API</h1>
        <p className="mb-4">
          This repository provides an API to fetch trending repositories and
          developers from GitHub. The API is hosted at the base URL:
          <code className="font-semibold p-1">
            `https://gh-trending.vercel.app`
          </code>
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">API Endpoints</h2>

        <Endpoint
          endpoint="/api/trending"
          description="Get trending repositories."
          params={[
            {
              name: "since",
              description: "Filter repositories by trending duration.",
              required: false,
              possibleValues: ["daily", "weekly", "monthly"],
            },
            {
              name: "spoken_language_code",
              description: "Filter repositories by spoken language code.",
              required: false,
              possibleValues: ["en,", "jp,", "etc..."],
            },
          ]}
          response={allTrendingResponse}
        />

        <Endpoint
          endpoint="/api/trending/[language]"
          exampleUrl="/api/trending/swift"
          description="Get trending repositories by language."
          params={[
            {
              name: "since",
              description: "Filter repositories by trending duration.",
              required: false,
              possibleValues: ["daily", "weekly", "monthly"],
            },
            {
              name: "spoken_language_code",
              description: "Filter repositories by spoken language code.",
              required: false,
              possibleValues: ["en,", "jp,", "etc..."],
            },
          ]}
          response={languageTrendingResponse}
        />

        <Endpoint
          endpoint="/api/trending/developers"
          description="Get trending developers."
          params={[
            {
              name: "since",
              description: "Filter developers by trending duration.",
              required: false,
              possibleValues: ["daily", "weekly", "monthly"],
            },
            {
              name: "sponsorable",
              description: "Filter developers who are sponsorable.",
              required: false,
              possibleValues: ["1"],
            },
          ]}
          response={developersTrendingResponse}
        />

        <Endpoint
          endpoint="/api/trending/developers/[language]"
          exampleUrl="/api/trending/developers/typescript"
          description="Get trending developers by language."
          params={[
            {
              name: "since",
              description: "Filter developers by trending duration.",
              required: false,
              possibleValues: ["daily", "weekly", "monthly"],
            },
            {
              name: "sponsorable",
              description: "Filter developers who are sponsorable.",
              required: false,
              possibleValues: ["1"],
            },
          ]}
          response={developersTrendingResponse}
        />
      </div>
    </main>
  );
}
