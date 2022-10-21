from types import SimpleNamespace

import dotenv


env_values: dict[str, str | None] = dotenv.dotenv_values("server.env")

for key, value in list(env_values.items()):
    try:
        env_values[key] = int(value)
    except ValueError:
        pass

settings = SimpleNamespace(**env_values)
