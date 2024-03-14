import { Client, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const account = new Databases(client);

const GetListData = async (
  databaseId: string,
  collectionId: string,
  query?: string[]
) => {
  return await account.listDocuments(databaseId, collectionId, query);
};

export { GetListData };
