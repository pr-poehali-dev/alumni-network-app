const POSTS_URL = 'https://functions.poehali.dev/7a08a40d-dc7d-432a-8a93-9b441512ea6f';
const ADMIN_URL = 'https://functions.poehali.dev/0e684d10-7502-4137-aa9e-2126e45c3374';

// Уникальный session_id для каждого браузера (для лайков)
function getSessionId(): string {
  let sid = localStorage.getItem('alumni_session');
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('alumni_session', sid);
  }
  return sid;
}

const SESSION_ID = getSessionId();

// ── Posts API ──────────────────────────────────────────────────────────────

export async function fetchPosts() {
  const res = await fetch(POSTS_URL, {
    headers: { 'X-Session-Id': SESSION_ID },
  });
  const data = JSON.parse(await res.text());
  return (data.posts ?? []) as Post[];
}

export async function createPost(text: string) {
  const res = await fetch(POSTS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': SESSION_ID },
    body: JSON.stringify({ text, author: 'Я', initials: 'Я', color: 'from-violet-500 to-purple-700', school: 'Школа №47, выпуск 2018' }),
  });
  const data = JSON.parse(await res.text());
  return data.post as Post;
}

export async function toggleLike(postId: number) {
  const res = await fetch(POSTS_URL + '/like', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': SESSION_ID },
    body: JSON.stringify({ post_id: postId }),
  });
  const data = JSON.parse(await res.text());
  return data as { liked: boolean; likes: number };
}

export async function fetchComments(postId: number) {
  const res = await fetch(`${POSTS_URL}/comments?post_id=${postId}`, {
    headers: { 'X-Session-Id': SESSION_ID },
  });
  const data = JSON.parse(await res.text());
  return (data.comments ?? []) as Comment[];
}

export async function addComment(postId: number, text: string) {
  const res = await fetch(POSTS_URL + '/comments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Session-Id': SESSION_ID },
    body: JSON.stringify({ post_id: postId, text, author: 'Я', initials: 'Я' }),
  });
  const data = JSON.parse(await res.text());
  return data.comment as Comment;
}

// ── Admin API ──────────────────────────────────────────────────────────────

function adminHeaders() {
  return { 'Content-Type': 'application/json', 'X-Admin-Token': 'admin123' };
}

export async function adminGetStats() {
  const res = await fetch(ADMIN_URL, { headers: adminHeaders() });
  return JSON.parse(await res.text()) as { total_users: number; active_users: number; total_groups: number; total_posts: number };
}

export async function adminGetUsers() {
  const res = await fetch(ADMIN_URL + '/users', { headers: adminHeaders() });
  const data = JSON.parse(await res.text());
  return (data.users ?? []) as AdminUser[];
}

export async function adminUpdateUser(id: number, status: string) {
  await fetch(ADMIN_URL + '/users', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ id, status }),
  });
}

export async function adminGetGroups() {
  const res = await fetch(ADMIN_URL + '/groups', { headers: adminHeaders() });
  const data = JSON.parse(await res.text());
  return (data.groups ?? []) as AdminGroup[];
}

export async function adminUpdateGroup(id: number, status: string) {
  await fetch(ADMIN_URL + '/groups', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ id, status }),
  });
}

export async function adminGetPosts() {
  const res = await fetch(ADMIN_URL + '/posts', { headers: adminHeaders() });
  const data = JSON.parse(await res.text());
  return (data.posts ?? []) as AdminPost[];
}

export async function adminUpdatePost(id: number, status: string) {
  await fetch(ADMIN_URL + '/posts', {
    method: 'PUT',
    headers: adminHeaders(),
    body: JSON.stringify({ id, status }),
  });
}

// ── Types ──────────────────────────────────────────────────────────────────

export type Post = {
  id: number; author: string; initials: string; color: string;
  school: string; text: string; likes: number; comments: number;
  liked: boolean; status: string; time: string;
};

export type Comment = {
  id: number; author: string; initials: string; text: string; time: string;
};

export type AdminUser = {
  id: number; name: string; initials: string; color: string;
  school: string; year: string; email: string; status: string;
  posts: number; friends: number; joined: string;
};

export type AdminGroup = {
  id: number; name: string; type: string; description: string;
  initials: string; color: string; members: number; status: string; created: string;
};

export type AdminPost = {
  id: number; author: string; text: string;
  likes: number; comments: number; status: string; time: string;
};
