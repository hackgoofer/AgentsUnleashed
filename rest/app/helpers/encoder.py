from json import JSONEncoder
from datetime import datetime, date, time


class CustomJsonEncoder(JSONEncoder):
    def default(self, o):
        if isinstance(o, datetime) or isinstance(o, date) or isinstance(o, time):
            return o.isoformat()
        # Let the base class default method raise the TypeError
        return JSONEncoder.default(self, o)
