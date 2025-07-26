up:
	docker-compose -f compose.yml up -d

down:
	docker-compose -f compose.yml down

logs:
	docker-compose -f compose.yml logs -f

db-up:
	scripts/setup-database.sh

ps:
	docker ps --filter name=viettrace
