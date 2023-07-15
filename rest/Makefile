build:
	docker compose build

run: build
	docker compose up --remove-orphans

clean:
	docker compose down

nbuild:
	nerdctl compose build

nrun: nbuild
	nerdctl compose up --remove-orphans

nclean:
	nerdctl compose down