export type TErrorSources = {
  path: string | number;
  message: string;
}[];

export type TGenericResponseError = {
  statusCode: number;
  message: string;
  errorSources: TErrorSources;
};
