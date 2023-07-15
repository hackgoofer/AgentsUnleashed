from falcon import Request, Response
from falcon import HTTP_200, HTTPUnprocessableEntity, HTTPNotFound, HTTPForbidden
from helpers.launcher import launch_task
from helpers.tasks import Tasks
from helpers.agents import Agents
from uuid import uuid4
from time import time


class Launcher:
    def on_post(self, req: Request, resp: Response) -> Response:
        """
        IMPORTANT: This endpoint is open EXTERNALLY, and must remain so!!

        Send the magic link to the user's email.
        """
        resp.status = HTTP_200  # pylint: disable=no-member
        obj = req.get_media()
        # Validate the email
        task: str = obj["task"]
        if not task:
            # pylint: disable=no-member
            raise HTTPUnprocessableEntity(title="'task' not provided")

        task_id = str(uuid4())
        launch_task(task_id, task)
        Tasks.set(task_id, {"task": task, "created": time()})
        for agent_id in ["auto_gpt", "baby_agi"]:
            Agents.set(task_id, agent_id, {"completed": 0})

        resp.media = {"task_id": task_id}
        resp.status = HTTP_200  # pylint: disable=no-member
        return resp
