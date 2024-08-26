"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateError = (err) => {
  // Extract value within double quotes using regex
  const match = err.message.match(/"([^"]*)"/);
  // The extracted value will be in the first capturing group
  const extendsMessage = match && match[1];
  const errorSources = [
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
exports.default = handleDuplicateError;
