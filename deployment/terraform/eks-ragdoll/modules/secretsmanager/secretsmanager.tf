# # prod/platform
# resource "aws_secretsmanager_secret" "platform" {
#   name = "prod/platform"
#   tags = {
#     project = "ragdoll"
#   }
# }
#
# resource "aws_secretsmanager_secret_version" "platform" {
#   secret_id     = aws_secretsmanager_secret.platform.id
#   secret_string = jsonencode({
#     WEATHER_API_KEY      = var.WEATHER_API_KEY
#     OPEN_WEATHER_MAP_KEY = var.OPEN_WEATHER_MAP_KEY
#     WEATHER_STACK_KEY    = var.WEATHER_STACK_KEY
#     DB_PASSWORD          = var.DB_PASSWORD
#     EMAIL_USER           = var.EMAIL_USER
#     EMAIL_PASSWORD       = var.EMAIL_PASSWORD
#   })
# }
#
# # prod/rabbitmq
# resource "aws_secretsmanager_secret" "rabbitmq" {
#   name = "prod/rabbitmq"
#   tags = {
#     project = "ragdoll"
#   }
# }
#
# resource "aws_secretsmanager_secret_version" "rabbitmq" {
#   secret_id     = aws_secretsmanager_secret.rabbitmq.id
#   secret_string = jsonencode({
#     RABBITMQ_DEFAULT_USER = var.RABBITMQ_DEFAULT_USER
#     RABBITMQ_DEFAULT_PASS = var.RABBITMQ_DEFAULT_PASS
#   })
# }
#
# # prod/postgres
# resource "aws_secretsmanager_secret" "postgres" {
#   name = "prod/postgres"
#   tags = {
#     project = "ragdoll"
#   }
# }
#
# resource "aws_secretsmanager_secret_version" "postgres" {
#   secret_id     = aws_secretsmanager_secret.postgres.id
#   secret_string = jsonencode({
#     POSTGRES_USER     = var.POSTGRES_USER
#     POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
#     POSTGRES_DB       = var.POSTGRES_DB
#   })
# }

# prod/general
resource "aws_secretsmanager_secret" "general" {
  name = "prod/general"
  tags = {
    project = "ragdoll"
  }
}

resource "aws_secretsmanager_secret_version" "general" {
  secret_id     = aws_secretsmanager_secret.general.id
  secret_string = jsonencode({
    WEATHER_API_KEY      = var.WEATHER_API_KEY
    OPEN_WEATHER_MAP_KEY = var.OPEN_WEATHER_MAP_KEY
    WEATHER_STACK_KEY    = var.WEATHER_STACK_KEY
    DB_PASSWORD          = var.DB_PASSWORD
    EMAIL_USER           = var.EMAIL_USER
    EMAIL_PASSWORD       = var.EMAIL_PASSWORD

    POSTGRES_USER     = var.POSTGRES_USER
    POSTGRES_PASSWORD = var.POSTGRES_PASSWORD
    POSTGRES_DB       = var.POSTGRES_DB

    RABBITMQ_DEFAULT_USER = var.RABBITMQ_DEFAULT_USER
    RABBITMQ_DEFAULT_PASS = var.RABBITMQ_DEFAULT_PASS
  })
}

