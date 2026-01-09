import cookie from "cookie";

export default function handler(req, res) {
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.admin_token;

  if (token === process.env.ADMIN_TOKEN) {
    return res.status(200).json({ logged: true });
  }

  return res.status(401).json({ logged: false });
}
