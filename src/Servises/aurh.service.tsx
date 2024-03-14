import { Client, Account, ID } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("65e6a6f0780da76d3c7e");

const account = new Account(client);

const UserLogin = async (username: string, password: string) => {
  return await account.createEmailSession(username, password);
};

const UserLogout = async () => {
  return await account.deleteSession("current");
};

const UserRegister = async (username: string, password: string) => {
  return await account.create(ID.unique(), username, password);
};

export { UserLogin, UserLogout, UserRegister };
