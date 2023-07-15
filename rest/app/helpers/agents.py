import json
import os
from uuid import uuid4
import redis
from falcon import HTTPNotFound  # pylint: disable=no-member

REDIS_CONNECTION_STRING = os.environ["REDIS_CONNECTION_STRING"]
pool = redis.ConnectionPool.from_url(REDIS_CONNECTION_STRING)


class Agents:
    cache = redis.StrictRedis(connection_pool=pool, decode_responses=True)

    @staticmethod
    def set(task_id: str, agent_id: str, state_obj: dict) -> dict:
        cache_key = f"{task_id}:{agent_id}"
        Agents.cache.set(cache_key, json.dumps(state_obj))

    @staticmethod
    def get(task_id: str, agent_id: str) -> dict:
        cache_key = f"{task_id}:{agent_id}"
        cached = Agents.cache.get(cache_key)
        if cached is not None:
            return json.loads(cached)
        else:
            return None
