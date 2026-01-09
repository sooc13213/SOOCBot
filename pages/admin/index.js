import { useEffect, useState } from "react";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sayfa açılınca giriş kontrolü
  useEffect(() => {
    fetch("/api/admin/check")
      .then(res => {
        if (res.ok) setLogged(true);
        setLoading(false);
      });
  }, []);

  async function login() {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      setLogged(true);
    } else {
      alert("Hatalı admin şifresi");
    }
  }

  if (loading) return <p>Yükleniyor...</p>;

  if (!logged) {
    return (
      <div style={{ padding: 40 }}>
        <h1>🔐 Admin Girişi</h1>
        <input
          type="password"
          placeholder="Admin şifresi"
          onChange={e => setPassword(e.target.value)}
        />
        <br /><br />
        <button onClick={login}>Giriş Yap</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Hoş geldin Admin</h1>
      <p>SOOCBot Admin Panel</p>
    </div>
  );
}
