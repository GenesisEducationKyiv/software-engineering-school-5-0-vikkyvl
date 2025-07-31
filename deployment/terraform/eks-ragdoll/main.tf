module "ecr" {
  source = "./modules/ecr"

  platform_repo_name      = "platform"
  platform_web_repo_name  = "platform-web"
  tags                    = local.tags
}

module "eks" {
  source = "./modules/eks"

  tags                    = local.tags
  public_access_cidrs = var.public_access_cidrs
}

module "secretsmanager" {
  source = "./modules/secretsmanager"


  DB_PASSWORD             = var.DB_PASSWORD
  EMAIL_PASSWORD          = var.EMAIL_PASSWORD
  EMAIL_USER              = var.EMAIL_USER
  OPEN_WEATHER_MAP_KEY    = var.OPEN_WEATHER_MAP_KEY
  POSTGRES_DB             = var.POSTGRES_DB
  POSTGRES_PASSWORD       = var.POSTGRES_PASSWORD
  POSTGRES_USER           = var.POSTGRES_USER
  RABBITMQ_DEFAULT_PASS   = var.RABBITMQ_DEFAULT_PASS
  RABBITMQ_DEFAULT_USER   = var.RABBITMQ_DEFAULT_USER
  WEATHER_API_KEY         = var.WEATHER_API_KEY
  WEATHER_STACK_KEY       = var.WEATHER_STACK_KEY
  tags                    = local.tags
}