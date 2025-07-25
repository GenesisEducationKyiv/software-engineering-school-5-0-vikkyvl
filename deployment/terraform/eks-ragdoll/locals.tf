locals {
  project     = "ragdoll"
  # region      = "eu-central-1"
  region      = "us-east-1"
  name_suffix = "platform"
  tags = {
    project = local.project
  }
}
