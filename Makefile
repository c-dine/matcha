# Variables
COMPOSE = docker-compose
BUILD_ARG =
ENV_FILE = .env

# PHONY targets
.PHONY: all build up down restart stop clean prune logs ps fclean

# Default target
all: up

# Build target
build:
	$(COMPOSE) build $(BUILD_ARG)

# Up target
up:
	$(COMPOSE) up -d

# Down target
down:
	$(COMPOSE) down

# Restart target
re: fclean all

# Stop target
stop:
	$(COMPOSE) stop

# Clean target
clean:
	$(COMPOSE) down --volumes --remove-orphans

# Full Clean target
fclean: clean prune
	docker volume rm $$(docker volume ls -q)
	docker network rm $$(docker network ls -q)

# Prune target
prune:
	docker system prune -a

# Logs target
logs:
	$(COMPOSE) logs -f

# Ps target
ps:
	$(COMPOSE) ps

# Set environment variables
include $(ENV_FILE)
export $(shell sed 's/=.*//' $(ENV_FILE))

