/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSources } from "../interface/error";

const handleDuplicateError = (err: any) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);

  // The extracted value will be in the first capturing group
  const extendsMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: "",
      message: `${extendsMessage} is already exits`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: "invalid id",
    errorSources,
  };
};
export default handleDuplicateError;
