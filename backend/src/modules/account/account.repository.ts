import { AccountDAO } from "./account.dao.js";
export class AccountRepository { constructor(private readonly dao = new AccountDAO()) {} getOverview(userId: string) { return this.dao.getOverview(userId); } }
