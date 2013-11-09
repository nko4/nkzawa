
clear:
	@echo "db.dropDatabase();" | mongo vmchat
	@echo "FLUSHDB" | redis-cli -n 0

.PHONY: clear
