import { User } from "~/structures/User";
import { APIUser } from "types/APIUser";

export class UserManager {
  private static _instance: UserManager;
  public cache: Map<number, User> = new Map();
  private constructor() {}
  public static getInstance() {
    if (!this._instance) this._instance = new UserManager();
    return UserManager._instance;
  }

  public async refreshCache(id: number | undefined = undefined) {
    if (id) {
      const user = await $fetch<APIUser>(`/api/users/${id}`);
      if (user) this.cache.set(id, new User(user));
    } else {
      const users = await $fetch<APIUser[]>("/api/users");
      if (users)
        for (const user of users) this.cache.set(user.id, new User(user));
    }
  }

  public async fetch(id: number): Promise<User | null> {
    const cachedUser = this.cache.get(id);
    if (cachedUser) return cachedUser;

    const apiUser = await $fetch<APIUser>(`/api/users/${id}`);
    if (!apiUser) return null;

    const user = new User(apiUser);
    this.cache.set(id, user);
    return user;
  }
}
