import { ZodError } from "zod";
import { TErrorSources, TGenericResponseError } from "../interface/error";

const handleZodError = (err: ZodError): TGenericResponseError => {
  const errorSources: TErrorSources = err.issues.map((issue) => {
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });
  const statusCode = 400;
  return {
    statusCode,
    message: "validation error",
    errorSources,
  };
};

export default handleZodError;
