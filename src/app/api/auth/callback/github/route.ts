import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://assignmentserver.hmnoman.com/api';

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=github_cancelled', request.url));
  }

  try {
    const res = await fetch(`${apiUrl}/auth/github`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok || !data.success || !data.token) {
      const msg = encodeURIComponent(data.message || 'GitHub login failed');
      return NextResponse.redirect(new URL(`/login?error=${msg}`, request.url));
    }

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Signing In with GitHub...</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
      color: #111827;
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid #e5e7eb;
      border-top-color: #059669;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="spinner"></div>
  <p>Authenticating with GitHub, please wait...</p>
  <script>
    try {
      localStorage.setItem('kindnet_token', ${JSON.stringify(data.token)});
      const redirect = localStorage.getItem('auth_redirect') || '/events';
      localStorage.removeItem('auth_redirect');
      window.location.href = redirect;
    } catch (e) {
      window.location.href = '/login';
    }
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('GitHub callback route error:', err);
    return NextResponse.redirect(new URL('/login?error=server_error', request.url));
  }
}

