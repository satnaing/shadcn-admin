import { QueryClient } from "react-query";

export class QueryService {
  private static instance: QueryClient;

  public static getQueryClient(): QueryClient {
    if (!QueryService.instance) {
      QueryService.instance = new QueryClient({
        defaultOptions: { queries: { refetchOnWindowFocus: false } },
      });
    }
    return QueryService.instance;
  }
}
