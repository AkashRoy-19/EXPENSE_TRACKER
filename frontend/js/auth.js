document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const user = {
    username: document.getElementById('username').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  try {
    const res = await fetch('http://localhost:5500/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user)
    });

    // Debugging info
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Raw response:", text);

    let data = {};
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      throw new Error("Server returned invalid JSON.");
    }

    if (!res.ok) throw new Error(data.message || "Registration failed");

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = 'login.html';
  } catch (err) {
    alert("Registration error: " + err.message);
  }
});
