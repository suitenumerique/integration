# /!\ /!\ /!\ /!\ /!\ /!\ /!\ DISCLAIMER /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# This Makefile is only meant to be used for DEVELOPMENT purpose as we are
# changing the user id that will run in the container.
#
# PLEASE DO NOT USE IT FOR YOUR CI/PRODUCTION/WHATEVER...
#
# /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\ /!\
#
# Note to developers:
#
# While editing this file, please respect the following statements:
#
# 1. Every variable should be defined in the ad hoc VARIABLES section with a
#    relevant subsection
# 2. Every new rule should be defined in the ad hoc RULES section with a
#    relevant subsection depending on the targeted service
# 3. Rules should be sorted alphabetically within their section
# 4. When a rule has multiple dependencies, you should:
#    - duplicate the rule name to add the help string (if required)
#    - write one dependency per line to increase readability and diffs
# 5. .PHONY rule statement should be written after the corresponding rule
# ==============================================================================
# VARIABLES

BOLD := \033[1m
RESET := \033[0m
GREEN := \033[1;32m

# -- Docker
# Get the current user ID to use for docker run and docker exec commands
DOCKER_UID          = $(shell id -u)
DOCKER_GID          = $(shell id -g)
DOCKER_USER         = $(DOCKER_UID):$(DOCKER_GID)
COMPOSE             = DOCKER_USER=$(DOCKER_USER) docker compose
COMPOSE_EXEC        = $(COMPOSE) exec
COMPOSE_RUN         = $(COMPOSE) run --rm --build


# ==============================================================================
# RULES

default: help

# -- Project

create-env-files: ## Create empty .local env files for local development
create-env-files: \
	ops/env/widgets.local \
	ops/env/website.local
.PHONY: create-env-files

bootstrap: ## Prepare the project for local development
	@echo "$(BOLD)"
	@echo "╔══════════════════════════════════════════════════════════════════════════════╗"
	@echo "║                                                                              ║"
	@echo "║  🚀 Welcome to Integration - Shared frontend packages from La Suite! 🚀      ║"
	@echo "║                                                                              ║"
	@echo "║  This will set up your development environment with :                        ║"
	@echo "║  • Docker containers for all services                                        ║"
	@echo "║  • Frontend dependencies and build                                           ║"
	@echo "║  • Environment configuration files                                           ║"
	@echo "║                                                                              ║"
	@echo "║  Services will be available at:                                              ║"
	@echo "║  • Website: http://localhost:8930                                            ║"
	@echo "║  • Widgets: http://localhost:8931                                            ║"
	@echo "║                                                                              ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════════╝"
	@echo "$(RESET)"
	@echo "$(GREEN)Starting bootstrap process...$(RESET)"
	@echo ""
	@$(MAKE) update
	@$(MAKE) superuser
	@$(MAKE) start
	@echo ""
	@echo "$(GREEN)🎉 Bootstrap completed successfully!$(RESET)"
	@echo ""
	@echo "$(BOLD)Next steps:$(RESET)"
	@echo "  • Visit http://localhost:8930 to access the website"
	@echo "  • Visit http://localhost:8931 to access the widgets"
	@echo "  • Run 'make help' to see all available commands"
	@echo ""
.PHONY: bootstrap

update:  ## Update the project with latest changes
	@$(MAKE) create-env-files
	@$(MAKE) build
	@$(MAKE) widgets-install
	@$(MAKE) website-install
.PHONY: update

# -- Docker/compose
build: ## build the project containers
	@$(COMPOSE) build
.PHONY: build

down: ## stop and remove containers, networks, images, and volumes
	@$(COMPOSE) down
.PHONY: down

logs: ## display all services logs (follow mode)
	@$(COMPOSE) logs -f
.PHONY: logs

start: ## start all development services
	@$(COMPOSE) up --force-recreate --build -d website-dev widgets-dev --wait
.PHONY: start

status: ## an alias for "docker compose ps"
	@$(COMPOSE) ps
.PHONY: status

stop: ## stop all development services
	@$(COMPOSE) --profile "*" stop
.PHONY: stop

restart: ## restart all development services
restart: \
	stop \
	start
.PHONY: restart

# -- Misc
clean: ## restore repository state as it was freshly cloned
	git clean -idx
.PHONY: clean

help:
	@echo "$(BOLD)messages Makefile"
	@echo "Please use 'make $(BOLD)target$(RESET)' where $(BOLD)target$(RESET) is one of:"
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(firstword $(MAKEFILE_LIST)) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "$(GREEN)%-30s$(RESET) %s\n", $$1, $$2}'
.PHONY: help

ops/env/%.local:
	@echo "# Local development overrides for $(notdir $*)" > $@
	@echo "# Add your local-specific environment variables below:" >> $@
	@echo "# Example: DJANGO_DEBUG=True" >> $@
	@echo "" >> $@

lint: ## run all linters
lint: \
  widgets-lint
.PHONY: lint


# Website
website-install: ## install the website locally
	@args="$(filter-out $@,$(MAKECMDGOALS))" && \
	$(COMPOSE) run --build --rm website-dev npm install $${args:-${1}}
.PHONY: website-install

website-freeze-deps: ## freeze the website dependencies
	rm -rf website/package-lock.json
	@$(MAKE) website-install
.PHONY: website-freeze-deps

website-shell: ## open a shell in the website container
	$(COMPOSE) run --build --rm -p 8930:8930 website-dev /bin/sh
.PHONY: website-shell

website-start: ## start the website container
	$(COMPOSE) up --force-recreate --build -d website-dev --wait
	@echo "$(BOLD)"
	@echo "╔══════════════════════════════════════════════════════════════════════════════╗"
	@echo "║                                                                              ║"
	@echo "║  🚀 Website development server with Live Reload is started! 🚀               ║"
	@echo "║                                                                              ║"
	@echo "║  Open your browser at http://localhost:8930                                  ║"
	@echo "║                                                                              ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════════╝"
	@echo "$(RESET)"
.PHONY: website-start

website-stop: ## stop the website container
	$(COMPOSE) stop website-dev
.PHONY: website-stop


website-restart: ## restart the website container and rebuild
website-restart: \
	website-stop \
	website-start
.PHONY: website-restart


# Widgets
widgets-install: ## install the widgets locally
	@args="$(filter-out $@,$(MAKECMDGOALS))" && \
	$(COMPOSE) run --build --rm widgets-dev npm install $${args:-${1}}
.PHONY: widgets-install

widgets-freeze-deps: ## freeze the widgets dependencies
	rm -rf src/widgets/package-lock.json
	@$(MAKE) widgets-install
.PHONY: widgets-freeze-deps

widgets-build: ## build the widgets
	$(COMPOSE) run --build --rm widgets-dev npm run build
.PHONY: widgets-build

widgets-lint: ## lint the widgets
	$(COMPOSE) run --build --rm widgets-dev npm run lint
.PHONY: widgets-lint

widgets-shell: ## open a shell in the widgets container
	$(COMPOSE) run --build --rm widgets-dev /bin/sh
.PHONY: widgets-shell

widgets-start: ## start the widgets container
	$(COMPOSE) up --force-recreate --build -d widgets-dev --wait
	@echo "$(BOLD)"
	@echo "╔══════════════════════════════════════════════════════════════════════════════╗"
	@echo "║                                                                              ║"
	@echo "║  🚀 Widgets development server with Live Reload is started! 🚀               ║"
	@echo "║                                                                              ║"
	@echo "║  Open your browser at http://localhost:8931                                  ║"
	@echo "║                                                                              ║"
	@echo "╚══════════════════════════════════════════════════════════════════════════════╝"
	@echo "$(RESET)"
.PHONY: widgets-start

widgets-stop: ## stop the widgets container
	$(COMPOSE) stop widgets-dev
.PHONY: widgets-stop

widgets-restart: ## restart the widgets container and rebuild
widgets-restart: \
	widgets-stop \
	widgets-build \
	widgets-start
.PHONY: widgets-restart

widgets-deploy: ## deploy the widgets to an S3 bucket
	@## Error if the env vars MESSAGES_WIDGETS_S3_PATH is not set
	@if [ -z "$$MESSAGES_WIDGETS_S3_PATH" ]; then \
		echo "Error: MESSAGES_WIDGETS_S3_PATH is not set"; \
		exit 1; \
	fi; \
	docker run --rm -ti -v .aws:/root/.aws -v `pwd`/src/widgets/dist:/aws amazon/aws-cli s3 cp --acl public-read --recursive . s3://$(MESSAGES_WIDGETS_S3_PATH)
.PHONY: widgets-deploy
