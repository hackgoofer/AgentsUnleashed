import json
import os
from uuid import uuid4
import redis
from falcon import HTTPNotFound  # pylint: disable=no-member

REDIS_CONNECTION_STRING = os.environ["REDIS_CONNECTION_STRING"]
pool = redis.ConnectionPool.from_url(REDIS_CONNECTION_STRING)


class Tasks:
    cache = redis.StrictRedis(connection_pool=pool, decode_responses=True)

    @staticmethod
    def set(task_id: str, state_obj: dict) -> dict:
        Tasks.cache.set(task_id, json.dumps(state_obj))

    @staticmethod
    def get(task_id: str) -> dict:
        cached = Tasks.cache.get(task_id)
        if cached is not None:
            return json.loads(cached)
        else:
            return None
