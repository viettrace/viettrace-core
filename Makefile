dev-up:
	docker-compose -f infra/compose.yml --profile dev up -d

dev-down:
	docker-compose -f infra/compose.yml --profile dev down

dev-logs:
	docker-compose -f infra/compose.yml --profile dev logs -f

vault-shell:
	docker exec -it viettrace-vault sh

ps:
	docker ps --filter name=viettrace
