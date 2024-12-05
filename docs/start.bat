REM podman or docker
podman run -it --rm --network host -v ../:/usr/src/myapp -w /usr/src/myapp  mkdocs-mike /bin/bash
