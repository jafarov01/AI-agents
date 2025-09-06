from app import app

def test_health():
    client = app.test_client()
    resp = client.get('/health')
    assert resp.status_code == 200
    assert resp.json['ok'] == True

def test_add():
    client = app.test_client()
    resp = client.post('/add', json={'a': 2, 'b': 3})
    assert resp.status_code == 200
    assert resp.json['result'] == 5
