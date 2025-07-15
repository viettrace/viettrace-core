# Vault Configuration File

# UI Configuration
ui = true

# Listener Configuration
listener "tcp" {
  address     = "0.0.0.0:8200"
  tls_disable = 1  # Disabled for simplicity - enable in production
}

# Storage Backend - File storage for single instance
storage "file" {
  path = "/vault/file"
}

# API Address - how clients connect to Vault
api_addr = "http://localhost:8200"

# Disable memory locking for containers
disable_mlock = true

# Log level
log_level = "INFO"

# Log format
log_format = "standard"

# Plugin directory
plugin_directory = "/vault/plugins"

# Default lease settings
default_lease_ttl = "24h"
max_lease_ttl = "720h"

# Enable raw endpoint (useful for health checks)
raw_storage_endpoint = true

# Seal Configuration - enable in production
# seal "awskms" {
#   region     = "us-east-1"
#   kms_key_id = "12345678-abcd-1234-abcd-123456789101"
#   endpoint   = "example.kms.us-east-1.vpce.amazonaws.com"
# }
