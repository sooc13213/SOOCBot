import cookie from "cookie";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { password } = req.body;

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ success: false });
  }

  // 🔐 Cookie ayarla
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admin_token", process.env.ADMIN_TOKEN, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 gün
    })
  );

  return res.status(200).json({ success: true });
}
