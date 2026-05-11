import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

SCHEMA = os.environ.get('MAIN_DB_SCHEMA', 't_p23442598_alumni_network_app')

SEED_USERS = [
    ('Алина Соколова', 'АС', 'from-violet-500 to-purple-700', 'Школа №47', '2018', 'alina@mail.ru', 'active', 47, 124),
    ('Максим Воронов', 'МВ', 'from-pink-500 to-rose-600', 'Школа №47', '2018', 'maxim@mail.ru', 'active', 31, 89),
    ('Дарья Климова', 'ДК', 'from-teal-400 to-cyan-600', 'Школа №47', '2019', 'dasha@mail.ru', 'active', 58, 210),
    ('Игорь Петров', 'ИП', 'from-amber-400 to-orange-500', 'Школа №15', '2017', 'igor@mail.ru', 'pending', 5, 14),
    ('Света Лебедева', 'СЛ', 'from-indigo-500 to-blue-600', 'Школа №3', '2020', 'sveta@mail.ru', 'banned', 0, 7),
    ('Роман Сидоров', 'РС', 'from-green-400 to-emerald-500', 'Школа №47', '2017', 'roman@mail.ru', 'active', 22, 63),
]

SEED_POSTS = [
    (1, 'Алина Соколова', 'АС', 'from-violet-500 to-purple-700', 'Школа №47, выпуск 2018', 'Не верится, что прошло уже 6 лет с выпускного! 🎓 Кто помнит, как мы отмечали на крыше Коли? Лучший вечер в жизни', 34, 1),
    (2, 'Максим Воронов', 'МВ', 'from-pink-500 to-rose-600', 'Школа №47, выпуск 2018', 'Ребята, организую встречу выпускников в июне! Кто за? Планирую в кафе «Летний» на Садовой. Пишите в личку или комментируйте', 51, 19),
    (3, 'Дарья Климова', 'ДК', 'from-teal-400 to-cyan-600', 'Школа №47, выпуск 2019', 'Нашла старые фотки с последнего звонка 📸 Какие же мы были маленькие! Время летит невероятно быстро. Всех люблю ♥', 88, 24),
]

SEED_COMMENTS = [
    (1, 'Игорь П.', 'ИП', 'Да, я тоже помню! Было незабываемо 🔥'),
]

SEED_GROUPS = [
    ('Выпуск 2018 🎓', 'group', 'Общая группа выпускников 2018 года', 'ВП', 'from-violet-500 to-purple-700', 143, 'active'),
    ('Школа №47 — Новости', 'channel', 'Официальный канал новостей школы', 'НК', 'from-pink-500 to-rose-600', 312, 'active'),
    ('Встреча в июне', 'group', 'Организация встречи выпускников', 'ВИ', 'from-teal-400 to-cyan-600', 38, 'active'),
    ('Фотоальбом выпуска', 'channel', 'Архив фотографий с выпускного', 'ФА', 'from-amber-400 to-orange-500', 87, 'hidden'),
]

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Session-Id',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'], cursor_factory=RealDictCursor)


def seed_if_empty(cur):
    """Заполняем таблицы начальными данными если они пустые"""
    cur.execute(f'SELECT COUNT(*) as cnt FROM {SCHEMA}.users')
    if cur.fetchone()['cnt'] == 0:
        for u in SEED_USERS:
            cur.execute(
                f"INSERT INTO {SCHEMA}.users (name,initials,color,school,year,email,status,posts_count,friends_count) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)",
                u
            )
        for p in SEED_POSTS:
            cur.execute(
                f"INSERT INTO {SCHEMA}.posts (user_id,author_name,author_initials,author_color,school,text,likes_count,comments_count) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",
                p
            )
        for c in SEED_COMMENTS:
            cur.execute(
                f"INSERT INTO {SCHEMA}.comments (post_id,author_name,author_initials,text) VALUES (%s,%s,%s,%s)",
                c
            )
        cur.execute(f'SELECT COUNT(*) as cnt FROM {SCHEMA}.groups')
        if cur.fetchone()['cnt'] == 0:
            for g in SEED_GROUPS:
                cur.execute(
                    f"INSERT INTO {SCHEMA}.groups (name,type,description,initials,color,members_count,status) VALUES (%s,%s,%s,%s,%s,%s,%s)",
                    g
                )


def fmt_post(p, session_id=''):
    return {
        'id': p['id'],
        'author': p['author_name'],
        'initials': p['author_initials'],
        'color': p['author_color'],
        'school': p['school'],
        'text': p['text'],
        'likes': p['likes_count'],
        'comments': p['comments_count'],
        'liked': bool(p.get('liked')),
        'status': p['status'],
        'time': p['created_at'].strftime('%d.%m.%Y %H:%M') if p.get('created_at') else '',
    }


def handler(event: dict, context) -> dict:
    """API для постов: GET получить ленту, POST создать пост"""
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    method = event.get('httpMethod', 'GET')
    path = event.get('path', '/')
    session_id = event.get('headers', {}).get('X-Session-Id', 'anon')

    conn = get_conn()
    cur = conn.cursor()
    seed_if_empty(cur)
    conn.commit()

    try:
        # GET /posts — лента постов
        if method == 'GET' and (path == '/' or path == '/posts'):
            cur.execute(f"""
                SELECT p.*,
                  (SELECT COUNT(*) FROM {SCHEMA}.likes l WHERE l.post_id = p.id AND l.session_id = %s) as liked
                FROM {SCHEMA}.posts p
                WHERE p.status = 'active'
                ORDER BY p.created_at DESC
                LIMIT 50
            """, (session_id,))
            posts = [fmt_post(r, session_id) for r in cur.fetchall()]
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'posts': posts}, ensure_ascii=False)}

        # POST /posts — создать пост
        if method == 'POST':
            body = json.loads(event.get('body') or '{}')
            text = body.get('text', '').strip()
            if not text:
                conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'text required'})}
            author = body.get('author', 'Я')
            initials = body.get('initials', 'Я')
            color = body.get('color', 'from-violet-500 to-purple-700')
            school = body.get('school', '')
            cur.execute(
                f"INSERT INTO {SCHEMA}.posts (author_name,author_initials,author_color,school,text) VALUES (%s,%s,%s,%s,%s) RETURNING *",
                (author, initials, color, school, text)
            )
            post = fmt_post(cur.fetchone())
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'post': post}, ensure_ascii=False)}

        # POST /like — лайк
        if method == 'POST' and 'like' in path:
            body = json.loads(event.get('body') or '{}')
            post_id = body.get('post_id')
            cur.execute(f"SELECT id FROM {SCHEMA}.likes WHERE post_id=%s AND session_id=%s", (post_id, session_id))
            existing = cur.fetchone()
            if existing:
                cur.execute(f"UPDATE {SCHEMA}.posts SET likes_count = likes_count - 1 WHERE id=%s AND likes_count > 0", (post_id,))
                # mark as removed
                cur.execute(f"UPDATE {SCHEMA}.likes SET session_id='' WHERE post_id=%s AND session_id=%s", (post_id, session_id))
                liked = False
            else:
                cur.execute(f"INSERT INTO {SCHEMA}.likes (post_id, session_id) VALUES (%s,%s) ON CONFLICT DO NOTHING", (post_id, session_id))
                cur.execute(f"UPDATE {SCHEMA}.posts SET likes_count = likes_count + 1 WHERE id=%s", (post_id,))
                liked = True
            cur.execute(f"SELECT likes_count FROM {SCHEMA}.posts WHERE id=%s", (post_id,))
            row = cur.fetchone()
            conn.commit()
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'liked': liked, 'likes': row['likes_count']})}

        # GET /comments?post_id=X
        if method == 'GET' and 'comment' in path:
            post_id = event.get('queryStringParameters', {}).get('post_id')
            cur.execute(f"SELECT * FROM {SCHEMA}.comments WHERE post_id=%s ORDER BY created_at ASC", (post_id,))
            rows = cur.fetchall()
            comments = [{'id': r['id'], 'author': r['author_name'], 'initials': r['author_initials'], 'text': r['text'], 'time': r['created_at'].strftime('%H:%M')} for r in rows]
            conn.close()
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'comments': comments}, ensure_ascii=False)}

        # POST /comments — добавить комментарий
        if method == 'POST' and 'comment' in path:
            body = json.loads(event.get('body') or '{}')
            post_id = body.get('post_id')
            text = body.get('text', '').strip()
            author = body.get('author', 'Я')
            initials = body.get('initials', 'Я')
            if not text or not post_id:
                conn.close()
                return {'statusCode': 400, 'headers': CORS, 'body': json.dumps({'error': 'post_id and text required'})}
            cur.execute(
                f"INSERT INTO {SCHEMA}.comments (post_id,author_name,author_initials,text) VALUES (%s,%s,%s,%s) RETURNING *",
                (post_id, author, initials, text)
            )
            row = cur.fetchone()
            cur.execute(f"UPDATE {SCHEMA}.posts SET comments_count = comments_count + 1 WHERE id=%s", (post_id,))
            conn.commit()
            conn.close()
            comment = {'id': row['id'], 'author': row['author_name'], 'initials': row['author_initials'], 'text': row['text'], 'time': row['created_at'].strftime('%H:%M')}
            return {'statusCode': 200, 'headers': CORS, 'body': json.dumps({'comment': comment}, ensure_ascii=False)}

        conn.close()
        return {'statusCode': 404, 'headers': CORS, 'body': json.dumps({'error': 'not found'})}

    except Exception as e:
        conn.rollback()
        conn.close()
        return {'statusCode': 500, 'headers': CORS, 'body': json.dumps({'error': str(e)})}
