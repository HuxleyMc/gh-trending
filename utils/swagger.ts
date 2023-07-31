import { createSwaggerSpec } from "next-swagger-doc";

import "server-only";

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "app/api", // define api folder under app folder
    schemaFolders: ["schemas"], // define schema folder under app folder
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Next Swagger API Example",
        version: "1.0",
      },
    },
  });
  return spec;
};
