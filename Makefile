up:
	docker-compose -f compose.yml up -d

down:
	docker-compose -f compose.yml down

logs:
	docker-compose -f compose.yml logs -f

ps:
	docker ps --filter name=viettrace
