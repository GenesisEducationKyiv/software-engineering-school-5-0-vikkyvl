resource "aws_ecr_repository" "platform" {
  name                 = var.platform_repo_name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags                 = var.tags
}

resource "aws_ecr_repository" "platform_web" {
  name                 = var.platform_web_repo_name
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
  tags                 = var.tags
}
