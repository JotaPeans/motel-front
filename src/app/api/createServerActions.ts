import { AxiosError } from "axios";

export interface ResponseProps<T> {
  data: T | null;
  error: {
    message: string;
  } | null;
}

export default async function createServerAction<T>(
  callback: () => Promise<T>,
  caller: string,
  disableGetUser?: false
): Promise<ResponseProps<T>>;

export default async function createServerAction<T>(
  callback: () => Promise<T>,
  caller: string,
): Promise<ResponseProps<T>> {
  try {
    const returnData = await callback();

    return {
      data: returnData,
      error: null,
    };
  } catch (error) {
    let message = "";
    if (error instanceof AxiosError) {
      message = error.response?.data.error || "";
    }

    if (error instanceof Error) {
      message = error.message;
    }

    console.log(`🚀 ~ ${caller} error:`, message);

    return {
      data: null,
      error: {
        message: message,
      },
    };
  }
}
