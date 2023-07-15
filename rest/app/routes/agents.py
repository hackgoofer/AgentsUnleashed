import falcon
from falcon import HTTP_200, HTTPUnprocessableEntity, HTTPNotFound, HTTPForbidden
from helpers.agents import Agents
from time import time


class AgentsRoute:
    def on_get(
        self, _: falcon.Request, resp: falcon.Response, task_id: str, agent_id: str
    ) -> falcon.Response:
        state_dict = Agents.get(task_id, agent_id)
        if state_dict:
            resp.status = falcon.HTTP_200  # pylint: disable=no-member
            resp.media = state_dict
            return resp
        else:
            raise HTTPNotFound(f"Can't find agent {agent_id}")

    def on_post(
        self, req: falcon.Request, resp: falcon.Response, task_id: str, agent_id: str
    ) -> falcon.Response:
        resp.status = falcon.HTTP_200  # pylint: disable=no-member

        obj = req.get_media()

        if not obj:
            # pylint: disable=no-member
            raise falcon.HTTPUnprocessableEntity(title="Missing project object")

        state_dict = Agents.get(task_id, agent_id)
        if state_dict:
            state_dict.update(obj)
            state_dict["updated_at"] = time()
            Agents.set(task_id, agent_id, state_dict)
            resp.status = falcon.HTTP_200  # pylint: disable=no-member
            resp.media = state_dict
            return resp
        else:
            raise HTTPNotFound(f"Can't find agent {agent_id}")
