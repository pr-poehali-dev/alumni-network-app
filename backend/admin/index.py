import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p23442598_alumni_network_app')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Token',
}

ADMIN_TOKEN = 'admin123'


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)


def auth(event):
    token = event.get('headers', {}).get('X-Admin-Token', '')
    return token == ADMIN_TOKEN


def handler(event: dict, context) -> dict:
    """Админ API: управление пользователями, постами, группами"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    if not auth(event):
        return {'statusCode': 403, 'headers': CORS, 'body': json.dumps({'error': 'forbidden'})}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── Пользователи ──────────────────────────────────────────────────────

        if 'users' in path:
            if method == 'GET':
                cur.execute(f"SELECT * FROM {SCHEMA}.users ORDER BY joined_at DESC")
                rows = cur.fetchall()
                users = [{
                    'id': r['id'], 'name': r['name'], 'initials': r['initials'],
                    'color': r['color'], 'school': r['school'], 'year': r['year'],
                    'email': r['email'], 'status': r['status'],
                    'posts': r['posts_count'], 'friends': r['friends_count'],
                    'joined': r['joined_at'].strftime('%d.%m.%Y'),
                } for r in rows]
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'users': users}, ensure_ascii=False)}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                user_id = body.get('id')
                status = body.get('status')
                if user_id and status:
                    cur.execute(f"UPDATE {SCHEMA}.users SET status=%s WHERE id=%s", (status, user_id))
                    conn.commit()
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # ── Группы ───────────────────────────────────────────────────────────

        if 'groups' in path:
            if method == 'GET':
                cur.execute(f"SELECT * FROM {SCHEMA}.groups ORDER BY created_at DESC")
                rows = cur.fetchall()
                groups = [{
                    'id': r['id'], 'name': r['name'], 'type': r['type'],
                    'description': r['description'], 'initials': r['initials'],
                    'color': r['color'], 'members': r['members_count'],
                    'status': r['status'], 'created': r['created_at'].strftime('%d.%m.%Y'),
                } for r in rows]
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'groups': groups}, ensure_ascii=False)}

            if method == 'POST':
                body = json.loads(event.get('body') or '{}')
                cur.execute(
                    f"INSERT INTO {SCHEMA}.groups (name,type,description,initials,color) VALUES (%s,%s,%s,%s,%s) RETURNING *",
                    (body.get('name', 'Новая группа'), body.get('type', 'group'),
                     body.get('description', ''), body.get('initials', 'НГ'),
                     body.get('color', 'from-violet-500 to-purple-700'))
                )
                row = cur.fetchone()
                conn.commit()
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'id': row['id']}, ensure_ascii=False)}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                gid = body.get('id')
                status = body.get('status')
                if gid and status:
                    cur.execute(f"UPDATE {SCHEMA}.groups SET status=%s WHERE id=%s", (status, gid))
                    conn.commit()
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # ── Посты ─────────────────────────────────────────────────────────────

        if 'posts' in path:
            if method == 'GET':
                cur.execute(f"SELECT * FROM {SCHEMA}.posts ORDER BY created_at DESC")
                rows = cur.fetchall()
                posts = [{
                    'id': r['id'], 'author': r['author_name'], 'text': r['text'],
                    'likes': r['likes_count'], 'comments': r['comments_count'],
                    'status': r['status'], 'time': r['created_at'].strftime('%d.%m %H:%M'),
                } for r in rows]
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'posts': posts}, ensure_ascii=False)}

            if method == 'PUT':
                body = json.loads(event.get('body') or '{}')
                pid = body.get('id')
                status = body.get('status')
                if pid and status:
                    cur.execute(f"UPDATE {SCHEMA}.posts SET status=%s WHERE id=%s", (status, pid))
                    conn.commit()
                conn.close()
                return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'ok': True})}

        # ── Статистика ────────────────────────────────────────────────────────

        if method == 'GET':
            cur.execute(f"SELECT COUNT(*) as cnt FROM {SCHEMA}.users")
            total_users = cur.fetchone()['cnt']
            cur.execute(f"SELECT COUNT(*) as cnt FROM {SCHEMA}.users WHERE status='active'")
            active_users = cur.fetchone()['cnt']
            cur.execute(f"SELECT COUNT(*) as cnt FROM {SCHEMA}.groups")
            total_groups = cur.fetchone()['cnt']
            cur.execute(f"SELECT COUNT(*) as cnt FROM {SCHEMA}.posts")
            total_posts = cur.fetchone()['cnt']
            conn.close()
            return {
                'statusCode': 200, 'headers': CORS,
                'body': json.dumps({'total_users': total_users, 'active_users': active_users, 'total_groups': total_groups, 'total_posts': total_posts})
            }

        conn.close()
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'not found'})}

    except Exception as e:
        conn.rollback()
        conn.close()
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': str(e)})}
