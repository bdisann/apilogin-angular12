interface ACCOUNT_INTERFACE {
  account_email?: string;
  account_username: string;
  account_password: string;
  account_fullname?: string;
  role?: string;
  workspace?: number;
}

export default ACCOUNT_INTERFACE;
