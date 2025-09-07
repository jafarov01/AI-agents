from app import app

def test_health():
    client = app.test_client()
    resp = client.get('/health')
    assert resp.status_code == 200
    try:
        json_data = resp.get_json()
        assert json_data is not None
        assert json_data['ok'] is True
    except Exception as e:
        assert False, f"Failed to parse JSON response: {e}"

def test_add():
    client = app.test_client()
    resp = client.post('/add', json={'a': 2, 'b': 3})
    assert resp.status_code == 200
    try:
        json_data = resp.get_json()
        assert json_data is not None
        assert json_data['result'] == 5
    except Exception as e:
        assert False, f"Failed to parse JSON response: {e}"
