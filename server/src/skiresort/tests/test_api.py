import pytest


@pytest.mark.django_db
def test_task_create(client):
    pass
    # data = {"description": "test description", "beds": 4, "price": 2000}
    # response = client.post('/api/rooms/', data=data)

    # assert response.status_code == 201

    # response = client.get('/api/rooms/')

    # assert response.status_code == 200

    # assert len(response.data) == 1
