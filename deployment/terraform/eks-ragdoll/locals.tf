locals {
  project     = "ragdoll"
  # region      = "eu-central-1"
  region      = "us-east-1"

  tags = {
    project = local.project
  }
}
